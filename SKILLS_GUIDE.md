# Complete Skills Guide & Playbook: SKILLS_GUIDE.md

This comprehensive guide analyzes all AI agent skills installed in your workspace and system environment (including built-in skills and the imported **Addy Osmani Agent Skills** repository: `https://github.com/addyosmani/agent-skills`).

---

## 🛠️ Category 1: Built-in & Local Hackathon Execution Skills

### 1. 🏎️ `ponytail` (Lazy Senior Dev Mode / YAGNI)
- **Location**: `~/.gemini/config/skills/ponytail/SKILL.md`
- **Purpose**: Minimalist engineering—writes the smallest complete change that solves the problem.
- **Key Tools**: `ponytail-audit` (find bloat/dead code), `ponytail-review` (code diff review), `ponytail-debt` (track shortcuts).

### 2. ⚡ `rapid-debugger` (Emergency Crunch-Time Debugging)
- **Location**: `~/.gemini/config/skills/rapid-debugger/SKILL.md`
- **Purpose**: Emergency bug hunting. Forces log extraction first, tracing upstream contract breaks, and applying targeted fixes without silent `try/except` fallbacks.

### 3. 🎯 `gsd` (Get Shit Done Framework)
- **Location**: `~/.gemini/config/skills/gsd/SKILL.md`
- **Purpose**: Goal-driven spec-anchored planning, execution, and verification loop.

### 4. 🎨 `hackathon-demo-prep` (Stage & Pitch Preparation)
- **Location**: `~/.gemini/config/skills/hackathon-demo-prep/SKILL.md`
- **Purpose**: Prepares live demo data, graceful UI fallback handlers, and pitch outline (`DEMO_PITCH.md`) in the final hours before judging.

### 5. 🧠 `karpathy-guidelines`
- **Location**: `~/.gemini/config/skills/karpathy-guidelines/SKILL.md`
- **Purpose**: Core LLM coding principles: Think before coding, simplicity first, surgical changes, goal-driven execution.

---

## 🚀 Category 2: Addy Osmani Agent Skills (`addyosmani/agent-skills`)

Local Location: `./.skills/`

| Skill Folder | Core Purpose & Use Case |
| :--- | :--- |
| **`api-and-interface-design`** | Design intuitive, consistent, clean REST/GraphQL APIs and internal function contracts. |
| **`browser-testing-with-devtools`** | Automated browser testing, DOM inspection, network tab performance debugging. |
| **`ci-cd-and-automation`** | Continuous integration scripts, automated workflow pipelines, build checks. |
| **`code-review-and-quality`** | Deep static code review for security, maintainability, and clean architecture. |
| **`code-simplification`** | Refactor overly complex routines into simple, readable, maintainable blocks. |
| **`constraint-driven-development`**| Build features under strict runtime constraints (memory, latency, rate limits). |
| **`context-engineering`** | Optimize context windows, prompt payloads, and multi-agent state parameters. |
| **`debugging-and-error-recovery`** | Systematic root-cause isolation and graceful error recovery implementation. |
| **`deprecation-and-migration`** | Safely migrate old legacy code, schema versions, or third-party APIs. |
| **`documentation-and-adrs`** | Write clean Architectural Decision Records (ADRs) and clear API/code docs. |
| **`doubt-driven-development`** | Validate assumptions against edge cases before declaring feature readiness. |
| **`frontend-ui-engineering`** | Modern UI component design, accessibility (a11y), responsive layouts. |
| **`git-workflow-and-versioning`** | Clean commit history, branch strategies, PR management, semantic versioning. |
| **`idea-refine`** | Transform high-level hackathon product ideas into clear technical specifications. |
| **`incremental-implementation`** | Deliver features in tiny, testable steps rather than massive single commits. |
| **`interview-me`** | Interactive agent interview mode to extract missing requirements and clarify decisions. |
| **`observability-and-instrumentation`**| Add structured logging, telemetry, metrics, and tracing to backend/AI pipelines. |
| **`performance-optimization`** | Latency profiling, memory leak detection, database query optimization. |
| **`planning-and-task-breakdown`** | Breakdown complex epics into small, actionable engineering tasks. |
| **`security-and-hardening`** | Input validation, auth sanitization, secret masking, OWASP top 10 prevention. |
| **`shipping-and-launch`** | Final release checklists, deployment verification, environment variable audits. |
| **`source-driven-development`** | Anchor engineering logic directly against authoritative source code & docs. |
| **`spec-driven-development`** | Build features strictly anchored to written specifications and schemas. |
| **`test-driven-development`** | Write tests first (TDD) to enforce behavior before implementing logic. |
| **`using-agent-skills`** | Meta-skill for discovering, loading, and composing multiple skills effectively. |

---

## 🎯 4-Member Team Skill Assignment Matrix

| Team Member | Domain | Primary Skills to Use |
| :--- | :--- | :--- |
| **Member 1** | **Frontend** | `frontend-ui-engineering`, `browser-testing-with-devtools`, `generative_ui`, `ponytail` |
| **Member 2** | **Backend** | `performance-optimization`, `observability-and-instrumentation`, `security-and-hardening`, `gsd` |
| **Member 3** | **API** | `api-and-interface-design`, `spec-driven-development`, `documentation-and-adrs`, `karpathy-guidelines` |
| **Member 4** | **AI / ML Agent** | `context-engineering`, `idea-refine`, `debugging-and-error-recovery`, `hackathon-demo-prep` |

