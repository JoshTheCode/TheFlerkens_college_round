# AgentBreak Branch Audit

> Audited branch: `codex/agentbreak-ai-agents`  
> Audited commit: `741ea01c8b4f10c9d768b8a8f510f80d327bc726`  
> Audit date: 2026-10-10

## Executive Verdict

The current implementation is a useful deterministic security-demo prototype, but it is not yet an autonomous AI red-team system.

The code demonstrates three seeded banking-agent failure modes, captures tool evidence, applies deterministic security rules, and compares vulnerable and defended behavior. However, the attack planner, payload generator, and target are all scripted. There is no model provider, model reasoning, dynamic tool selection, adaptive feedback loop, or PydanticAI runtime.

The honest current description is:

> A deterministic simulator for demonstrating three AI-agent security failure modes.

Calling the current branch an autonomous AI agent would overstate what is implemented.

## Scorecard

| Area | Score | Assessment |
| --- | ---: | --- |
| Autonomous agency | 2/10 | No model reasoning, dynamic planning, adaptation, or tool selection |
| AI implementation | 1/10 | No PydanticAI or model-provider integration |
| Security-demo concept | 7/10 | Three understandable attacks with visible evidence |
| Architecture | 5/10 | Sensible separation, but behavior is mostly scripted |
| Code quality | 5/10 | Small and readable, but incomplete and occasionally misleading |
| Testing | 3/10 | Four narrow tests and no reproducible dependency setup |
| API | 4/10 | Useful skeleton, synchronous and memory-only |
| Defense evaluation | 3/10 | Shows mitigation behavior but does not replay saved exploits correctly |
| Demo readiness | 5/10 | The prerecorded trace supports an offline presentation |
| Hackathon competitiveness | 4/10 | Strong premise, insufficient technical novelty in the current implementation |
| Overall | **4/10** | Scripted proof of concept rather than the claimed platform |

## What Is Working

- The retail-banking scenario gives the attacks an understandable, high-impact narrative.
- All banking data and tools are simulated in memory.
- The interceptor captures tool arguments, requested resources, authorization results, result summaries, and secret exposure.
- Security findings are decided by deterministic Python rules rather than LLM self-grading.
- Typed Pydantic models provide a useful frontend contract.
- Baseline-versus-defense comparison is a strong demonstration format.
- The prerecorded trace offers an offline fallback.
- The implementation remains small enough to repair quickly.

## Why It Is Not Autonomous Yet

### Static planning

`AttackPlanner.plan_attacks()` returns the same three plans on every run. It does not inspect the target profile, discover capabilities, form hypotheses, or revise strategy.

### Static payload generation

`PayloadGenerator.generate_payload()` selects from predefined strings using only an attempt number. It receives no target observation, failed predicate, judge feedback, or prior trace.

### Scripted target

`VulnerableMockBankAgent.handle_message()` is a keyword router. Specific words deterministically trigger specific vulnerabilities. It does not use an LLM to interpret instructions or select tools.

### Seeded discovery

The attacker, target, and judge all know the same seeded markers and attack paths. The system replays known demonstrations rather than discovering vulnerabilities.

## Technical Gaps

### Missing AI runtime

- No PydanticAI agent exists.
- No model is called.
- No provider URL, model name, or API key configuration exists.
- No structured model output or model-call trace exists.

### Incorrect adaptation claim

Failed attempt evidence is never sent back to the payload generator. Incrementing an attempt number and selecting another canned string is not adaptive reasoning.

### Incorrect defense replay

`validate_defense()` launches a new attack suite instead of replaying the exact payloads that succeeded in the baseline run. Results currently look reproducible only because the payloads are hardcoded.

### Weak trace semantics

- `memory_diff` contains the entire memory mapping, not a true before/after diff.
- Tool records do not include timestamps or policy-rule identifiers.
- Attempts within one family reuse a sandbox and copy cumulative call records.
- The trace omits immutable target snapshots and model metadata.
- No token, latency, cost, stopping-reason, or provider-failure fields exist.
- Run IDs are random despite the implementation plan requesting deterministic identifiers.

### Missing bounded-autonomy controls

- No per-model-call timeout.
- No overall run timeout.
- No token or cost budget.
- No cancellation mechanism.
- No provider error classification or fallback behavior.

