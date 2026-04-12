import base64
import binascii
import json
from datetime import datetime, timezone
from typing import Any, Tuple

import numpy as np
from PIL import Image
import io


def _bytes_to_rgb_array(jpeg_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(jpeg_bytes)).convert("RGB")
    return np.array(img)


def decode_frame(payload: Any) -> Tuple[np.ndarray, float | None, float | None, datetime]:
    """Decode raw JPEG bytes or JSON/dict payload that includes a base64 frame."""

    lat = None
    lon = None
    ts = datetime.now(timezone.utc)

    if isinstance(payload, (bytes, bytearray)):
        return _bytes_to_rgb_array(bytes(payload)), lat, lon, ts

    obj = None
    if isinstance(payload, str):
        try:
            obj = json.loads(payload)
        except json.JSONDecodeError as e:
            raise ValueError("Invalid JSON payload") from e
    elif isinstance(payload, dict):
        obj = payload

    if obj is None:
        raise ValueError("Unsupported payload type")

    frame_b64 = obj.get("frame")
    if not frame_b64 or not isinstance(frame_b64, str):
        raise ValueError("Missing 'frame' field")

    if "," in frame_b64:
        frame_b64 = frame_b64.split(",", 1)[1]

    try:
        jpeg_bytes = base64.b64decode(frame_b64, validate=True)
    except (binascii.Error, ValueError) as e:
        raise ValueError("Invalid base64 in 'frame'") from e

    lat_val = obj.get("lat")
    lon_val = obj.get("lon")
    ts_val = obj.get("ts")

    if lat_val is not None:
        try:
            lat = float(lat_val)
        except (TypeError, ValueError):
            lat = None

    if lon_val is not None:
        try:
            lon = float(lon_val)
        except (TypeError, ValueError):
            lon = None

    if ts_val:
        try:
            if isinstance(ts_val, datetime):
                ts = ts_val
            else:
                ts = datetime.fromisoformat(str(ts_val).replace("Z", "+00:00"))
        except Exception:
            ts = datetime.now(timezone.utc)

    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    else:
        ts = ts.astimezone(timezone.utc)

    return _bytes_to_rgb_array(jpeg_bytes), lat, lon, ts
