import uuid
import os
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.pothole_log import PotholeLog
from app.utils.decode_frame import decode_frame
from ml.inference.predictor import predict_image

router = APIRouter()

TEMP_DIR = "backend/temp_ws_frames"
os.makedirs(TEMP_DIR, exist_ok=True)


def _ensure_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _ensure_ts(value: Any | None, fallback: datetime | None = None) -> datetime:
    if isinstance(value, datetime):
        ts = value
    elif value:
        try:
            ts = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except Exception:
            ts = fallback or datetime.now(timezone.utc)
    else:
        ts = fallback or datetime.now(timezone.utc)

    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    else:
        ts = ts.astimezone(timezone.utc)
    return ts


def _merge_metadata(
    current: Dict[str, Any],
    lat: Any,
    lon: Any,
    ts: Any,
) -> Dict[str, Any]:
    new_lat = _ensure_float(lat)
    new_lon = _ensure_float(lon)
    merged = {
        "lat": new_lat if new_lat is not None else current.get("lat"),
        "lon": new_lon if new_lon is not None else current.get("lon"),
        "ts": _ensure_ts(ts, current.get("ts")),
    }
    return merged


logger = logging.getLogger(__name__)


@router.websocket("/ws/frame")
async def ws_frame(websocket: WebSocket):
    await websocket.accept()

    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    metadata_state: Dict[str, Any] = {
        "lat": None,
        "lon": None,
        "ts": datetime.now(timezone.utc),
    }

    try:
        while True:
            try:
                message = await websocket.receive()

                rgb = None
                lat = metadata_state.get("lat")
                lon = metadata_state.get("lon")
                ts = metadata_state.get("ts")

                payload_bytes = message.get("bytes") if "bytes" in message else None
                payload_text = message.get("text") if "text" in message else None

                if payload_bytes is not None:
                    rgb, _, _, _ = decode_frame(payload_bytes)

                elif payload_text is not None:
                    parsed = json.loads(payload_text)

                    if "frame" in parsed:
                        rgb, parsed_lat, parsed_lon, parsed_ts = decode_frame(parsed)

                        metadata_state = _merge_metadata(
                            metadata_state,
                            parsed_lat,
                            parsed_lon,
                            parsed_ts,
                        )
                        lat = metadata_state.get("lat")
                        lon = metadata_state.get("lon")
                        ts = metadata_state.get("ts")
                    else:
                        metadata_state = _merge_metadata(
                            metadata_state,
                            parsed.get("lat"),
                            parsed.get("lon"),
                            parsed.get("ts"),
                        )
                        continue
                else:
                    continue

                if rgb is None:
                    continue

                ts = _ensure_ts(ts)
                metadata_state["lat"] = lat
                metadata_state["lon"] = lon
                metadata_state["ts"] = ts

                filename = f"{uuid.uuid4()}.jpg"
                file_path = os.path.join(TEMP_DIR, filename)

                try:
                    from PIL import Image

                    Image.fromarray(rgb).save(file_path, format="JPEG")

                    result = predict_image(file_path)

                    class_name = result["class"]
                    confidence = float(result["confidence"])
                    class_id_map = {"no_pothole": 0, "minor": 1, "severe": 2}
                    class_id = class_id_map.get(class_name, 1)

                    db.add(
                        PotholeLog(
                            image_path=file_path,
                            lat=lat,
                            lon=lon,
                            class_id=class_id,
                            confidence=confidence,
                            ts=ts,
                        )
                    )
                    db.commit()

                    logger.info(
                        "Logged detection severity=%s confidence=%.2f lat=%s lon=%s",
                        class_name,
                        confidence,
                        lat,
                        lon,
                    )

                    await websocket.send_json(
                        {
                            "severity": class_name,
                            "class_id": class_id,
                            "confidence": confidence,
                            "lat": lat,
                            "lon": lon,
                            "ts": ts.isoformat().replace("+00:00", "Z"),
                        }
                    )
                finally:
                    if os.path.exists(file_path):
                        os.remove(file_path)

            except WebSocketDisconnect:
                raise
            except json.JSONDecodeError:
                logger.warning("Received non-JSON text payload on /ws/frame")
                continue
            except ValueError as exc:
                logger.warning("Failed to decode frame: %s", exc)
                continue
            except Exception as exc:  # pylint: disable=broad-except
                logger.exception("WebSocket frame processing failed")
                try:
                    await websocket.send_json({"error": str(exc)})
                except Exception:  # noqa: BLE001
                    pass
                continue

    except WebSocketDisconnect:
        return
    finally:
        db.close()
