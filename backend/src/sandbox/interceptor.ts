import type { ToolDefinition } from "../models/types.ts";

export interface InterceptionResult {
  allowed: boolean;
  toolName: string;
  arguments: Record<string, unknown>;
  violationReason?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export class ToolCallInterceptor {
  private allowedTools: Map<string, ToolDefinition>;

  constructor(toolDefinitions: ToolDefinition[] = []) {
    this.allowedTools = new Map(toolDefinitions.map((t) => [t.name, t]));
  }

  evaluate(toolName: string, args: Record<string, unknown>): InterceptionResult {
    const tool = this.allowedTools.get(toolName);

    if (!tool) {
      return {
        allowed: false,
        toolName,
        arguments: args,
        violationReason: `Unauthorized tool: '${toolName}' is not in the agent's registered tools.`,
        severity: "HIGH",
      };
    }

    if (tool.blocked) {
      return {
        allowed: false,
        toolName,
        arguments: args,
        violationReason: `Privilege escalation blocked: '${toolName}' is explicitly forbidden.`,
        severity: "CRITICAL",
      };
    }

    return {
      allowed: true,
      toolName,
      arguments: args,
    };
  }
}
