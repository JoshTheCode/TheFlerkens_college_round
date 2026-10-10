import os
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.coordinator import RedTeamCoordinator
from agents.models import (
    AttackFamily,
    DefenseProfile,
    DefenseValidationRequest,
    EvaluationReport,
    ExecutionMode,
    ExecutionTrace,
    TargetProfile,
)
from agents.target.agent import get_target_profile, list_target_profiles


class AttackRunRequest(BaseModel):
    target_id: Optional[str] = "bank_agent_v1"
    attack_families: Optional[List[AttackFamily]] = None
    execution_mode: Optional[ExecutionMode] = None


app = FastAPI(
    title="AgentBreak API",
    description="Autonomous AI Red Team testing platform for vulnerable AI agents",
    version="1.1.0",
)

# Explicit CORS configuration without wildcard credential combination
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

coordinator = RedTeamCoordinator()


@app.get("/api/v1/health", operation_id="getHealth")
def health_check(request: Request) -> Dict[str, Any]:
    api_key_header = None
    model_header = None
    if request:
        api_key_header = request.headers.get("x-api-key") or (
            request.headers.get("authorization", "").replace("Bearer ", "").strip()
        )
        model_header = request.headers.get("x-red-team-model")
    api_key_configured = bool(api_key_header or coordinator.client.is_configured or os.getenv("OPENAI_API_KEY"))
    provider_url = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    model_name = model_header or coordinator.client.model or os.getenv("AGENTBREAK_MODEL", "openai/gpt-4o-mini")

    return {
        "status": "healthy",
        "service": "AgentBreak Autonomous AI Red Team",
        "api_ready": True,
        "provider_ready": api_key_configured,
        "model": model_name,
        "provider_endpoint": provider_url,
    }


@app.get("/api/v1/targets", response_model=List[TargetProfile], operation_id="listTargets")
def list_targets() -> List[TargetProfile]:
    return list_target_profiles()


@app.get("/api/v1/targets/default", operation_id="getDefaultTarget")
def get_default_target() -> Dict[str, Any]:
    return coordinator.target_profile.model_dump()


@app.get("/api/v1/targets/{target_id}", response_model=TargetProfile, operation_id="getTarget")
def get_target(target_id: str) -> TargetProfile:
    return get_target_profile(target_id)


@app.post("/api/v1/attacks/start", response_model=ExecutionTrace, operation_id="startAttackRun")
def start_attack_run(
    req: Optional[AttackRunRequest] = None,
    request: Request = None,
) -> ExecutionTrace:
    if request:
        api_key = request.headers.get("x-api-key") or (
            request.headers.get("authorization", "").replace("Bearer ", "").strip()
        )
        model = request.headers.get("x-red-team-model")
        if api_key:
            coordinator.client.api_key = api_key
            coordinator.planner.client.api_key = api_key
            coordinator.generator.client.api_key = api_key
        if model:
            coordinator.client.model = model
            coordinator.planner.client.model = model
            coordinator.generator.client.model = model

    mode = req.execution_mode if req else None
    families = req.attack_families if req else None
    target_id = req.target_id if req else None
    return coordinator.run_attack_suite(
        attack_families=families,
        execution_mode=mode,
        target_id=target_id,
    )


@app.get("/api/v1/attacks/{run_id}", response_model=Dict[str, Any], operation_id="getAttackRun")
def get_attack_status(run_id: str) -> Dict[str, Any]:
    trace = coordinator.storage.get_trace(run_id)
    if not trace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Run ID '{run_id}' not found",
        )
    return {
        "run_id": trace.run_id,
        "status": trace.status,
        "total_findings": trace.total_findings_count,
        "plans_evaluated": len(trace.plans),
    }


@app.get("/api/v1/attacks/{run_id}/trace", response_model=ExecutionTrace, operation_id="getAttackTrace")
def get_attack_trace(run_id: str) -> ExecutionTrace:
    trace = coordinator.storage.get_trace(run_id)
    if not trace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Run ID '{run_id}' not found",
        )
    return trace


@app.post("/api/v1/defenses/validate", response_model=EvaluationReport, operation_id="validateDefense")
def validate_defense(req: DefenseValidationRequest) -> EvaluationReport:
    try:
        defense = req.defense_profile or DefenseProfile()
        return coordinator.validate_defense(
            baseline_run_id=req.baseline_run_id,
            defense=defense,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
