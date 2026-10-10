import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { db } from "../db/store.ts";
import { ToolCallInterceptor } from "../sandbox/interceptor.ts";
import { MemoryAuditor } from "../sandbox/memoryAuditor.ts";
import { TraceLogger } from "../sandbox/traceLogger.ts";
import type { TargetAgent, AttackRun, DefenseProfile } from "../models/types.ts";

export const apiRouter = Router();

// Wrapper for safe async error propagation
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 1. Target Agent Registration
apiRouter.post(
  "/targets/register",
  asyncHandler((req: Request, res: Response) => {
    const { name, systemPrompt, modelName = "gpt-4o-mini", toolDefinitions = [] } = req.body || {};

    if (!name || typeof name !== "string" || !systemPrompt || typeof systemPrompt !== "string") {
      return res.status(400).json({ error: "Invalid payload: name and systemPrompt (strings) are required" });
    }

    const agent: TargetAgent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      systemPrompt: systemPrompt.trim(),
      modelName: String(modelName).trim(),
      toolDefinitions: Array.isArray(toolDefinitions) ? toolDefinitions : [],
      createdAt: new Date().toISOString(),
    };

    db.agents.set(agent.id, agent);
    db.save();

    return res.status(201).json(agent);
  })
);

apiRouter.get(
  "/targets",
  asyncHandler((_req: Request, res: Response) => {
    return res.json(Array.from(db.agents.values()));
  })
);

apiRouter.get(
  "/targets/:id",
  asyncHandler((req: Request, res: Response) => {
    const agent = db.agents.get(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: "Target agent not found" });
    }
    return res.json(agent);
  })
);

// 2. Autonomous Attack Trigger & Sandbox Execution
apiRouter.post(
  "/attacks/start",
  asyncHandler((req: Request, res: Response) => {
    const { targetId, attackType = "prompt_injection", payload, simulatedToolCall, simulatedToolArgs = {} } = req.body || {};

    if (!targetId || !payload) {
      return res.status(400).json({ error: "Invalid payload: targetId and payload are required" });
    }

    const target = db.agents.get(targetId);
    if (!target) {
      return res.status(404).json({ error: "Target agent not found" });
    }

    const logger = new TraceLogger();
    let success = false;
    let severity: AttackRun["severity"] = "LOW";

    // Step 1: Adversarial Prompt Injected
    logger.record(
      "ADVERSARIAL_PROMPT",
      { prompt: String(payload) },
      false,
      "Adversarial prompt injected into target context."
    );

    // Step 2: Memory Audit
    const memoryAuditor = new MemoryAuditor();
    const preMemory = { instructions: target.systemPrompt };
    const postMemory = { instructions: target.systemPrompt, injected: String(payload) };
    const memDiff = memoryAuditor.analyzeDiff(preMemory, postMemory, 2);

    logger.record(
      "MEMORY_AUDIT",
      memDiff as unknown as Record<string, unknown>,
      memDiff.isCompromised,
      memDiff.isCompromised ? "Memory state poisoned by injection." : "Memory state intact."
    );

    if (memDiff.isCompromised) {
      success = true;
      severity = "HIGH";
    }

    // Step 3: Tool Permission Interception
    if (simulatedToolCall) {
      const interceptor = new ToolCallInterceptor(target.toolDefinitions);
      const interception = interceptor.evaluate(
        String(simulatedToolCall),
        (typeof simulatedToolArgs === "object" && simulatedToolArgs !== null) ? simulatedToolArgs : {}
      );

      const isViolation = !interception.allowed;
      if (isViolation) {
        success = true;
        severity = interception.severity || "HIGH";
      }

      logger.record(
        "TOOL_INTERCEPTION",
        interception as unknown as Record<string, unknown>,
        isViolation,
        interception.violationReason || "Tool call executed within authorized boundaries."
      );
    }

    const attackRun: AttackRun = {
      id: crypto.randomUUID(),
      targetId,
      attackType: attackType,
      status: "completed",
      success,
      severity,
      traces: logger.getSteps(),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    db.attacks.set(attackRun.id, attackRun);
    db.save();

    return res.status(201).json(attackRun);
  })
);

// 3. Retrieve Attack Trace
apiRouter.get(
  "/attacks/:id/trace",
  asyncHandler((req: Request, res: Response) => {
    const attack = db.attacks.get(req.params.id);
    if (!attack) {
      return res.status(404).json({ error: "Attack run not found" });
    }
    return res.json(attack);
  })
);

apiRouter.get(
  "/attacks",
  asyncHandler((_req: Request, res: Response) => {
    return res.json(Array.from(db.attacks.values()));
  })
);

// 4. Defense Validation & Regression Testing
apiRouter.post(
  "/defenses/validate",
  asyncHandler((req: Request, res: Response) => {
    const { targetId, defenseName, blockedKeywords = ["ignore previous", "admin", "system_exec", "override"], attackId } = req.body || {};

    if (!targetId || !defenseName) {
      return res.status(400).json({ error: "Invalid payload: targetId and defenseName are required" });
    }

    let relevantAttacks = Array.from(db.attacks.values()).filter((a) => a.targetId === targetId);
    if (attackId) {
      relevantAttacks = relevantAttacks.filter((a) => a.id === attackId);
    }

    if (relevantAttacks.length === 0) {
      return res.status(404).json({ error: "No attack traces found for target to validate against" });
    }

    const keywordList: string[] = Array.isArray(blockedKeywords) ? blockedKeywords : [];
    let blockedCount = 0;

    for (const atk of relevantAttacks) {
      const promptStep = atk.traces.find((t) => t.actionType === "ADVERSARIAL_PROMPT");
      const promptStr = String(promptStep?.payload?.prompt ?? "").toLowerCase();

      const isBlocked = keywordList.some((kw: string) => promptStr.includes(String(kw).toLowerCase()));
      if (isBlocked) {
        blockedCount++;
      }
    }

    const exploitPreventedRate = Math.round((blockedCount / relevantAttacks.length) * 100);

    const defense: DefenseProfile = {
      id: crypto.randomUUID(),
      targetId,
      defenseName: String(defenseName).trim(),
      blockedKeywords: keywordList,
      exploitPreventedRate,
      createdAt: new Date().toISOString(),
    };

    db.defenses.set(defense.id, defense);
    db.save();

    return res.json({
      defenseId: defense.id,
      targetId,
      defenseName: defense.defenseName,
      exploitPreventedRate,
      attacksTested: relevantAttacks.length,
      attacksBlocked: blockedCount,
      status: "validated",
    });
  })
);
