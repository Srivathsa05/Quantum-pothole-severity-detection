from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.models.detection_history import DetectionHistory
from app.models.severity_mix_history import SeverityMixHistory


def save_detection_to_db(
    db: Session,
    location: str,
    severity: str,
    confidence: float,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    detection_type: str = "uploaded",
    camera_id: Optional[int] = None,
    all_probabilities: Optional[dict] = None,
):
    """
    Save a detection to the database.

    Args:
        db: Database session
        location: Location name or description
        severity: Severity level ('no_pothole', 'minor', 'severe')
        confidence: Confidence score (0.0 to 1.0)
        latitude: Latitude coordinate (optional)
        longitude: Longitude coordinate (optional)
        detection_type: Type of detection ('live', 'uploaded', 'batch')
        camera_id: Camera ID for live detections (optional)
        all_probabilities: All class probabilities (optional)
    """
    try:
        now = datetime.now(timezone.utc)

        # Save to detection_history table
        detection = DetectionHistory(
            location=location,
            severity=severity,
            confidence=confidence,
            latitude=latitude,
            longitude=longitude,
            timestamp=now,
            detection_type=detection_type,
            camera_id=camera_id,
            all_probabilities=all_probabilities,
            created_at=now,
            updated_at=now,
        )
        db.add(detection)
        db.commit()

        return detection.id
    except Exception as e:
        db.rollback()
        raise e


def update_severity_mix(db: Session, severity: str, time_window: str = "hourly"):
    """
    Update severity mix history for trend analysis.

    Args:
        db: Database session
        severity: Severity level ('no_pothole', 'minor', 'severe')
        time_window: Time window ('hourly', 'daily', 'weekly', 'monthly')
    """
    try:
        now = datetime.now(timezone.utc)

        # Get or create the current time window record
        if time_window == "hourly":
            window_start = now.replace(minute=0, second=0, microsecond=0)
        elif time_window == "daily":
            window_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif time_window == "weekly":
            # Start of week (Monday)
            window_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            window_start = window_start - timedelta(days=window_start.weekday())
        else:  # monthly
            window_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Find existing record for this time window
        existing = (
            db.query(SeverityMixHistory)
            .filter(
                SeverityMixHistory.timestamp >= window_start,
                SeverityMixHistory.timestamp < window_start + timedelta(hours=1),
                SeverityMixHistory.time_window == time_window,
            )
            .first()
        )

        if existing:
            # Update existing record
            if severity == "severe":
                existing.severe_count += 1
            elif severity == "minor":
                existing.minor_count += 1
            else:
                existing.no_pothole_count += 1

            existing.total_count += 1
            existing.severe_percentage = round(
                (existing.severe_count / existing.total_count) * 100, 2
            )
            existing.minor_percentage = round(
                (existing.minor_count / existing.total_count) * 100, 2
            )
            existing.no_pothole_percentage = round(
                (existing.no_pothole_count / existing.total_count) * 100, 2
            )
        else:
            # Create new record
            severe_count = 1 if severity == "severe" else 0
            minor_count = 1 if severity == "minor" else 0
            no_pothole_count = 1 if severity == "no_pothole" else 0
            total_count = 1

            new_mix = SeverityMixHistory(
                timestamp=now,
                severe_count=severe_count,
                minor_count=minor_count,
                no_pothole_count=no_pothole_count,
                total_count=total_count,
                severe_percentage=round((severe_count / total_count) * 100, 2),
                minor_percentage=round((minor_count / total_count) * 100, 2),
                no_pothole_percentage=round((no_pothole_count / total_count) * 100, 2),
                time_window=time_window,
                created_at=now,
            )
            db.add(new_mix)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e


def save_detection_with_mix(
    db: Session,
    location: str,
    severity: str,
    confidence: float,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    detection_type: str = "uploaded",
    camera_id: Optional[int] = None,
    all_probabilities: Optional[dict] = None,
):
    """
    Save a detection and update severity mix in one transaction.

    Args:
        db: Database session
        location: Location name or description
        severity: Severity level ('no_pothole', 'minor', 'severe')
        confidence: Confidence score (0.0 to 1.0)
        latitude: Latitude coordinate (optional)
        longitude: Longitude coordinate (optional)
        detection_type: Type of detection ('live', 'uploaded', 'batch')
        camera_id: Camera ID for live detections (optional)
        all_probabilities: All class probabilities (optional)
    """
    try:
        # Save detection
        detection_id = save_detection_to_db(
            db=db,
            location=location,
            severity=severity,
            confidence=confidence,
            latitude=latitude,
            longitude=longitude,
            detection_type=detection_type,
            camera_id=camera_id,
            all_probabilities=all_probabilities,
        )

        # Update severity mix
        update_severity_mix(db, severity, time_window="hourly")

        return detection_id
    except Exception as e:
        db.rollback()
        raise e
