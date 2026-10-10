export interface MemoryDiff {
  stepIndex: number;
  keysAdded: string[];
  keysModified: string[];
  poisonIndicators: string[];
  isCompromised: boolean;
}

export class MemoryAuditor {
  private suspiciousPatterns = [
    "ignore previous instructions",
    "system override",
    "admin access",
    "sudo",
    "exfiltrate",
    "cat /etc/passwd",
  ];

  analyzeDiff(
    preState: Record<string, unknown>,
    postState: Record<string, unknown>,
    stepIndex: number
  ): MemoryDiff {
    const keysAdded = Object.keys(postState).filter((k) => !(k in preState));
    const keysModified = Object.keys(postState).filter(
      (k) => k in preState && postState[k] !== preState[k]
    );

    const poisonIndicators: string[] = [];
    const checkedKeys = [...keysAdded, ...keysModified];

    for (const key of checkedKeys) {
      const valStr = String(postState[key] ?? "").toLowerCase();
      for (const pattern of this.suspiciousPatterns) {
        if (valStr.includes(pattern)) {
          poisonIndicators.push(`Suspicious pattern '${pattern}' found in memory key '${key}'`);
        }
      }
    }

    return {
      stepIndex,
      keysAdded,
      keysModified,
      poisonIndicators,
      isCompromised: poisonIndicators.length > 0,
    };
  }
}
