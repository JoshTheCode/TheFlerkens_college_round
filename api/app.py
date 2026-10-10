import os
from typing import Any, Dict
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from agents.coordinator import RedTeamCoordinator
from agents.models import (
    DefenseProfile,
    DefenseValidationRequest,
    EvaluationReport,
    ExecutionTrace,
)

app = FastAPI(
    title="AgentBreak API",
    description="Autonomous AI Red Team testing platform for vulnerable AI agents",
    version="1.0.0",
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


@app.get("/api/v1/health")
def health_check() -> Dict[str, Any]:
    api_key_configured = bool(os.getenv("OPENAI_API_KEY"))
    provider_url = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    model_name = os.getenv("AGENTBREAK_MODEL", "openai/gpt-4o-mini")

    return {
        "status": "healthy",
        "service": "AgentBreak Autonomous AI Red Team",
        "api_ready": True,
        "provider_ready": api_key_configured,
        "model": model_name,
        "provider_endpoint": provider_url,
    }


@app.get("/api/v1/targets/default")
def get_default_target() -> Dict[str, Any]:
    return coordinator.target_profile.model_dump()


@app.post("/api/v1/attacks/start", response_model=ExecutionTrace)
def start_attack_run() -> ExecutionTrace:
    return coordinator.run_attack_suite()


@app.get("/api/v1/attacks/{run_id}", response_model=Dict[str, Any])
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


@app.get("/api/v1/attacks/{run_id}/trace", response_model=ExecutionTrace)
def get_attack_trace(run_id: str) -> ExecutionTrace:
    trace = coordinator.storage.get_trace(run_id)
    if not trace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Run ID '{run_id}' not found",
        )
    return trace


@app.post("/api/v1/defenses/validate", response_model=EvaluationReport)
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
