import os
import sys
import cv2
import websockets
import asyncio
import json
import base64
from datetime import datetime, timezone
from typing import Tuple

ENABLE_DASHCAM = os.getenv("ENABLE_DASHCAM", "false").lower() == "true"
BACKEND_WS = os.getenv("BACKEND_WS", "ws://localhost:8000/ws/frame")
DASHCAM_URL = os.getenv("DASHCAM_URL", "rtsp://192.168.1.100:554/stream")
LOCATION_PROVIDER = os.getenv("LOCATION_PROVIDER", "env")
LOCATION_FILE = os.getenv("LOCATION_FILE")
FRAME_INTERVAL = float(os.getenv("FRAME_INTERVAL", "0.3"))

if not ENABLE_DASHCAM:
    print("Dash-cam disabled – exiting")
    sys.exit(0)


def _env_location() -> Tuple[float | None, float | None]:
    lat = os.getenv("LOCATION_LAT")
    lon = os.getenv("LOCATION_LON")
    try:
        return (float(lat), float(lon)) if lat and lon else (None, None)
    except ValueError:
        return None, None


def _file_location() -> Tuple[float | None, float | None]:
    if not LOCATION_FILE:
        return None, None
    try:
        with open(LOCATION_FILE, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
        lat = payload.get("lat")
        lon = payload.get("lon")
        return (float(lat), float(lon)) if lat is not None and lon is not None else (None, None)
    except (OSError, ValueError, json.JSONDecodeError):
        return None, None


def get_current_location() -> Tuple[float | None, float | None]:
    if LOCATION_PROVIDER == "file":
        lat, lon = _file_location()
        if lat is not None and lon is not None:
            return lat, lon
        return _env_location()
    return _env_location()

async def capture_and_send():
    cap = cv2.VideoCapture(DASHCAM_URL)
    if not cap.isOpened():
        print("Failed to open RTSP stream")
        return

    uri = BACKEND_WS
    async with websockets.connect(uri, max_size=None) as websocket:
        print("Connected to backend WS")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to read frame")
                break

            success, buffer = cv2.imencode('.jpg', frame)
            if not success:
                continue

            frame_b64 = base64.b64encode(buffer).decode("ascii")
            lat, lon = get_current_location()

            payload = {
                "frame": frame_b64,
                "lat": lat,
                "lon": lon,
                "ts": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            }

            await websocket.send(json.dumps(payload))

            await asyncio.sleep(FRAME_INTERVAL)

    cap.release()

if __name__ == "__main__":
    asyncio.run(capture_and_send())
