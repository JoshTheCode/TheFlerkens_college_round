# AgentBreak — Autonomous AI Red Team

> **BnB Hackathon 2026** | Team **The Flerkens** (College Round FRCRCE)  
> Automated security probing, exploit trace reconstruction, and defense validation for agentic AI systems.

---

## 🎯 What is AgentBreak?

As AI agents are granted access to private datasets, external APIs, and multi-step tool execution loops, traditional static red-teaming fails. **AgentBreak** is an autonomous AI red team platform that probes target AI agents for:
- **Indirect Prompt Injections**: Exploiting retrieved documents and hidden system prompt overrides.
- **Tool Privilege Escalation**: Calling restricted tools or parameters outside allowed authorization boundaries.
- **Agent Memory Poisoning**: Corrupting state buffers across multi-step execution.
- **Defense Validation**: Measuring mitigation efficacy and regression testing against known exploit vectors.

---

## 🏛️ System Architecture

AgentBreak is organized into 4 modular subsystems across a 4-member role division:

| Subsystem | Member Role | Directory | Stack |
| :--- | :--- | :--- | :--- |
| **1. Security Evaluation Dashboard** | Member 1 (Frontend Lead) | `/frontend` | React, TypeScript, Tailwind, Recharts |
| **2. Core API Contracts** | Member 3 (API Integration Lead) | `/api` | OpenAPI 3.0 (`api/schema.json`) |
| **3. Autonomous Red Team Engine** | Member 4 (AI/ML Specialist) | `/agents` | Python / Custom Agent SDK |
| **4. Sandbox & Auditor Backend** | Member 2 (Backend Lead) | `/backend` | Node.js (TypeScript), Express, Test Runner |

---

## 🚀 Quickstart: Running the Backend

### Prerequisites
- Node.js **>= v20** (tested on Node v24.21 with native TypeScript execution)
- npm **>= v10**

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Production / Normal Start
npm start

# Development Mode (auto-reload on save)
npm run dev
```
The server will start on `http://localhost:8000`.

### 3. Run Automated Tests
```bash
npm test
```
Runs the full unit and API integration test suite via Node's native test runner (`node --test`).

---

## 📡 API Endpoints

Full schema specification is defined in [`api/schema.json`](./api/schema.json).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check and runtime status |
| `POST` | `/api/v1/targets/register` | Register target agent instructions and tool capabilities |
| `GET` | `/api/v1/targets` | List all registered target agents |
| `POST` | `/api/v1/attacks/start` | Launch an autonomous attack probe with sandbox interception |
| `GET` | `/api/v1/attacks/:id/trace` | Retrieve deterministic JSON execution trace for an attack |
| `POST` | `/api/v1/defenses/validate` | Test defense filters against past exploit traces |

---

## 🛡️ Sandbox Components (Subsystem 4)

- **`ToolCallInterceptor`** (`backend/src/sandbox/interceptor.ts`): Enforces least-privilege boundaries and detects unauthorized tool calls or privilege escalations.
- **`MemoryAuditor`** (`backend/src/sandbox/memoryAuditor.ts`): Diffs pre/post memory snapshots to detect prompt injections and buffer corruption.
- **`TraceLogger`** (`backend/src/sandbox/traceLogger.ts`): Records deterministic, step-by-step audit logs enabling exact exploit playback.
