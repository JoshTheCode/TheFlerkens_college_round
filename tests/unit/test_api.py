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

    res_trace = client.get("/api/v1/attacks/nonexistent_run_999/trace")
    assert res_trace.status_code == 404

    res_val = client.post(
        "/api/v1/defenses/validate",
        json={"baseline_run_id": "nonexistent_run_999"},
    )
    assert res_val.status_code == 404
