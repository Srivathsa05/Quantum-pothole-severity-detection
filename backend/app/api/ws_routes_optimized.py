"""
Optimized WebSocket routes with frame buffering, adaptive FPS, and backpressure handling.
"""
import uuid
import os
import json
import logging
import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from dataclasses import dataclass, field
from collections import deque

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.pothole_log import PotholeLog
from app.utils.db_helpers import save_detection_with_mix
from app.utils.decode_frame import decode_frame
from ml.inference.predictor import predict_image

router = APIRouter()

TEMP_DIR = "backend/temp_ws_frames"
os.makedirs(TEMP_DIR, exist_ok=True)

logger = logging.getLogger(__name__)


@dataclass
class FrameBuffer:
    """Thread-safe frame buffer with backpressure handling."""
    max_size: int = 5
    frames: deque = field(default_factory=lambda: deque(maxlen=5))
    dropped_count: int = 0
    
    def add(self, frame_data: dict) -> bool:
        """Add frame to buffer. Returns False if frame was dropped."""
        if len(self.frames) >= self.max_size:
            self.dropped_count += 1
            # Drop oldest frame to make room
            self.frames.popleft()
        self.frames.append(frame_data)
        return True
    
    def get(self) -> Optional[dict]:
        """Get oldest frame from buffer."""
        if self.frames:
            return self.frames.popleft()
        return None
    
    def is_empty(self) -> bool:
        return len(self.frames) == 0
    
    def size(self) -> int:
        return len(self.frames)


@dataclass
class AdaptiveFPS:
    """Adaptive FPS controller based on network latency."""
    base_interval_ms: float = 100.0  # Start with 10 FPS
    min_interval_ms: float = 50.0   # Max 20 FPS
    max_interval_ms: float = 500.0  # Min 2 FPS
    latency_threshold_ms: float = 300.0
    
    current_interval_ms: float = field(default=100.0)
    last_latency_ms: float = field(default=0.0)


@dataclass
class ConfidenceSmoother:
    """Temporal smoothing for confidence scores to prevent rapid fluctuations."""
    window_size: int = 3
    history: deque = field(default_factory=lambda: deque(maxlen=3))
    
    def add(self, class_name: str, confidence: float) -> tuple[str, float]:
        """Add prediction and return smoothed result."""
        self.history.append({"class": class_name, "confidence": confidence})
        
        if len(self.history) < 2:
            return class_name, confidence
        
        # Count class occurrences in window
        class_counts = {}
        total_confidence = {}
        for pred in self.history:
            c = pred["class"]
            class_counts[c] = class_counts.get(c, 0) + 1
            total_confidence[c] = total_confidence.get(c, 0) + pred["confidence"]
        
        # Select most frequent class
        majority_class = max(class_counts, key=class_counts.get)
        avg_confidence = total_confidence[majority_class] / class_counts[majority_class]
        
        # Minimal boost for majority class to prevent getting stuck
        boosted_confidence = min(avg_confidence * 1.02, 0.99)
        
        return majority_class, boosted_confidence
    
    def clear(self):
        self.history.clear()


# Restore AdaptiveFPS class that was corrupted
@dataclass
class AdaptiveFPS:
    """Adaptive FPS controller based on network latency."""
    base_interval_ms: float = 100.0  # Start with 10 FPS
    min_interval_ms: float = 50.0   # Max 20 FPS
    max_interval_ms: float = 500.0  # Min 2 FPS
    latency_threshold_ms: float = 300.0
    
    current_interval_ms: float = field(default=100.0)
    last_latency_ms: float = field(default=0.0)
    
    def update(self, latency_ms: float) -> float:
        """Update interval based on latency and return new interval."""
        self.last_latency_ms = latency_ms
        
        if latency_ms > self.latency_threshold_ms * 2:
            # High latency - significantly reduce FPS
            self.current_interval_ms = min(
                self.current_interval_ms * 1.5, 
                self.max_interval_ms
            )
        elif latency_ms > self.latency_threshold_ms:
            # Moderate latency - slightly reduce FPS
            self.current_interval_ms = min(
                self.current_interval_ms * 1.2, 
                self.max_interval_ms
            )
        elif latency_ms < self.latency_threshold_ms / 2:
            # Low latency - increase FPS
            self.current_interval_ms = max(
                self.current_interval_ms * 0.9, 
                self.min_interval_ms
            )
        
        return self.current_interval_ms
    
    def get_interval_seconds(self) -> float:
        return self.current_interval_ms / 1000.0


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


