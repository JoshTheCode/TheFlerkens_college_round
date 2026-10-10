export interface ToolDefinition {
  name: string;
  description?: string;
  blocked?: boolean;
}

export interface TargetAgent {
  id: string;
  name: string;
  systemPrompt: string;
  modelName: string;
  toolDefinitions: ToolDefinition[];
  createdAt: string;
}

export interface TraceStep {
  stepNumber: number;
  actionType: "ADVERSARIAL_PROMPT" | "MEMORY_AUDIT" | "TOOL_INTERCEPTION" | "RESULT";
  payload: Record<string, unknown>;
  violationDetected: boolean;
  details?: string;
  timestamp: string;
}

export interface AttackRun {
  id: string;
  targetId: string;
  attackType: "prompt_injection" | "tool_escalation" | "memory_poison";
  status: "pending" | "running" | "completed" | "failed";
  success: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  traces: TraceStep[];
  createdAt: string;
  completedAt?: string;
}

export interface DefenseProfile {
  id: string;
  targetId: string;
  defenseName: string;
  blockedKeywords: string[];
  exploitPreventedRate: number;
  createdAt: string;
}