### API limitations

- Attack execution is synchronous.
- Traces disappear when the process restarts.
- A global mutable coordinator is shared between callers.
- CORS permits all origins while credentials are enabled.
- Health reporting does not test provider readiness.
- Defense validation does not accept a baseline run ID.
- Start requests cannot select a target, attack families, limits, or model configuration.

### Reproducibility failure

The branch has no `pyproject.toml`, requirements file, lockfile, `.env.example`, CI workflow, or usable setup guide. A clean checkout therefore cannot independently reproduce the claimed passing tests.

### Test gaps

The existing tests do not cover:

- API routes and malformed requests;
- planner schemas;
- evidence-based payload adaptation;
- individual judge predicates;
- blocked tool records;
- trace serialization round trips;
- true memory diffs;
- retry and stopping behavior;
- budgets and timeouts;
- provider errors;
- persistence;
- secret masking.

## Correct Product Standard

AgentBreak should qualify as autonomous only when it can:

1. inspect an arbitrary declared target profile;
2. generate a target-specific structured attack plan with a model;
3. execute a payload against a tool-calling target;
4. observe tool, memory, and response evidence;
5. revise the next payload using the previous failure evidence;
6. stop under explicit attempt, time, token, and cost limits;
7. preserve a deterministic evidence trail;
8. replay exact successful attacks under defenses;
9. separately attempt fresh adaptive bypasses.

The deterministic sandbox and judge should remain authoritative even after model-driven agents are added.

## Recommended Recovery Plan

### Phase 1: Reproducibility

- Add `pyproject.toml` with pinned runtime and test dependencies.
- Add a lockfile and `.env.example`.
- Document exact install, test, API, attack, and validation commands.
- Add continuous integration.
- Make the existing deterministic suite pass from a clean checkout.
- Update `STATE.md` with verified commands and current limitations.

### Phase 2: Real attacker agents

- Implement a PydanticAI planner that consumes the complete target profile.
- Produce typed `AttackPlan` objects from model output.
- Implement a model-driven payload generator.
- Feed each failed attempt's response, tool trace, failed predicate, and judge feedback into the next attempt.
- Record model identity, prompt version, latency, usage, and stopping reason.
- Enforce attempt, timeout, token, and cost budgets in deterministic coordinator code.

### Phase 3: Real tool-calling target

- Replace keyword dispatch with an LLM-backed target that receives typed fake banking tools.
- Keep the baseline system prompt deliberately weak but realistic.
- Put malicious instructions only in retrieved untrusted content.
- Let the model decide whether to call tools.
- Keep all authorization and side effects inside the interceptor.

### Phase 4: Correct defense evaluation

- Save successful baseline payloads and immutable target snapshots.
- Accept a `baseline_run_id` for validation.
- Replay each exact successful payload under the defense.
- Run fresh adaptive attacks after regression replay.
- Report regression blocking rate and adaptive bypass rate separately.
- Test several legitimate banking tasks, not only balance lookup.

### Phase 5: Evidence and scoring

- Record complete target, prompt, retrieval, model, tool, policy, memory, and stopping metadata.
- Add exploit success rate, attempts-to-exploit, severity-weighted risk, legitimate-task retention, latency, token use, and estimated cost.
- Persist runs so traces survive restarts.

### Phase 6: Demonstration

1. Perform a legitimate balance lookup.
2. Show the planner inspecting the weak target.
3. Display generated and revised payloads.
4. Show the unauthorized tool call and deterministic finding.
5. Apply a defense.
6. Replay the exact exploit and show it blocked.
7. launch a fresh adaptive bypass attempt.
8. Confirm legitimate behavior still works.

## Keep and Replace

### Keep

- Banking domain and fake data.
- Fake tool sandbox.
- Tool and memory interceptor.
- Deterministic security judge.
- Typed trace models.
- Three attack families.
- Defense comparison.
- Prerecorded offline fixture.

### Replace or substantially revise

- Hardcoded planner.
- Static payload arrays.
- Keyword-based target.
- Fake adaptation.
- New-suite behavior presented as replay.
- Process-only persistence.
- Unverifiable setup.
- Minimal root README.

