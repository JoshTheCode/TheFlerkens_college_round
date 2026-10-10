# AgentBreak: System Architecture & Implementation Plan

> **Project**: AgentBreak - Autonomous AI Red Team  
> **Framework**: GSD (Get Shit Done)  
> **Repository**: [JoshTheCode/TheFlerkens_college_round](https://github.com/JoshTheCode/TheFlerkens_college_round)

---

## Current-State Correction

The current branch is a deterministic simulator, not yet the autonomous architecture described below. Its planner and payload generator use static Python data, and its mock bank target selects behavior through keyword conditions rather than model tool calls.

The audited gaps and ratings are recorded in `BRANCH_AUDIT.md`. The implementation team must use `TEAMWORK_PROJECT_PROMPT.md` as the current execution contract.

The architecture is considered genuinely autonomous only when:

1. the planner generates target-specific typed plans from the live target profile;
2. the payload generator revises attacks using recorded failure evidence;
3. the target is a genuine model-driven tool caller;
4. deterministic code enforces budgets, permissions, verdicts, and stopping conditions;
5. exact baseline exploits are replayed before fresh adaptive bypass testing.

## 🏛️ System Architecture Overview

AgentBreak consists of four core decoupled subsystems designed to autonomously probe, exploit, record, analyze, and defend target AI agents.

```
+-------------------------------------------------------------------------+
|                    1. Security Evaluation Dashboard                     |
|                 (React / Next.js / Visual Attack Graph)                  |
+------------------------------------+------------------------------------+
                                     |
                                     v REST / WebSocket API
+------------------------------------+------------------------------------+
|                      2. Core API & Orchestrator                         |
|                 (FastAPI / Node.js Endpoint Contracts)                  |
+-----------------+-----------------------------------+-------------------+
                  |                                   |
                  v                                   v
+-----------------+-------------------+   +-----------+-------------------+
|    3. Autonomous Red Team Engine    |   |    4. Isolated Agent Sandbox     |
|   (Adaptive Adversarial Generator)  |   |   (Target Mock & Tool Runtime)    |
| - Prompt Injection & Memory Poison  |   | - Permission Auditor & Interceptor|
| - Indirect Tool Exploitation        |   | - Step-by-Step Trace Recorder     |
+-------------------------------------+   +-----------------------------------+
```

---

## 🏗️ Subsystem Specifications & Tech Stack

### Subsystem 1: Security Evaluation Dashboard (Member 1 - Frontend Lead)
- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Recharts / Cytoscape.js (for attack graphs).
- **Core Modules**:
  - **Target Agent Manager**: Interface to register target prompt specs, system instructions, and tool definitions.
  - **Attack Graph Visualizer**: DAG renderer showing how multi-stage attacks pivot across instructions, tools, and memory.
  - **Trace Replayer**: Step-by-step playback component of reproducible exploit vectors.
  - **Defense Comparison View**: Side-by-side metric charts (Exploit Success Rate before vs. after mitigation).

### Subsystem 2: Core API & Orchestrator (Member 3 - API Integration Lead)
- **Tech Stack**: Python FastAPI / Node.js Express, OpenAPI 3.0, WebSockets.
- **Core Endpoints**:
  - `POST /api/v1/targets/register`: Register a target AI agent and its tool capabilities.
  - `POST /api/v1/attacks/start`: Trigger autonomous red team probe suite.
  - `GET /api/v1/attacks/:id/trace`: Retrieve structured JSON attack execution trace.
  - `POST /api/v1/defenses/validate`: Run regression testing against an updated target defense profile.

### Subsystem 3: Autonomous Red Team Engine (Member 4 - AI/ML Specialist)
- **Tech Stack**: Python 3.11, LangChain / LlamaIndex / Custom Agent SDK.
- **Core Capabilities**:
  - **Adversarial Generator**: Generates context-aware jailbreaks, indirect prompt injections, and memory payload corruptions.
  - **Adaptive Feedback Loop**: Evaluates target agent output to iteratively refine exploit payloads.
  - **Tool Exploitation Suite**: Tests unauthorized tool calls (e.g., file system traversal, privilege escalation).

### Subsystem 4: Isolated Agent Sandbox & Auditor (Member 2 - Backend Lead)
- **Tech Stack**: Docker / Python Isolated Environment, SQLite / Postgres, Redis.
- **Core Modules**:
  - **Tool Call Interceptor**: Intercepts all outgoing function calls from the target agent to measure permission boundary violations.
  - **Memory Auditor**: Inspects agent memory buffers before and after attack steps.
  - **Trace Logger**: Records deterministic input/output tuples for exact exploit reproducibility.

---

## 📅 Implementation Plan & GSD Execution Phases

### Phase 1: Reproducibility & Contracts
- [x] Create `PROBLEM_STATEMENT.md` and define architectural boundaries.
- [x] Set up a mock payload fixture for attack traces.
- [ ] Add `pyproject.toml`, lockfile, `.env.example`, documented commands, and CI.
- [ ] Make the deterministic suite pass from a clean checkout.
- [ ] Define and test stable API and trace schemas.

### Phase 2: Correct Deterministic Foundation
- [x] Build an in-memory banking sandbox and tool interceptor.
- [x] Implement initial deterministic security predicates.
- [ ] Record timestamps, policy identifiers, immutable target snapshots, and true memory diffs.
- [ ] Persist traces outside process memory.
- [ ] Replay exact baseline exploits by `baseline_run_id`.

### Phase 3: Genuine Model-Driven Agents
- [ ] Implement a structured model-driven attack planner.
- [ ] Implement an adaptive payload generator using prior failure evidence.
- [ ] Replace keyword routing with an LLM-backed target using typed fake tools.
- [ ] Add attempt, time, token, and cost budgets plus explicit stopping reasons.
- [ ] Record model, prompt-version, latency, usage, and error metadata.

### Phase 4: Defense Validation
- [ ] Replay exact successful payloads against defenses.
- [ ] Run fresh adaptive bypass attempts after replay.
- [ ] Report regression blocking, adaptive bypass, and legitimate-task retention separately.
- [ ] Expand legitimate controls beyond balance lookup.

### Phase 5: Dashboard & Demo
- [ ] Build the dashboard and trace replayer against the stable schema.
- [ ] Visualize attack evolution, evidence, policy decisions, and defense comparison.
- [ ] Verify the live model-driven flow.
- [x] Preserve a prerecorded offline trace fixture.
- [ ] Clearly label prerecorded data in the UI and presentation.
