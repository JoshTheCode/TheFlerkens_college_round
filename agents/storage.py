import json
import os
from pathlib import Path
from typing import Dict, List, Optional
from agents.models import ExecutionTrace


class LocalTraceStorage:
    """Minimal local file-based persistent storage for AgentBreak execution traces."""

    def __init__(self, storage_dir: Optional[str] = None):
        self.storage_dir = Path(storage_dir or os.getenv("AGENTBREAK_DATA_DIR", "data/traces"))
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def save_trace(self, trace: ExecutionTrace) -> None:
        file_path = self.storage_dir / f"{trace.run_id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(trace.model_dump_json(indent=2))

    def get_trace(self, run_id: str) -> Optional[ExecutionTrace]:
        file_path = self.storage_dir / f"{run_id}.json"
        if not file_path.exists():
            return None
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return ExecutionTrace.model_validate(data)

    def list_run_ids(self) -> List[str]:
        return [f.stem for f in self.storage_dir.glob("*.json")]
