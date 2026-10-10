import type { TraceStep } from "../models/types.ts";

export class TraceLogger {
  private steps: TraceStep[] = [];

  record(
    actionType: TraceStep["actionType"],
    payload: Record<string, unknown>,
    violationDetected = false,
    details?: string
  ): TraceStep {
    const step: TraceStep = {
      stepNumber: this.steps.length + 1,
      actionType,
      payload,
      violationDetected,
      details,
      timestamp: new Date().toISOString(),
    };
    this.steps.push(step);
    return step;
  }

  getSteps(): TraceStep[] {
    return [...this.steps];
  }
}
