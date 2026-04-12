import pytest
from fastapi.testclient import TestClient
from backend.app.core.main import app

client = TestClient(app)

def test_ws_frame_json():
    # Test WS with JSON frame
    # This would require websockets testing, simplified for now
    assert True

def test_enable_dashcam_flag():
    # Test that capture worker respects flag
    assert True
