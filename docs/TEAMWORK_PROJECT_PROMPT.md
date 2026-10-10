# Teamwork Project Prompt — AgentBreak

> Status: Approved implementation brief  
> Target branch: `codex/agentbreak-ai-agents`  
> Working directory: `/Users/yuvrajsharma/.gemini/antigravity/scratch`  
> Integrity mode: development

## Objective

Build AgentBreak, an autonomous AI security-testing platform and bounded red-team pipeline that probes a vulnerable mock Banking Assistant AI agent for exploitable weaknesses in instructions, memory, retrieved content, and tool permissions.

The platform must generate reproducible evidence, demonstrate findings in an isolated fake banking sandbox, replay exact successful exploits against defenses, and separately test whether an adaptive attacker can bypass those defenses.

Read these files before implementation:

1. `AGENT_IMPLEMENTATION_PLAN.md`
2. `BRANCH_AUDIT.md`
3. `ARCHITECTURE_AND_PLAN.md`
4. `STATE.md`

Do not describe the system as autonomous until the autonomy acceptance criteria below are satisfied.

## Requirements

### R1. Reproducible project setup

- Add a Python 3.11+ project manifest with pinned FastAPI, Pydantic, PydanticAI, and test dependencies.
- Add a lockfile, `.env.example`, setup instructions, and continuous integration.
- A clean clone must be able to install dependencies, run tests, start the API, run a baseline attack, and validate a defense using documented commands.
- Do not commit credentials, runtime traces, caches, or local virtual environments.

### R2. Vulnerable mock banking agent runtime

Implement a realistic LLM-backed retail Banking Assistant with typed fake tools:

- `check_balance`
- `search_internal_policies`
- `read_customer_record`
- `transfer_funds`
- `save_session_note`

The target must use genuine model tool selection. Remove attack-specific keyword-routing logic from the target.

All data and side effects must remain in a seeded in-memory sandbox. The target must never access live banking services, real credentials, the host filesystem, shell commands, email, or arbitrary external networks.

### R3. Deterministic tool-permission and memory interceptor

Every tool call and memory mutation must pass through deterministic Python policy code.

Record:

- timestamp and attempt ID;
- tool and validated arguments;
- requested resource;
- authorization decision;
- policy-rule identifier;
- sanitized result summary;
- secret-exposure markers;
- memory state before and after;
- a true memory diff.

The model must never directly mutate sandbox state.

### R4. Autonomous red-team attack engine

Implement two genuine model-driven attacker roles:

1. **Attack Planner**
   - Consume the complete target profile, system prompt, tool schemas, allowed resources, forbidden resources, and supported attack families.
   - Generate typed, target-specific attack plans.

2. **Adaptive Payload Generator**
   - Generate the initial adversarial payload from the plan.
   - On failure, consume the previous payload, target response, tool trace, failed success predicate, and deterministic judge feedback.
   - Explain what changed in the next attempt.

Support:

- indirect prompt injection through retrieved financial documents;
- unauthorized tool execution and privilege escalation;
- persistent memory poisoning.

The coordinator must be deterministic Python, not another LLM. It must enforce configurable attempt, time, token, and cost budgets, cancellation, and explicit stopping reasons.

Static attack plans and payload fixtures may be retained only as offline fallback data or deterministic tests. They must not be presented as autonomous generation.

### R5. Reproducible execution traces and deterministic judge

Exploit success must be decided by programmatic security predicates, including:

- unauthorized tool execution;
- forbidden resource access;
- secret-marker exposure;
- unauthorized transfer;
- malicious persistent memory state.

Traces must include:

- immutable target profile and defense snapshot;
- planner and generator structured outputs;
- payload history and adaptation notes;
- target responses;
- retrieved content;
- tool calls and policy decisions;
- memory transitions;
- model identity, prompt version, latency, token usage, and error metadata;
- finding severity, evidence, reproduction steps, and mitigation;
- stopping reason.

