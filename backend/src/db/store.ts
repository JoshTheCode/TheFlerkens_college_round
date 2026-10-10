import fs from "node:fs";
import path from "node:path";
import type { TargetAgent, AttackRun, DefenseProfile } from "../models/types.ts";

interface SerializedState {
  agents: [string, TargetAgent][];
  attacks: [string, AttackRun][];
  defenses: [string, DefenseProfile][];
}

// shortcut: file-backed JSON store avoids DB setup overhead, upgrade to Postgres/Prisma for multi-worker scaling
class DataStore {
  public agents = new Map<string, TargetAgent>();
  public attacks = new Map<string, AttackRun>();
  public defenses = new Map<string, DefenseProfile>();
  // Secondary index for O(1) target -> attacks lookups without full array scans
  public attacksByTarget = new Map<string, string[]>();

  private filePath: string;
  private tempPath: string;
  private isWriting = false;
  private pendingWrite = false;

  constructor() {
    this.filePath = path.resolve(process.cwd(), "store.json");
    this.tempPath = path.resolve(process.cwd(), "store.json.tmp");
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const data: SerializedState = JSON.parse(raw);
        this.agents = new Map(data.agents || []);
        this.attacks = new Map(data.attacks || []);
        this.defenses = new Map(data.defenses || []);
        this.rebuildIndexes();
      }
    } catch {
      // In case of read/parse error, fallback gracefully to in-memory
    }
  }

  private rebuildIndexes() {
    this.attacksByTarget.clear();
    for (const [id, attack] of this.attacks) {
      const list = this.attacksByTarget.get(attack.targetId) || [];
      list.push(id);
      this.attacksByTarget.set(attack.targetId, list);
    }
  }

  public saveAttack(attack: AttackRun) {
    this.attacks.set(attack.id, attack);
    const list = this.attacksByTarget.get(attack.targetId) || [];
    list.push(attack.id);
    this.attacksByTarget.set(attack.targetId, list);
  }

  public getAttacksForTarget(targetId: string): AttackRun[] {
    const ids = this.attacksByTarget.get(targetId);
    if (!ids) return [];
    return ids
      .map((id) => this.attacks.get(id))
      .filter((a): a is AttackRun => a !== undefined);
  }

  public async save(): Promise<void> {
    if (this.isWriting) {
      this.pendingWrite = true;
      return;
    }

    this.isWriting = true;
    try {
      const data: SerializedState = {
        agents: Array.from(this.agents.entries()),
        attacks: Array.from(this.attacks.entries()),
        defenses: Array.from(this.defenses.entries()),
      };

      // Atomic asynchronous write to temp file then rename to prevent lock collisions
      await fs.promises.writeFile(this.tempPath, JSON.stringify(data, null, 2), "utf-8");
      await fs.promises.rename(this.tempPath, this.filePath);
    } catch {
      // Non-fatal if writing to disk fails in read-only sandbox environments
    } finally {
      this.isWriting = false;
      if (this.pendingWrite) {
        this.pendingWrite = false;
        void this.save();
      }
    }
  }

  public clear() {
    this.agents.clear();
    this.attacks.clear();
    this.defenses.clear();
    this.attacksByTarget.clear();
    try {
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
      }
      if (fs.existsSync(this.tempPath)) {
        fs.unlinkSync(this.tempPath);
      }
    } catch {
      // ignore
    }
  }
}

export const db = new DataStore();