def calibrate_prediction(result: dict, temperature: float = 1.2) -> dict:
    """
    Apply temperature scaling to soften overconfident predictions.
    Temperature > 1.0 makes distribution more uniform (less confident).
    Reduced from 2.0 to 1.2 to allow higher confidence when model is confident.
    """
    import torch
    import numpy as np
    
    logits = torch.tensor(result["raw_logits"])
    # Apply temperature scaling
    calibrated_logits = logits / temperature
    probs = torch.softmax(calibrated_logits, dim=0).numpy()
    
    # Find new prediction
    pred_idx = int(np.argmax(probs))
    class_names = ["no_pothole", "minor", "severe"]
    
    return {
        "class": class_names[pred_idx],
        "confidence": float(probs[pred_idx]),
        "all_probabilities": {name: float(p) for name, p in zip(class_names, probs)},
    }


# Global smoother per WebSocket connection (will be passed in)
async def process_frame(
    frame_data: dict,
    db: Session,
    metadata_state: Dict[str, Any],
    confidence_smoother: Optional[ConfidenceSmoother] = None
) -> Optional[dict]:
    """Process a single frame and return result."""
    rgb = None
    lat = metadata_state.get("lat")
    lon = metadata_state.get("lon")
    ts = metadata_state.get("ts")
    
    try:
        if "frame" in frame_data:
            rgb, parsed_lat, parsed_lon, parsed_ts = decode_frame(frame_data)
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
                frame_data.get("lat"),
                frame_data.get("lon"),
                frame_data.get("ts"),
            )
            return None
        
        if rgb is None:
            return None
        
        ts = _ensure_ts(ts)
        
        filename = f"{uuid.uuid4()}.jpg"
        file_path = os.path.join(TEMP_DIR, filename)
        
        try:
            from PIL import Image

            Image.fromarray(rgb).save(file_path, format="JPEG")

            result = predict_image(file_path, debug=False)

            raw_class_name = result["class"]
            raw_confidence = float(result["confidence"])
            raw_probs = result.get("all_probabilities", {})

            # Apply calibration if confidence is too high (overconfident model)
            if raw_confidence > 0.95 and raw_class_name == "severe":
                calibrated = calibrate_prediction(result, temperature=1.2)
                raw_class_name = calibrated["class"]
                raw_confidence = calibrated["confidence"]
                raw_probs = calibrated["all_probabilities"]

            # Apply temporal smoothing for video frames
            if confidence_smoother:
                class_name, confidence = confidence_smoother.add(raw_class_name, raw_confidence)
            else:
                class_name, confidence = raw_class_name, raw_confidence
            
            class_id_map = {"no_pothole": 0, "minor": 1, "severe": 2}
            class_id = class_id_map.get(class_name, 1)

            # Save to PotholeLog (legacy table)
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

            # Save to DetectionHistory (new table for analytics)
            try:
                save_detection_with_mix(
                    db=db,
                    location=f"Live Detection Camera {metadata_state.get('camera_id', 0)}",
                    severity=class_name,
                    confidence=confidence,
                    latitude=lat,
                    longitude=lon,
                    detection_type="live",
                    camera_id=metadata_state.get("camera_id"),
                    all_probabilities=raw_probs,
                )
            except Exception as db_error:
                # Log database error but don't fail the prediction
                logger.warning(f"DetectionHistory save failed: {db_error}")

            db.commit()

            # Get probabilities for logging (if available)
            probs = result.get("all_probabilities", {})
            probs_str = " | ".join([f"{k}={v:.2f}" for k, v in probs.items()]) if probs else "N/A"

            logger.info(
                "Logged detection severity=%s confidence=%.2f lat=%s lon=%s | %s",
                class_name,
                confidence,
                lat,
                lon,
                probs_str
            )
            
            return {
                "severity": class_name,
                "class_id": class_id,
                "confidence": confidence,
                "lat": lat,
                "lon": lon,
                "ts": ts.isoformat().replace("+00:00", "Z"),
                "all_probabilities": probs,
            }
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as exc:
        logger.exception("Frame processing failed")
        return {"error": str(exc)}


