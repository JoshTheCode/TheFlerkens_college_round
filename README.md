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

## Setup

Reproducible setup is the first unresolved milestone. Before presenting the project as complete, add:

- `pyproject.toml`;
- a committed lockfile;
- `.env.example`;
- exact install, test, and run commands;
- continuous integration.

Do not infer a passing build from the prerecorded trace.
