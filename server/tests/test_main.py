"""Basic integration tests for the FastAPI server using pytest.

These tests verify that the core endpoints are reachable and return the
expected JSON payloads. They are intentionally lightweight so they can run
quickly in the CI pipeline.
"""

from fastapi.testclient import TestClient

# Import the FastAPI app instance defined in the server's entry point.
from main import app

client = TestClient(app)


def test_root_endpoint() -> None:
    """The root endpoint should respond with a simple message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Backend running"}


def test_health_endpoint() -> None:
    """Health check endpoint should indicate service status is ok."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