@router.websocket("/ws/frame")
async def ws_frame(websocket: WebSocket):
    """Optimized WebSocket with frame buffering and adaptive FPS."""
    await websocket.accept()

    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Initialize components
    frame_buffer = FrameBuffer(max_size=5)
    adaptive_fps = AdaptiveFPS(
        base_interval_ms=100.0,
        min_interval_ms=50.0,
        max_interval_ms=500.0,
        latency_threshold_ms=300.0
    )
    confidence_smoother = ConfidenceSmoother(window_size=3)

    metadata_state: Dict[str, Any] = {
        "lat": None,
        "lon": None,
        "ts": datetime.now(timezone.utc),
    }

    # Track performance
    pending_sent_at: Optional[float] = None
    is_processing = False

    # Keepalive ping task
    keepalive_task: Optional[asyncio.Task] = None

    async def keepalive_pinger():
        """Send periodic pings to prevent 1011 timeout."""
        try:
            while True:
                await asyncio.sleep(30)  # Ping every 30 seconds
                try:
                    await websocket.send_json({"type": "ping"})
                except Exception:
                    break
        except asyncio.CancelledError:
            pass
    
    async def receive_frames():
        """Continuously receive frames from client."""
        while True:
            try:
                message = await websocket.receive()

                payload_text = message.get("text") if "text" in message else None

                if payload_text:
                    try:
                        parsed = json.loads(payload_text)

                        # Add timestamp for latency calculation
                        parsed["_received_at"] = datetime.now(timezone.utc).timestamp()

                        # Add to buffer (may drop if full)
                        was_added = frame_buffer.add(parsed)
                        if not was_added:
                            logger.warning("Frame dropped - buffer full")

                    except json.JSONDecodeError:
                        logger.warning("Received non-JSON text payload")

            except WebSocketDisconnect:
                logger.info("Client disconnected (WebSocketDisconnect)")
                break
            except RuntimeError as exc:
                # Handle disconnect message already received
                if "disconnect message" in str(exc).lower() or "close message has been received" in str(exc).lower():
                    logger.info("Client disconnected (RuntimeError): %s", exc)
                    break
                logger.error("Runtime error in receive_frames: %s", exc)
                break
            except Exception as exc:
                logger.error("Frame receive error: %s", exc)
                await asyncio.sleep(0.1)
    
    async def process_frames():
        """Process frames from buffer and send results."""
        nonlocal is_processing, pending_sent_at

        while True:
            try:
                if frame_buffer.is_empty():
                    await asyncio.sleep(0.01)  # Small sleep to prevent CPU spinning
                    continue

                is_processing = True
                frame_data = frame_buffer.get()

                if frame_data is None:
                    is_processing = False
                    continue

                # Calculate latency from receive time
                received_at = frame_data.pop("_received_at", None)
                if received_at:
                    current_latency = (datetime.now(timezone.utc).timestamp() - received_at) * 1000
                    adaptive_fps.update(current_latency)

                # Process the frame with confidence smoothing
                pending_sent_at = datetime.now(timezone.utc).timestamp()
                result = await process_frame(frame_data, db, metadata_state, confidence_smoother)

                if result:
                    # Add processing latency info
                    if pending_sent_at:
                        processing_time = (datetime.now(timezone.utc).timestamp() - pending_sent_at) * 1000
                        result["processing_time_ms"] = round(processing_time, 2)
                        result["buffer_size"] = frame_buffer.size()
                        result["recommended_interval_ms"] = round(adaptive_fps.current_interval_ms, 2)

                    await websocket.send_json(result)

                is_processing = False

                # Adaptive delay based on current FPS setting
                await asyncio.sleep(adaptive_fps.get_interval_seconds())

            except WebSocketDisconnect:
                logger.info("Process frames: Client disconnected (WebSocketDisconnect)")
                break
            except RuntimeError as exc:
                if "disconnect message" in str(exc).lower() or "close message has been received" in str(exc).lower():
                    logger.info("Process frames: Client disconnected (RuntimeError): %s", exc)
                    break
                logger.error("Runtime error in process_frames: %s", exc)
                is_processing = False
                await asyncio.sleep(0.1)
            except Exception as exc:
                logger.error("Frame processing loop error: %s", exc)
                is_processing = False
                await asyncio.sleep(0.1)
    
    try:
        # Start keepalive pinger
        keepalive_task = asyncio.create_task(keepalive_pinger())

        # Run receive and process concurrently
        await asyncio.gather(
            receive_frames(),
            process_frames()
        )
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except RuntimeError as exc:
        if "disconnect message" in str(exc).lower():
            logger.info("WebSocket disconnected cleanly")
        else:
            logger.warning(f"Runtime error in gather: {exc}")
    except Exception as exc:
        logger.exception("Error in WebSocket handler")
    finally:
        # Cancel keepalive task
        if keepalive_task:
            keepalive_task.cancel()
            try:
                await keepalive_task
            except asyncio.CancelledError:
                pass

        db.close()


