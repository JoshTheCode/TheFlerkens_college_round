# AgentBreak API Contract

The canonical integration contract is `api/openapi.json`, OpenAPI 3.1, version 1.1.0, directly aligned with FastAPI's runtime schema.

## Architecture & Endpoints

- **Single Canonical Backend**: Python FastAPI (`http://localhost:8000`) directly owns the AI coordinator, sandbox runtime, trace persistence, and defense evaluator.
- **Synchronous Attack Suite**: `POST /api/v1/attacks/start` executes the bounded multi-turn attack suite synchronously and returns HTTP 200 with the complete `ExecutionTrace`. Optional request body accepts `execution_mode` (`"deterministic_fixture"` or `"live"`), `target_id`, and `attack_families`.
- **Target Specification**: `GET /api/v1/targets/default` returns the default `bank_agent_v1` profile and tool schemas.
- **Run Querying**: `GET /api/v1/attacks/{run_id}` and `GET /api/v1/attacks/{run_id}/trace` allow querying stored traces.
- **Synchronous Defense Validation**: `POST /api/v1/defenses/validate` replays exploits and controls against fortified target with HTTP 200 `EvaluationReport`.
- **Truthful Execution Modes**: Distinguishes `live` model calls from `deterministic_fixture` offline runs. Never silently injects canned data when live mode is selected.

## Validation

```bash
python3 -m json.tool api/openapi.json >/dev/null
python3 scripts/validate_openapi.py
pytest tests/unit/test_api.py
```
