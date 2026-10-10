from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents.coordinator import RedTeamCoordinator
from agents.models import DefenseProfile, EvaluationReport, ExecutionTrace

app = FastAPI(
    title="AgentBreak API",
    description="Autonomous AI Red Team testing platform for vulnerable AI agents",
    version="1.0.0",
)

# Enable CORS for frontend dashboard development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

coordinator = RedTeamCoordinator()


@app.get("/api/v1/health")
def health_check() -> Dict[str, str]:
    return {"status": "healthy", "service": "AgentBreak Autonomous AI Red Team"}


@app.get("/api/v1/targets/default")
def get_default_target() -> Dict[str, Any]:
    return coordinator.target_profile.model_dump()


@app.post("/api/v1/attacks/start", response_model=ExecutionTrace)
def start_attack_run() -> ExecutionTrace:
    return coordinator.run_attack_suite()


@app.get("/api/v1/attacks/{run_id}", response_model=Dict[str, Any])
def get_attack_status(run_id: str) -> Dict[str, Any]:
    trace = coordinator.traces.get(run_id)
    if not trace:
        raise HTTPException(status_code=404, detail="Run ID not found")
    return {
        "run_id": trace.run_id,
        "status": trace.status,
        "total_findings": trace.total_findings_count,
        "plans_evaluated": len(trace.plans),
    }


@app.get("/api/v1/attacks/{run_id}/trace", response_model=ExecutionTrace)
def get_attack_trace(run_id: str) -> ExecutionTrace:
    trace = coordinator.traces.get(run_id)
    if not trace:
        raise HTTPException(status_code=404, detail="Run ID not found")
    return trace


@app.post("/api/v1/defenses/validate", response_model=EvaluationReport)
def validate_defense(defense: DefenseProfile) -> EvaluationReport:
    # First generate baseline attack run
    baseline = coordinator.run_attack_suite()
    return coordinator.validate_defense(baseline_trace=baseline, defense=defense)
