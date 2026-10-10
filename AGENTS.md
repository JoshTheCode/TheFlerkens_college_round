# Team & Agent Architecture: AGENTS.md

## 4-Member Team Role Division

- Member 1: Frontend Lead
  - Scope: UI/UX, Component Architecture, Interactive State
  - Stack: React / Next.js / Tailwind
  - Agents: Visual & UI Agents

- Member 2: Backend Lead
  - Scope: Server, Database Schemas, Data Pipeline, Authentication
  - Stack: Node.js / Python / Postgres / Redis
  - Agents: API & Database Agents

- Member 3: API Integration Lead
  - Scope: Endpoints, Payload Contracts, OpenAPI/Swagger Specs
  - Stack: REST / gRPC / GraphQL
  - Agents: Integration & Testing Agents

- Member 4: AI/ML Agent Specialist
  - Scope: LLM Pipelines, Multi-Agent Orchestration, Prompting
  - Stack: Python / LangChain / LlamaIndex / Agent SDKs
  - Agents: Orchestrator & Debugger Agents

## Multi-Agent Governance Rules

1. Scope Isolation: Agents must only touch files in their assigned directory (/frontend, /backend, /api, /agents).
2. State Logging: Log major architectural decisions and shortcuts in STATE.md.
3. Contract First: Do not alter API schemas without updating /api contracts and team notification.
4. Token Efficiency: Keep prompts brief and context focused. Refer to SKILLS_GUIDE.md for skill selection.

## Task Handoff Workflow

Frontend <-> API Integration <-> Backend
AI/ML Specialist <-> API Integration <-> Backend
All changes sync to STATE.md.
