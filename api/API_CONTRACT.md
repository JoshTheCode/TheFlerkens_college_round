# AgentBreak API Contract

The canonical integration contract is `api/openapi.json`, OpenAPI 3.1, version 1.1.0.

## Decisions

- Starting an attack returns HTTP `202` with a run ID and polling links.
- The coordinator may remain synchronous internally, but clients use the run resource.
- Only `bank_agent_v1` is supported in v1.
- Attack families, execution mode, and safety budgets are explicit inputs.
- Live and deterministic-fixture runs are clearly distinguished.
- Full traces are persisted and retrieved separately from summaries.
- Defense validation references an existing `baseline_run_id`.
- Exact exploit replay occurs before optional adaptive bypass testing.
- Regression blocking, adaptive bypass, and legitimate-task retention are separate metrics.
- Errors use `application/problem+json`.
- Private chain-of-thought is never stored; only safe planner summaries and adaptation notes are exposed.

## Compatibility

Removing or renaming fields, narrowing accepted values, or changing response status codes requires a new API version. Additive optional fields are allowed within v1.

## Current implementation gap

The existing FastAPI application predates contract v1.1. It still needs configured attack-start requests, `202` responses and links, execution mode and budgets, schema-versioned trace metrics, model-call metadata, standardized problem details, multiple legitimate-task results, and optional adaptive-bypass control.

## Validation

```bash
python3 -m json.tool api/openapi.json >/dev/null
python3 scripts/validate_openapi.py
```

