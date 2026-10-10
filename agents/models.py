from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AttackFamily(str, Enum):
    INDIRECT_PROMPT_INJECTION = "indirect_prompt_injection"
    UNAUTHORIZED_TOOL_USE = "unauthorized_tool_use"
    MEMORY_POISONING = "memory_poisoning"


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ToolDefinition(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]


class TargetProfile(BaseModel):
    id: str
    name: str
    system_prompt: str
    tools: List[ToolDefinition]
    allowed_resources: List[str] = Field(default_factory=list)
    forbidden_resources: List[str] = Field(default_factory=list)


class AttackPlan(BaseModel):
    family: AttackFamily
    objective: str
    steps: List[str]
    success_condition: str
    expected_severity: Severity


class ToolCallRecord(BaseModel):
    tool: str
    arguments: Dict[str, Any]
    authorized: bool
    policy_rule_id: str = "POL-DEFAULT-ALLOW"
    requested_resource: Optional[str] = None
    result_summary: str
    secret_marker_exposed: bool = False
    timestamp: str = ""


class MemoryDiff(BaseModel):
    before: Dict[str, str] = Field(default_factory=dict)
    after: Dict[str, str] = Field(default_factory=dict)
    added: Dict[str, str] = Field(default_factory=dict)
    modified: Dict[str, Dict[str, str]] = Field(default_factory=dict)
    removed: List[str] = Field(default_factory=list)


class AttackAttempt(BaseModel):
    attempt_id: int
    family: AttackFamily
    payload: str
    target_response: str
    tool_calls: List[ToolCallRecord] = Field(default_factory=list)
    memory_before: Dict[str, str] = Field(default_factory=dict)
    memory_after: Dict[str, str] = Field(default_factory=dict)
    memory_diff: MemoryDiff = Field(default_factory=MemoryDiff)
    adaptation_notes: Optional[str] = None
    duration_ms: float = 0.0
    timestamp: str = ""


class Finding(BaseModel):
    family: AttackFamily
    success: bool
    severity: Severity
    objective: str
    evidence: str
    reproduction_steps: List[str]
    mitigation: str
    attempt_id: int
    policy_rule_id: Optional[str] = None


class DefenseProfile(BaseModel):
    name: str = "Standard Hardened Defense"
    isolate_untrusted_documents: bool = True
    strict_tool_authorization: bool = True
    allowed_transfer_recipients: List[str] = Field(default_factory=lambda: ["ACC_1001", "ACC_1002"])
    transfer_amount_limit: float = 1000.0
    validate_memory_writes: bool = True


class ExecutionTrace(BaseModel):
    run_id: str
    status: RunStatus
    execution_mode: str = "deterministic_fallback"  # "live" | "deterministic_fallback" | "prerecorded"
    target_profile: TargetProfile
    defense_profile: Optional[DefenseProfile] = None
    plans: List[AttackPlan] = Field(default_factory=list)
    attempts: List[AttackAttempt] = Field(default_factory=list)
    findings: List[Finding] = Field(default_factory=list)
    total_findings_count: int = 0
    total_tokens_used: int = 0
    stopping_reason: str = "All attack families completed"
    start_time: str
    end_time: Optional[str] = None
    is_prerecorded: bool = False



class DefenseValidationRequest(BaseModel):
    baseline_run_id: str
    defense_profile: Optional[DefenseProfile] = Field(default_factory=DefenseProfile)


class EvaluationReport(BaseModel):
    baseline_run_id: str
    baseline_findings_count: int
    baseline_success_rate: float
    exact_replay_findings_count: int
    exact_replay_blocking_rate: float
    adaptive_bypass_findings_count: int
    adaptive_bypass_rate: float
    legitimate_task_passed: bool
    status: str
