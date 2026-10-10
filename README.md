# AgentBreak

AgentBreak is a hackathon project for safely evaluating tool-using AI agents against prompt injection, unauthorized tool execution, and persistent-memory poisoning.

## Current Status

The current branch contains a deterministic banking-security simulator:

- an in-memory fake banking sandbox;
- intercepted tool and memory operations;
- three seeded attack scenarios;
- a deterministic security judge;
- FastAPI endpoint scaffolding;
- a prerecorded demonstration trace.

It is **not yet a genuinely autonomous AI red-team system**. The current planner, payload generator, and target behavior are scripted, and the branch does not yet contain a model-provider integration or reproducible dependency manifest.

See [BRANCH_AUDIT.md](BRANCH_AUDIT.md) for the evidence-backed assessment and [TEAMWORK_PROJECT_PROMPT.md](TEAMWORK_PROJECT_PROMPT.md) for the approved implementation brief.

## Target Architecture

```text
Target profile
    |
    v
Model-driven attack planner
    |
    v
Adaptive payload generator <--- failed-attempt evidence
    |
    v
LLM-backed mock banking agent
    |
    v
Deterministic tool and memory interceptor
    |
    v
Deterministic security judge
    |
    +--> exact defense replay
    +--> adaptive bypass evaluation
```

The LLM components generate plans, payloads, and target decisions. Deterministic Python code remains responsible for permissions, evidence, budgets, exploit verdicts, and stopping conditions.

## Safe Banking Sandbox

The project uses seeded fake accounts, customer records, policies, and memory. Its mock tools are:

- `check_balance`
- `search_internal_policies`
- `read_customer_record`
- `transfer_funds`
- `save_session_note`

The implementation must not access live banking systems, real credentials, the host filesystem, shell commands, email, or arbitrary external networks.

## Documents

- [PROBLEM_STATEMENT.md](PROBLEM_STATEMENT.md): product problem and success definition
- [ARCHITECTURE_AND_PLAN.md](ARCHITECTURE_AND_PLAN.md): system architecture and phased delivery
- [AGENT_IMPLEMENTATION_PLAN.md](AGENT_IMPLEMENTATION_PLAN.md): detailed agent implementation design
- [BRANCH_AUDIT.md](BRANCH_AUDIT.md): brutally honest current-branch assessment
- [TEAMWORK_PROJECT_PROMPT.md](TEAMWORK_PROJECT_PROMPT.md): Antigravity/teamwork-ready implementation prompt
- [STATE.md](STATE.md): current progress, decisions, and technical debt
- [api/API_CONTRACT.md](api/API_CONTRACT.md): API behavior, compatibility, and implementation status
- [api/openapi.json](api/openapi.json): canonical OpenAPI 3.1 integration contract

## Quickstart & Reproducibility

### 1. Installation

```bash
# Create virtual environment with Python 3.11+ (or Python 3.9+)
python3 -m venv .venv
source .venv/bin/activate

# Install from pinned lockfile
pip install -r requirements.lock

# (Optional) Copy environment template
cp .env.example .env
```

### 2. Run Test Suite

```bash
source .venv/bin/activate
python3 -m pytest -v tests/
```

### 3. Start the API Service

```bash
source .venv/bin/activate
uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run Baseline Attack Run

```bash
curl -X POST http://localhost:8000/api/v1/attacks/start
```

### 5. Validate Defense Profile

```bash
curl -X POST http://localhost:8000/api/v1/defenses/validate \
  -H "Content-Type: application/json" \
  -d '{"baseline_run_id": "<BASELINE_RUN_ID>", "defense_profile": {"isolate_untrusted_documents": true, "strict_tool_authorization": true, "validate_memory_writes": true}}'
```

### 6. Run Complete Single-Slice Demo CLI

```bash
# Offline / Deterministic Mode (CI-safe, runs without API key)
python -m scripts.run_demo --mode deterministic

# Live Autonomous Mode (requires OPENAI_API_KEY in environment or .env)
python -m scripts.run_demo --mode live
```