@router.websocket("/ws/stream")
async def ws_stream(websocket: WebSocket):
    """
    WebRTC-compatible WebSocket for lower latency streaming.
    Uses binary frames for better performance.
    """
    await websocket.accept()
    
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    frame_buffer = FrameBuffer(max_size=10)  # Larger buffer for binary frames
    
    async def receive_binary():
        """Receive binary frame data."""
        while True:
            try:
                message = await websocket.receive()
                
                payload_bytes = message.get("bytes") if "bytes" in message else None
                
                if payload_bytes:
                    try:
                        # Decode binary frame
                        rgb, lat, lon, ts = decode_frame(bytes(payload_bytes))
                        
                        frame_data = {
                            "rgb": rgb,
                            "lat": lat,
                            "lon": lon,
                            "ts": ts,
                            "_received_at": datetime.now(timezone.utc).timestamp(),
                        }
                        
                        frame_buffer.add(frame_data)
                    except ValueError as exc:
                        logger.warning("Failed to decode binary frame: %s", exc)
                        
            except WebSocketDisconnect:
                break
            except Exception as exc:
                logger.exception("Binary receive error")
    
    async def process_binary():
        """Process binary frames."""
        while True:
            try:
                if frame_buffer.is_empty():
                    await asyncio.sleep(0.005)  # 5ms for lower latency
                    continue
                
                frame_data = frame_buffer.get()
                if frame_data is None:
                    continue
                
                rgb = frame_data.get("rgb")
                lat = frame_data.get("lat")
                lon = frame_data.get("lon")
                ts = frame_data.get("ts")
                
                if rgb is None:
                    continue
                
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
                            ts=ts or datetime.now(timezone.utc),
                        )
                    )
                    db.commit()
                    
                    # Send compact binary response
                    response = {
                        "s": class_name,  # severity
                        "c": round(confidence, 3),  # confidence
                        "id": class_id,
                        "b": frame_buffer.size(),  # buffer size
                    }
                    
                    await websocket.send_json(response)
                    
                finally:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        
            except WebSocketDisconnect:
                break
            except Exception as exc:
                logger.exception("Binary processing error")
    
    try:
        await asyncio.gather(
            receive_binary(),
            process_binary()
        )
    except WebSocketDisconnect:
        logger.info("Binary stream WebSocket disconnected")
    finally:
        db.close()
