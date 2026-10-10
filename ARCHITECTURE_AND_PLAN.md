# AgentBreak: System Architecture & Implementation Plan

> **Project**: AgentBreak - Autonomous AI Red Team  
> **Framework**: GSD (Get Shit Done)  
> **Repository**: [JoshTheCode/TheFlerkens_college_round](https://github.com/JoshTheCode/TheFlerkens_college_round)

---

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

### Phase 1: Specifications & API Contracts (Hours 0 – 2)
- [x] Create `PROBLEM_STATEMENT.md` and define architectural boundaries.
- [ ] Define OpenAPI 3.0 contract in `api/schema.json`.
- [ ] Set up mock payload fixtures for attack traces.

### Phase 2: Core Engine & Sandbox Setup (Hours 2 – 6)
- [ ] Build isolated agent sandbox container and tool interceptor.
- [ ] Implement adaptive adversarial red team prompt generator.
- [ ] Wire REST & WebSocket orchestration endpoints.

### Phase 3: Frontend Dashboard & Attack Graph (Hours 6 – 10)
- [ ] Build React UI shell and register target agent form.
- [ ] Render interactive attack path graphs and execution trace playback.
- [ ] Connect live API and WebSocket streams to frontend state.

### Phase 4: Defense Validation & Hackathon Demo Prep (Hours 10 – 12)
- [ ] Implement regression testing engine to evaluate defense profiles.
- [ ] Seed rich demo data (3 pre-built exploit traces: Indirect Prompt Injection, Tool Privilege Escalation, Memory Poisoning).
- [ ] Run `hackathon-demo-prep` to generate `DEMO_PITCH.md` and bulletproof stage presentation.
