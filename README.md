# AgentBreak

AgentBreak is a hackathon project for safely evaluating tool-using AI agents against prompt injection, unauthorized tool execution, and persistent-memory poisoning.

## Current Status

The branch contains a fully working, self-contained AI red-teaming engine and safe execution sandbox:

- **Autonomous Model-Driven Planner & Generator**: `AutonomousAttackPlanner` inspects the live `TargetProfile`; `AutonomousPayloadGenerator` uses multi-turn judge feedback and previous attempt evidence to adaptively refine adversarial payloads.
- **Genuine Tool-Calling Target Agent**: `ToolCallingBankAgent` exposes typed OpenAI-compatible tool specifications to an LLM provider, with deterministic test double fallbacks for CI and offline execution.
- **All 3 Attack Families Supported**: Indirect prompt injection, unauthorized tool execution, and session memory poisoning.
- **Exact Defense Replay & Separate Adaptive Bypass**: `validate_defense` replays exact baseline payloads against the hardened target to prove mitigation, then runs adaptive bypass attempts.
- **Strict Guardrails**: Hard attempt limits, timeout limits, token budgets, and local JSON trace persistence with before/after memory diffs.
- **Automated Verification**: 20/20 unit, integration, and API tests passing in `<0.3s`.

See [BRANCH_AUDIT.md](docs/BRANCH_AUDIT.md) for the original defect audit and the resolution addendum.

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

- [docs/PROBLEM_STATEMENT.md](docs/PROBLEM_STATEMENT.md): product problem and success definition
- [docs/ARCHITECTURE_AND_PLAN.md](docs/ARCHITECTURE_AND_PLAN.md): system architecture and phased delivery
- [docs/AGENT_IMPLEMENTATION_PLAN.md](docs/AGENT_IMPLEMENTATION_PLAN.md): detailed agent implementation design
- [docs/BRANCH_AUDIT.md](docs/BRANCH_AUDIT.md): brutally honest current-branch assessment
- [docs/TEAMWORK_PROJECT_PROMPT.md](docs/TEAMWORK_PROJECT_PROMPT.md): Antigravity/teamwork-ready implementation prompt
- [docs/AGENTS.md](docs/AGENTS.md): agent roles and lightweight prompt guide
- [docs/SKILLS_GUIDE.md](docs/SKILLS_GUIDE.md): skills and tools cheat sheet
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


