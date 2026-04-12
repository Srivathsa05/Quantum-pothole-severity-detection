from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timezone
import csv
import io

from app.db.session import get_db
from app.models.pothole_log import PotholeLog
from app.core.config import get_settings, load_features

router = APIRouter()

settings = get_settings()


@router.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}


@router.get("/features")
def get_features():
    """Return features configuration."""
    return load_features(settings.features_file)


@router.get("/heatmap")
def heatmap(
    bbox: str = Query(..., description="bbox=minLng,minLat,maxLng,maxLat"),
    zoom: int = Query(..., ge=0, le=20),
    db: Session = Depends(get_db),
):
    """Return GeoJSON FeatureCollection for 0.001° grid cells."""
    try:
        parts = bbox.split(",")
        min_lng, min_lat, max_lng, max_lat = map(float, parts)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid bbox format")

    # Use 0.001° grid (1 meter approx)
    grid_size = 0.001

    # Query aggregations
    query = db.query(
        func.round(PotholeLog.lon / grid_size) * grid_size,
        func.round(PotholeLog.lat / grid_size) * grid_size,
        func.count(case((PotholeLog.class_id == 0, 1))).label("count_no"),
        func.count(case((PotholeLog.class_id == 1, 1))).label("count_minor"),
        func.count(case((PotholeLog.class_id == 2, 1))).label("count_severe"),
        func.count().label("total"),
    ).filter(
        PotholeLog.lon >= min_lng,
        PotholeLog.lon <= max_lng,
        PotholeLog.lat >= min_lat,
        PotholeLog.lat <= max_lat,
    ).group_by(
        func.round(PotholeLog.lon / grid_size) * grid_size,
        func.round(PotholeLog.lat / grid_size) * grid_size,
    ).all()

    features = []
    for row in query:
        lon, lat, count_no, count_minor, count_severe, total = row
        # Use 0,0 if NULL (as per user request)
        if lon is None:
            lon = 0.0
        if lat is None:
            lat = 0.0

        # Dominant severity
        counts = {"no": count_no, "minor": count_minor, "severe": count_severe}
        dominant = max(counts, key=counts.get) if total > 0 else "no"

        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [lon, lat],
                    [lon + grid_size, lat],
                    [lon + grid_size, lat + grid_size],
                    [lon, lat + grid_size],
                    [lon, lat],
                ]]
            },
            "properties": {
                "count_no": count_no,
                "count_minor": count_minor,
                "count_severe": count_severe,
                "total": total,
                "dominant": dominant,
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features,
    }


@router.get("/export")
def export(
    start: str = Query(..., description="ISO8601 start timestamp"),
    end: str = Query(..., description="ISO8601 end timestamp"),
    db: Session = Depends(get_db),
):
    """Stream CSV export."""
    try:
        start_dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid timestamp format")

    logs = db.query(PotholeLog).filter(
        PotholeLog.ts >= start_dt,
        PotholeLog.ts <= end_dt,
    ).all()

    def generate():
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["timestamp", "lat", "lon", "severity", "confidence"])

        class_map = {0: "no_pothole", 1: "minor", 2: "severe"}
        for log in logs:
            lat = log.lat if log.lat is not None else 0.0
            lon = log.lon if log.lon is not None else 0.0
            writer.writerow([
                log.ts.isoformat().replace("+00:00", "Z"),
                lat,
                lon,
                class_map.get(log.class_id, "minor"),
                log.confidence,
            ])
            output.seek(0)
            yield output.read()
            output.seek(0)
            output.truncate(0)

    return StreamingResponse(
        generate(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=pothole_export.csv"}
    )
