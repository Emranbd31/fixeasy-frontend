from fastapi.testclient import TestClient

from main import app


def test_health_endpoint():
    client = TestClient(app)
    response = client.get("/healthz")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"
    assert "timestamp" in payload
