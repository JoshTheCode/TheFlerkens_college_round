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
    CANCELLED = "cancelled"


class ExecutionMode(str, Enum):
    LIVE = "live"
    DETERMINISTIC_FIXTURE = "deterministic_fixture"
    PRERECORDED = "prerecorded"


class StoppingReason(str, Enum):
    ALL_ATTACK_FAMILIES_COMPLETED = "all_attack_families_completed"
    ATTEMPT_BUDGET_EXHAUSTED = "attempt_budget_exhausted"
    TIME_BUDGET_EXHAUSTED = "time_budget_exhausted"
    TOKEN_BUDGET_EXHAUSTED = "token_budget_exhausted"
    COST_BUDGET_EXHAUSTED = "cost_budget_exhausted"
    PROVIDER_ERROR = "provider_error"
    CANCELLED = "cancelled"
    INTERNAL_ERROR = "internal_error"


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


class ModelCallMetadata(BaseModel):
    provider: str
    model: str
    prompt_version: str = "v1"
    latency_ms: float = 0.0
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    estimated_cost_usd: Optional[float] = None
    error_code: Optional[str] = None


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
    failed_success_predicate: Optional[str] = None
    model_call: Optional[ModelCallMetadata] = None
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


class FamilyReplayResult(BaseModel):
    family: AttackFamily
    baseline_payload: str
    replayed_successfully: bool  # False means exploit was blocked by defense (defense success)
    adaptive_bypass_attempted: bool = False
    adaptive_bypass_succeeded: bool = False
    adaptation_notes: Optional[str] = None


class ExecutionTrace(BaseModel):
    run_id: str
    status: RunStatus
    execution_mode: ExecutionMode = ExecutionMode.DETERMINISTIC_FIXTURE
    target_profile: TargetProfile
    defense_profile: Optional[DefenseProfile] = None
    plans: List[AttackPlan] = Field(default_factory=list)
    attempts: List[AttackAttempt] = Field(default_factory=list)
    findings: List[Finding] = Field(default_factory=list)
    total_findings_count: int = 0
    total_tokens_used: int = 0
    cost_usd: Optional[float] = None  # None indicates exact pricing unavailable locally
    cost_status: str = "unavailable"  # "unavailable" | "calculated"
    stopping_reason: StoppingReason = StoppingReason.ALL_ATTACK_FAMILIES_COMPLETED
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
    family_results: List[FamilyReplayResult] = Field(default_factory=list)
    cost_usd: Optional[float] = None
    cost_status: str = "unavailable"
    status: str

