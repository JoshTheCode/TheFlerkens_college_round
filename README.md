# AgentBreak — Autonomous AI Red Team

> **BnB Hackathon 2026** | Team **The Flerkens** (College Round FRCRCE)  
> Automated security probing, exploit trace reconstruction, and defense validation for agentic AI systems.

---

## 🎯 What is AgentBreak?

As AI agents are granted access to private datasets, external APIs, and multi-step tool execution loops, traditional static red-teaming fails. **AgentBreak** is an autonomous AI red team platform that probes target AI agents for:
- **Indirect Prompt Injections**: Exploiting retrieved documents and hidden system prompt overrides.
- **Tool Privilege Escalation**: Calling restricted tools or parameters outside allowed authorization boundaries.
- **Agent Memory Poisoning**: Corrupting state buffers across multi-step execution.
- **Defense Validation**: Measuring mitigation efficacy and regression testing against known exploit vectors with exact replay and adaptive bypass evaluations.

---

## 🏛️ System Architecture

AgentBreak is organized into 4 modular subsystems across a 4-member role division:

| Subsystem | Role | Directory | Stack | Port / Command |
| :--- | :--- | :--- | :--- | :--- |
| **1. Security Evaluation Dashboard** | Frontend | `/frontend` | React, Vite | `npm run dev` (`:5173`) |
| **2. FastAPI Backend & OpenAPI Contract** | API + Backend | `/api`, `/agents` | Python, FastAPI, OpenAPI 3.1 | `uvicorn api.app:app` (`:8000`) |
| **3. Autonomous Red Team Engine** | AI/ML | `/agents`, `/scripts` | Python, Pydantic, Pytest | `python -m scripts.run_demo` |

```text
Target Profile (Banking / Custom)
        │
        ▼
Autonomous Model-Driven Attack Planner
        │
        ▼
Adaptive Payload Generator <─── Failed-attempt evidence feedback
        │
        ▼
Tool-Calling Target Agent (Live LLM or Deterministic Double)
        │
        ▼
Deterministic Tool & Memory Interceptor / Sandbox
        │
        ▼
Deterministic Security Judge
        │
        ├──▶ Exact Defense Replay
        └──▶ Adaptive Bypass Evaluation
```

---

## 🚀 Quickstart Guides

### 1. Frontend Dashboard (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:5173`.

### 2. Node.js Target Sandbox Backend
```bash
cd backend
npm install
npm test       # Run 5/5 native TypeScript tests
npm start      # Launch server on http://localhost:8000
```

### 3. Python AI Red-Team Engine & API Service
```bash
# Setup virtual environment
python -m venv .venv
# Activate: source .venv/bin/activate (Linux/macOS) or .venv\Scripts\Activate.ps1 (Windows)
pip install -r requirements.lock

# Run test suite (20 passing tests)
pytest -v tests/

# Run standalone demo CLI (offline / CI-safe mode)
python -m scripts.run_demo --mode deterministic

# Run API server
uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 API Endpoints

Canonical API contracts are documented in [`api/openapi.json`](./api/openapi.json) and [`api/schema.json`](./api/schema.json).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check and runtime status |
| `POST` | `/api/v1/targets/register` | Register target agent instructions and tool capabilities |
| `GET` | `/api/v1/targets` | List all registered target agents |
| `POST` | `/api/v1/attacks/start` | Launch an autonomous attack probe with sandbox interception |
| `GET` | `/api/v1/attacks/:id/trace` | Retrieve deterministic JSON execution trace for an attack |
| `POST` | `/api/v1/defenses/validate` | Test defense filters against past exploit traces |

---

## 🛡️ Sandbox & Guardrails

- **`ToolCallInterceptor`**: Enforces least-privilege boundaries and intercepts unauthorized tool calls.
- **`MemoryAuditor`**: Diffs pre/post memory snapshots to detect prompt injections and buffer corruption.
- **`TraceLogger` / `LocalTraceStorage`**: Records deterministic step-by-step audit logs enabling exact exploit playback.
- **`Budgets`**: Hard attempt limits, timeout limits, token delta budgets, and explicit execution mode tags (`live`, `deterministic_fallback`, `prerecorded`).

---

## 📚 Project Documentation

- [docs/PROBLEM_STATEMENT.md](docs/PROBLEM_STATEMENT.md): Problem definition & requirements
- [docs/ARCHITECTURE_AND_PLAN.md](docs/ARCHITECTURE_AND_PLAN.md): Subsystem architecture & plan
- [docs/AGENT_IMPLEMENTATION_PLAN.md](docs/AGENT_IMPLEMENTATION_PLAN.md): AI Agent implementation design
- [docs/BRANCH_AUDIT.md](docs/BRANCH_AUDIT.md): Defect audit and resolution addendum
- [docs/TEAMWORK_PROJECT_PROMPT.md](docs/TEAMWORK_PROJECT_PROMPT.md): Teamwork prompts & workflows
- [docs/AGENTS.md](docs/AGENTS.md) / [AGENTS.md](AGENTS.md): Agent role division
- [docs/SKILLS_GUIDE.md](docs/SKILLS_GUIDE.md) / [SKILLS_GUIDE.md](SKILLS_GUIDE.md): Agent skills reference
- [STATE.md](STATE.md): Hackathon state and progress ledger