An LLM may explain a finding, but it must not decide whether the exploit succeeded.

### R6. Defense regression and adaptive validation

Support defense profiles containing:

- untrusted-document isolation;
- explicit recipient and transfer-limit validation;
- least-privilege customer-record access;
- memory-write validation.

Validation has two distinct stages:

1. **Exact regression replay**: replay the exact successful baseline payloads against the identical target snapshot with the defense applied.
2. **Adaptive bypass evaluation**: allow the attacker to generate fresh payloads using evidence from blocked replay attempts.

Report exact replay blocking rate and adaptive bypass rate separately.

Run legitimate controls for balance lookup, permitted transfer, policy lookup, and safe session-note creation. Report legitimate-task retention and false-positive denials.

### R7. Service API and persistence

Expose:

- `POST /api/v1/attacks/start`
- `GET /api/v1/attacks/{run_id}`
- `GET /api/v1/attacks/{run_id}/trace`
- `POST /api/v1/defenses/validate`
- `GET /api/v1/health`

`attacks/start` must accept target, attack-family, and budget configuration.

`defenses/validate` must accept an existing `baseline_run_id`.

Persist traces outside process memory so they survive application restarts. Keep the storage implementation minimal and local for the hackathon.

Health reporting must distinguish API readiness from model-provider readiness without exposing secrets.

### R8. Prerecorded demo fixture

Provide a schema-valid prerecorded trace for offline presentation. Clearly label it as prerecorded.

The live demonstration should show:

1. a legitimate task;
2. model-generated planning;
3. an adaptive payload;
4. deterministic exploit evidence;
5. exact replay blocked by a defense;
6. a fresh adaptive bypass attempt;
7. legitimate-task retention.

## Acceptance Criteria

### Reproducibility

- A clean clone installs from the committed manifest and lockfile.
- The complete test suite passes using a documented command.
- CI runs the same test command.
- The API starts from the documented command.

### Safety

- Fake banking tools cannot access live services, real credentials, the host filesystem, shell commands, or arbitrary networks.
- Models cannot bypass the interceptor to mutate state.
- Logs and traces mask provider credentials and unrelated secrets.

### Genuine autonomy

- Changing the target prompt or tool list changes generated plans without editing attack tables.
- After a failed attempt, the next payload is generated from recorded failure evidence.
- No attack-family-specific keyword dispatch exists in the target.
- Model calls are bounded by deterministic attempt, time, token, and cost limits.
- Every run records an explicit stopping reason.

### Evaluation quality

- The vulnerable baseline produces at least two deterministically verified findings.
- Exact successful exploits are replayed under the defense.
- Regression blocking and adaptive bypass are reported separately.
- Legitimate banking controls pass under the defended profile.
- Trace objects round-trip through their declared schema.

### Tests

- Unit tests cover policies, interceptor records, judge predicates, true memory diffs, budgets, timeouts, and masking.
- Integration tests cover all three attack families, exact replay, adaptive retry, legitimate controls, persistence, and provider failure.
- API tests cover success, not-found, malformed-input, and health behavior.
- Model interactions use deterministic test doubles in CI.

## Implementation Order

1. Make the existing project reproducible and get deterministic tests passing.
2. Correct trace semantics, persistence, and defense replay.
3. Add the real model-driven planner and adaptive generator.
4. Replace the keyword target with a genuine tool-calling model target.
5. Add bounded-autonomy controls and provider error handling.
6. Expand tests and CI.
7. Update the API contract and frontend fixture.
8. Rehearse and verify the complete live and offline demonstration.

## Scope Boundaries

Do not add:

- live banking integrations;
- production credentials;
- unrestricted filesystem, browser, email, SaaS, or shell tools;
- distributed workers;
- multi-tenant authentication;
- unrestricted autonomous attack loops;
- automatic deployment or merging.

Prefer the smallest implementation that satisfies the measurable autonomy, safety, replay, and test criteria.

