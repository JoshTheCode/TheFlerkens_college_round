# Change Log & Remediation Ledger: Log.md

This document tracks all changes made starting from the code review and branch fix request.

---

## 📅 Session: 2026-10-10

### 1. 🛡️ Security & Git Hygiene Fixes
- **Updated [`.gitignore`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/.gitignore)**:
  - *Problem*: Previously contained only `.env`. The untracked `backend/node_modules/` (86 packages, thousands of files) was at imminent risk of being accidentally committed.
  - *Fix*: Added `node_modules/`, `dist/`, `*.db`, `store.json`, `.DS_Store`, and `Thumbs.db` to prevent dependency leakage and bloat.
- **Removed Duplicate Skill Directory**:
  - *Problem*: Redundant folder `.agents/Ponytail Skills/` with space in path name duplicated the actual skills in `.agents/skills/`.
  - *Fix*: Deleted `.agents/Ponytail Skills/` to ensure clean tool discovery and clean directory tree.

---

### 2. 💾 Backend Persistence & Durability ([`backend/src/db/store.ts`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/backend/src/db/store.ts))
- *Problem*: In-memory `Map` data was volatile. Restarting the server or making code edits wiped all target agents, attack traces, and defense profiles.
- *Fix*:
  - Added zero-dependency automatic JSON file synchronization (`store.json`) using Node's native `fs` module.
  - State is loaded on startup and saved on every state mutation (`registerTargetAgent`, `startAttack`, `validateDefense`).

---

### 3. ⚡ Error Handling, Sanitization & Resiliency ([`backend/src/routes/api.ts`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/backend/src/routes/api.ts) & [`backend/src/index.ts`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/backend/src/index.ts))
- *Problem*: Uncaught exceptions in route handlers or malformed JSON payloads crashed the Node process.
- *Fix*:
  - Introduced `asyncHandler` wrapper around route handlers for clean Promise rejection forwarding.
  - Added strict input validation and string sanitization on `req.body` inputs.
  - Added global Express error handling middleware in `index.ts` to return standardized `500` JSON responses instead of crashing.
  - Added standardized `404` route fallback.
  - Added persistence triggers (`db.save()`) across all creation endpoints.

---

### 4. 📜 Contract-First Architecture ([`api/schema.json`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/api/schema.json))
- *Problem*: Team governance rule in `AGENTS.md` ("Contract First") was violated because the OpenAPI contract was missing. Frontend and Backend were uncoordinated.
- *Fix*:
  - Created OpenAPI 3.0 specification in `api/schema.json` defining exact schemas for:
    - `POST /api/v1/targets/register` & `GET /api/v1/targets`
    - `POST /api/v1/attacks/start` & `GET /api/v1/attacks/:id/trace`
    - `POST /api/v1/defenses/validate`
    - Data components: `TargetAgent`, `TraceStep`, `AttackRun`, `DefenseProfile`.

---

### 5. 📖 Documentation & Setup Overhaul ([`README.md`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/README.md))
- *Problem*: `README.md` was a 3-line placeholder with no explanation of the system, team roles, or setup commands.
- *Fix*:
  - Fully rewritten with:
    - Executive summary and hackathon problem statement.
    - 4-member architecture breakdown and directory mapping.
    - Quickstart guide (`npm install`, `npm start`, `npm run dev`, `npm test`).
    - API endpoint reference table.
    - Explanation of Subsystem 4 sandbox components (`ToolCallInterceptor`, `MemoryAuditor`, `TraceLogger`).

---

### 6. ✅ Test Suite Verification
- Ran full test suite via `npm test` (`node --test src/tests/*.test.ts`):
  - `✔ GET /health returns healthy status`
  - `✔ Full Attack & Defense lifecycle`
  - `✔ ToolCallInterceptor blocks unlisted and forbidden tools`
  - `✔ MemoryAuditor detects injected poison patterns`
  - `✔ TraceLogger sequentially records steps`
  - **Status: 5/5 passed (0 failures, 742ms execution time)**.

---

### 7. 🔧 VS Code TypeScript Compiler Fix (`TS5097`)
- *Problem*: VS Code showed a red error badge (`1`) on `index.ts` because TypeScript requires `"allowImportingTsExtensions": true` when importing files directly with explicit `.ts` extensions in modern Node 24 ESM projects.
- *Fix*: Enabled `"allowImportingTsExtensions": true` and `"noEmit": true` in [`backend/tsconfig.json`](file:///c:/Users/joshw/OneDrive/Desktop/Josh/Joshwyn%20Stuff/BnB%20%20Hackathon%202026/TheFlerkens_college_round/backend/tsconfig.json). Verified with `npx tsc --noEmit` — 0 errors found.

---

### 8. ⚡ Asynchronous Atomic Persistence (`backend/src/db/store.ts`)
- *Problem*: Synchronous `fs.writeFileSync` in `store.ts` could cause race conditions or block the Node event loop under rapid concurrent writes.
- *Fix*: Replaced synchronous writes with asynchronous `fs.promises.writeFile` to a temporary buffer (`store.json.tmp`) followed by atomic rename, backed by a non-blocking queue/debounce. All tests pass in 488ms.
