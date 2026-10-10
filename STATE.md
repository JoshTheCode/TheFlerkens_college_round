# Hackathon State & Progress Ledger: STATE.md

> **Notice**: All team members and AI agents must update this ledger after completing a feature, changing an API contract, or deferring technical debt.

---

## 📊 Project Quick Status

- **Project Name**: AgentBreak - Autonomous AI Red Team
- **Current Phase**: Full 4-Member Subsystem Integration (Frontend + Backend + API Contracts + AI Agent Engine merged into `main`)
- **Active Workspace Directory**: `TheFlerkens_college_round`
- **GitHub Repository**: [JoshTheCode/TheFlerkens_college_round](https://github.com/JoshTheCode/TheFlerkens_college_round)

---

## 📌 Team Responsibilities & Division

- [x] **Frontend (Member 1)**: Security Evaluation Dashboard, Attack Path Visualization, Trace Replayer, Campaign Launcher (React + Vite)
- [x] **Backend (Member 2)**: Sandbox Execution Environment, Metric Logger, Async Persistence Layer (TypeScript / Node.js, 5/5 tests passing)
- [x] **API (Member 3)**: OpenAPI 3.1 Contracts (`api/openapi.json`, `api/schema.json`, `api/types.ts`) & FastAPI server
- [x] **AI/ML Agent (Member 4)**: Autonomous Red Team Agent Generator, Prompt Injection Engine, exact defense replay, adaptive bypass evaluation (Python, 20/20 tests passing)

---

## 📝 Change & Synchronization Log

| Date / Time | Author / Agent | Component | Summary of Changes / Decision | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| 2026-10-10 | AI Assistant | Meta / Setup | Initialized `AGENTS.md`, `SKILLS_GUIDE.md`, and `STATE.md` | ✅ Verified |
| 2026-10-10 | AI Assistant | Spec / GSD | Added `PROBLEM_STATEMENT.md` for AgentBreak & pushed to GitHub | ✅ Verified |
| 2026-10-10 | AI Assistant | Architecture | Added `ARCHITECTURE_AND_PLAN.md` with subsystem design & GSD phases | ✅ Verified |
| 2026-10-10 | Member 2 / Backend | Backend | Migrated backend to TypeScript (Node.js 24 + Express + Native TS runner) | ✅ Verified (5/5 tests passing) |
| 2026-10-10 | AI Assistant | Backend Hardening | Added async atomic disk persistence, O(1) secondary index for attacks, root tsconfig | ✅ Verified (5/5 tests passing) |
| 2026-10-10 | Member 1 / Frontend | Frontend UI | Implemented 6 core red-team UI modules, theme styling, and traces stepper in React/Vite | ✅ Verified |
| 2026-10-10 | Member 3 / API | API Contracts | Defined OpenAPI 3.1 spec, TypeScript types, mock fixtures, and validation schemas | ✅ Validated |
| 2026-10-10 | Member 4 / AI | AI Red Team Engine | Implemented model-driven planner, adaptive payload generator with evidence feedback, banking tool agent, defense replay, and cost ledger | ✅ Verified (20/20 tests passing) |
| 2026-10-10 | Orchestrator | Branch Integration | Resolved docs path divergence, cleaned redundant HTML preview, unified .gitignore, and merged all work into `main` | ✅ All tests passing |

---

## 🏷️ Debt & Shortcut Ledger (`shortcut:`)

| Entry ID | Component | Shortcut Taken | Limit / Upgrade Condition |
| :--- | :--- | :--- | :--- |
| SC-001 | Backend DB | In-memory `Map` data store with atomic disk persistence for zero-latency hackathon iteration | Upgrade to Postgres/Prisma for persistent multi-instance production |
| SC-002 | Target Sandbox | In-memory simulated banking database and tools (`check_balance`, `search_internal_policies`, `read_customer_record`, `transfer_funds`, `save_session_note`). | Preserved as intentional safety boundary to prevent real external risk during evaluation |
| SC-003 | Live Model Verification | Deterministic model doubles and token budgets verified in CI and offline demo mode. | Set `OPENAI_API_KEY` for live OpenAI/OpenRouter evaluation |
| SC-004 | Cost Calculation | Exact monetary cost reported as `unavailable` because provider pricing tiers cannot be determined locally without active telemetry. Token budget remains enforced. | Implement live pricing API lookup when external billing integration is configured |

---

## 🎯 Target Agent Scope: Banking Assistant (`BankAgent`)

- **Role**: AI Customer Support & Transactions Assistant
- **Tools**:
  - `check_balance(account_id)`: Check customer balance.
  - `search_internal_policies(query)`: Search banking policies (vector for indirect prompt injection).
  - `read_customer_record(customer_id)`: Access sensitive records (PII / security secrets).
  - `transfer_funds(from_account, to_account, amount)`: Transfer funds (unauthorized tool execution / privilege escalation vector).
  - `save_session_note(customer_id, note)`: Save session context into persistent memory (memory poisoning vector).
- **Security Defenses**:
  - Untrusted document delimiter isolation
  - Strict recipient whitelist & balance threshold policies
  - Memory validation before state write
