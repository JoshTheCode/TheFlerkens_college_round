import pytest
from fastapi.testclient import TestClient
from api.app import app


@pytest.fixture
def client():
    return TestClient(app)


def test_health_endpoint(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "api_ready" in data
    assert "provider_ready" in data


def test_get_default_target(client):
    res = client.get("/api/v1/targets/default")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "bank_agent_v1"
    assert len(data["tools"]) == 5


def test_attack_lifecycle_and_defense_validation(client):
    # 1. Start baseline run
    res = client.post("/api/v1/attacks/start")
    assert res.status_code == 200
    baseline = res.json()
    run_id = baseline["run_id"]
    assert baseline["total_findings_count"] >= 2

    # 2. Query run status
    res_status = client.get(f"/api/v1/attacks/{run_id}")
    assert res_status.status_code == 200
    assert res_status.json()["run_id"] == run_id

    # 3. Retrieve trace
    res_trace = client.get(f"/api/v1/attacks/{run_id}/trace")
    assert res_trace.status_code == 200
    assert res_trace.json()["run_id"] == run_id

    # 4. Validate defense with baseline_run_id
    res_defense = client.post(
        "/api/v1/defenses/validate",
        json={"baseline_run_id": run_id, "defense_profile": {"isolate_untrusted_documents": True}},
    )
    assert res_defense.status_code == 200
    report = res_defense.json()
    assert report["baseline_run_id"] == run_id
    assert report["exact_replay_blocking_rate"] == 100.0


def test_missing_run_id_returns_404(client):
    res = client.get("/api/v1/attacks/nonexistent_run_999")
    assert res.status_code == 404


def test_start_attack_run_accepts_mode_and_body(client):
    res = client.post(
        "/api/v1/attacks/start",
        json={"target_id": "bank_agent_v1", "execution_mode": "deterministic_fixture"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["execution_mode"] == "deterministic_fixture"
    assert data["total_findings_count"] >= 2


def test_runtime_openapi_matches_committed_contract():
    import json
    from pathlib import Path
    spec_path = Path("api/openapi.json")
    committed = json.loads(spec_path.read_text(encoding="utf-8"))
    runtime = app.openapi()

    assert runtime["info"]["version"] == committed["info"]["version"]
    assert set(runtime["paths"].keys()) == set(committed["paths"].keys())
    assert runtime["info"]["version"] == "1.1.0"


def test_nonexistent_trace_and_defense_validation_404(client):
    res_trace = client.get("/api/v1/attacks/nonexistent_run_999/trace")
    assert res_trace.status_code == 404

    res_val = client.post(
        "/api/v1/defenses/validate",
        json={"baseline_run_id": "nonexistent_run_999"},
    )
    assert res_val.status_code == 404

