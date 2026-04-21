from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, desc, case
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.detection_history import DetectionHistory
from app.models.maintenance_schedules import MaintenanceSchedule
from app.models.municipal_road_segments import MunicipalRoadSegment
from app.models.severity_mix_history import SeverityMixHistory

router = APIRouter()


@router.get("/historical-trends")
def get_historical_trends(
    days: int = Query(30, ge=1, le=365),
    group_by: str = Query("daily", regex="^(daily|weekly|monthly)$")
):
    """
    Get historical pothole detection trends.
    
    Args:
        days: Number of days to look back (default: 30)
        group_by: Grouping period - 'daily', 'weekly', or 'monthly' (default: 'daily')
    
    Returns:
        List of trend data points with counts and percentages
    """
    db = SessionLocal()
    try:
        start_date = datetime.now() - timedelta(days=days)
        
        # Determine grouping based on time_window
        if group_by == "daily":
            date_trunc = func.date_trunc('day', DetectionHistory.timestamp)
        elif group_by == "weekly":
            date_trunc = func.date_trunc('week', DetectionHistory.timestamp)
        else:  # monthly
            date_trunc = func.date_trunc('month', DetectionHistory.timestamp)
        
        query = (
            db.query(
                date_trunc.label('period'),
                func.count(DetectionHistory.id).label('total_count'),
                func.sum(case((DetectionHistory.severity == 'severe', 1), else_=0)).label('severe_count'),
                func.sum(case((DetectionHistory.severity == 'minor', 1), else_=0)).label('minor_count'),
                func.sum(case((DetectionHistory.severity == 'no_pothole', 1), else_=0)).label('no_pothole_count'),
            )
            .filter(DetectionHistory.timestamp >= start_date)
            .group_by(date_trunc)
            .order_by(desc(date_trunc))
        )
        
        results = query.all()
        
        # Format results
        trends = []
        for row in results:
            total = row.total_count or 0
            if total > 0:
                trends.append({
                    "period": row.period.isoformat(),
                    "total_count": total,
                    "severe_count": row.severe_count or 0,
                    "minor_count": row.minor_count or 0,
                    "no_pothole_count": row.no_pothole_count or 0,
                    "severe_percentage": round((row.severe_count or 0) * 100.0 / total, 2),
                    "minor_percentage": round((row.minor_count or 0) * 100.0 / total, 2),
                    "no_pothole_percentage": round((row.no_pothole_count or 0) * 100.0 / total, 2),
                })
        
        return {"trends": trends, "group_by": group_by, "days": days}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/severity-mix")
def get_severity_mix(
    time_window: str = Query("hourly", regex="^(hourly|daily|weekly|monthly)$"),
    limit: int = Query(24, ge=1, le=100)
):
    """
    Get severity mix data over time.
    
    Args:
        time_window: Time window for aggregation - 'hourly', 'daily', 'weekly', or 'monthly'
        limit: Maximum number of data points to return
    
    Returns:
        List of severity mix data points
    """
    db = SessionLocal()
    try:
        query = (
            db.query(SeverityMixHistory)
            .filter(SeverityMixHistory.time_window == time_window)
            .order_by(desc(SeverityMixHistory.timestamp))
            .limit(limit)
        )
        
        results = query.all()
        
        mix_data = [
            {
                "timestamp": result.timestamp.isoformat(),
                "severe_count": result.severe_count,
                "minor_count": result.minor_count,
                "no_pothole_count": result.no_pothole_count,
                "total_count": result.total_count,
                "severe_percentage": result.severe_percentage,
                "minor_percentage": result.minor_percentage,
                "no_pothole_percentage": result.no_pothole_percentage,
            }
            for result in results
        ]
        
        return {"mix_data": mix_data, "time_window": time_window}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/location-density")
def get_location_density(
    days: int = Query(7, ge=1, le=90),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Get pothole density by location.
    
    Args:
        days: Number of days to look back
        limit: Maximum number of locations to return
    
    Returns:
        List of locations with detection counts
    """
    db = SessionLocal()
    try:
        start_date = datetime.now() - timedelta(days=days)
        
        query = (
            db.query(
                DetectionHistory.location,
                func.count(DetectionHistory.id).label('detection_count'),
                func.sum(case((DetectionHistory.severity == 'severe', 1), else_=0)).label('severe_count'),
                func.sum(case((DetectionHistory.severity == 'minor', 1), else_=0)).label('minor_count'),
                func.avg(DetectionHistory.confidence).label('avg_confidence'),
            )
            .filter(DetectionHistory.timestamp >= start_date)
            .group_by(DetectionHistory.location)
            .order_by(desc('detection_count'))
            .limit(limit)
        )
        
        results = query.all()
        
        density_data = [
            {
                "location": row.location,
                "detection_count": row.detection_count,
                "severe_count": row.severe_count or 0,
                "minor_count": row.minor_count or 0,
                "avg_confidence": round(float(row.avg_confidence or 0), 2),
            }
            for row in results
        ]
        
        return {"density_data": density_data, "days": days}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/maintenance-schedules")
def get_maintenance_schedules(
    status: Optional[str] = Query(None, regex="^(pending|in_progress|completed|cancelled)$"),
    priority: Optional[str] = Query(None, regex="^(low|medium|high|urgent)$"),
    limit: int = Query(50, ge=1, le=100)
):
    """
    Get maintenance schedules with filtering options.
    
    Args:
        status: Filter by status
        priority: Filter by priority
        limit: Maximum number of schedules to return
    
    Returns:
        List of maintenance schedules with road segment details
    """
    db = SessionLocal()
    try:
        query = (
            db.query(MaintenanceSchedule, MunicipalRoadSegment)
            .join(MunicipalRoadSegment, MaintenanceSchedule.road_segment_id == MunicipalRoadSegment.id)
        )
        
        if status:
            query = query.filter(MaintenanceSchedule.status == status)
        if priority:
            query = query.filter(MaintenanceSchedule.priority == priority)
        
        query = query.order_by(MaintenanceSchedule.scheduled_date.asc(), MaintenanceSchedule.priority.desc())
        query = query.limit(limit)
        
        results = query.all()
        
        schedules = []
        for schedule, road_segment in results:
            schedules.append({
                "id": schedule.id,
                "scheduled_date": schedule.scheduled_date.isoformat(),
                "priority": schedule.priority,
                "status": schedule.status,
                "estimated_duration_hours": schedule.estimated_duration_hours,
                "estimated_cost": schedule.estimated_cost,
                "assigned_team": schedule.assigned_team,
                "notes": schedule.notes,
                "completed_date": schedule.completed_date.isoformat() if schedule.completed_date else None,
                "road_segment": {
                    "id": road_segment.id,
                    "road_name": road_segment.road_name,
                    "segment_name": road_segment.segment_name,
                    "municipality": road_segment.municipality,
                    "ward": road_segment.ward,
                    "zone": road_segment.zone,
                    "road_type": road_segment.road_type,
                    "contact_email": road_segment.contact_email,
                    "contact_phone": road_segment.contact_phone,
                },
            })
        
        return {"schedules": schedules}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/municipal-roads")
def get_municipal_roads(
    municipality: Optional[str] = None,
    road_type: Optional[str] = Query(None, regex="^(arterial|collector|local|highway)$"),
    limit: int = Query(100, ge=1, le=500)
):
    """
    Get municipal road segments with filtering options.
    
    Args:
        municipality: Filter by municipality
        road_type: Filter by road type
        limit: Maximum number of roads to return
    
    Returns:
        List of municipal road segments
    """
    db = SessionLocal()
    try:
        query = db.query(MunicipalRoadSegment)
        
        if municipality:
            query = query.filter(MunicipalRoadSegment.municipality.ilike(f"%{municipality}%"))
        if road_type:
            query = query.filter(MunicipalRoadSegment.road_type == road_type)
        
        query = query.order_by(MunicipalRoadSegment.road_name.asc())
        query = query.limit(limit)
        
        results = query.all()
        
        roads = [
            {
                "id": road.id,
                "road_name": road.road_name,
                "segment_name": road.segment_name,
                "start_latitude": float(road.start_latitude),
                "start_longitude": float(road.start_longitude),
                "end_latitude": float(road.end_latitude),
                "end_longitude": float(road.end_longitude),
                "road_type": road.road_type,
                "length_km": float(road.length_km),
                "municipality": road.municipality,
                "ward": road.ward,
                "zone": road.zone,
                "responsible_department": road.responsible_department,
                "contact_email": road.contact_email,
                "contact_phone": road.contact_phone,
                "last_inspection_date": road.last_inspection_date.isoformat() if road.last_inspection_date else None,
                "last_maintenance_date": road.last_maintenance_date.isoformat() if road.last_maintenance_date else None,
            }
            for road in results
        ]
        
        return {"roads": roads}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/predictive-maintenance")
def get_predictive_maintenance(
    days_ahead: int = Query(30, ge=1, le=90),
    severity_threshold: int = Query(5, ge=1, le=10)
):
    """
    Get predictive maintenance suggestions based on severity trends.
    
    Args:
        days_ahead: Number of days ahead for predictions
        severity_threshold: Minimum severe potholes to trigger maintenance
    
    Returns:
        List of maintenance suggestions with priority scores
    """
    db = SessionLocal()
    try:
        # Get recent detection trends by location
        start_date = datetime.now() - timedelta(days=30)
        
        query = (
            db.query(
                DetectionHistory.location,
                func.count(DetectionHistory.id).label('total_count'),
                func.sum(case((DetectionHistory.severity == 'severe', 1), else_=0)).label('severe_count'),
                func.avg(DetectionHistory.confidence).label('avg_confidence'),
                func.max(DetectionHistory.timestamp).label('last_detection'),
            )
            .filter(DetectionHistory.timestamp >= start_date)
            .filter(DetectionHistory.latitude.isnot(None))
            .filter(DetectionHistory.longitude.isnot(None))
            .group_by(DetectionHistory.location)
            .order_by(desc('severe_count'))
        )
        
        results = query.all()
        
        suggestions = []
        for row in results:
            severe_count = row.severe_count or 0
            
            # Calculate priority score based on severity count and confidence
            priority_score = severe_count * 10 + (float(row.avg_confidence or 0) * 5)
            
            # Determine priority level
            if severe_count >= severity_threshold:
                if severe_count >= severity_threshold * 2:
                    priority = "urgent"
                elif severe_count >= severity_threshold * 1.5:
                    priority = "high"
                else:
                    priority = "medium"
            else:
                priority = "low"
            
            # Only include if meets threshold
            if severe_count >= severity_threshold:
                suggestions.append({
                    "location": row.location,
                    "total_detections": row.total_count,
                    "severe_count": severe_count,
                    "avg_confidence": round(float(row.avg_confidence or 0), 2),
                    "last_detection": row.last_detection.isoformat() if row.last_detection else None,
                    "priority_score": round(priority_score, 2),
                    "priority": priority,
                    "recommended_action": get_recommended_action(priority, severe_count),
                    "estimated_severity": "high" if severe_count >= severity_threshold * 2 else "medium",
                })
        
        # Sort by priority score
        suggestions.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return {"suggestions": suggestions, "days_ahead": days_ahead}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


def get_recommended_action(priority: str, severe_count: int) -> str:
    """Get recommended maintenance action based on priority and severity count."""
    if priority == "urgent":
        return "Immediate inspection and repair required"
    elif priority == "high":
        return "Schedule repair within 3-5 days"
    elif priority == "medium":
        return "Schedule inspection within 1 week"
    else:
        return "Monitor and include in next maintenance cycle"


@router.get("/real-time-analytics")
def get_real_time_analytics():
    """
    Get real-time analytics data for the dashboard.
    
    Returns:
        Current statistics and live data
    """
    db = SessionLocal()
    try:
        # Get today's statistics
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        today_stats = (
            db.query(
                func.count(DetectionHistory.id).label('total_detections'),
                func.sum(case((DetectionHistory.severity == 'severe', 1), else_=0)).label('severe_count'),
                func.sum(case((DetectionHistory.severity == 'minor', 1), else_=0)).label('minor_count'),
                func.sum(case((DetectionHistory.severity == 'no_pothole', 1), else_=0)).label('no_pothole_count'),
                func.avg(DetectionHistory.confidence).label('avg_confidence'),
            )
            .filter(DetectionHistory.timestamp >= today_start)
            .first()
        )
        
        # Get last 7 days trend
        week_ago = datetime.now() - timedelta(days=7)
        day_trunc = func.date_trunc('day', DetectionHistory.timestamp).label('day')
        weekly_trend = (
            db.query(
                day_trunc,
                func.count(DetectionHistory.id).label('count'),
            )
            .filter(DetectionHistory.timestamp >= week_ago)
            .group_by(day_trunc)
            .order_by(day_trunc)
            .all()
        )
        
        # Get top locations
        top_locations = (
            db.query(
                DetectionHistory.location,
                func.count(DetectionHistory.id).label('count'),
            )
            .filter(DetectionHistory.timestamp >= week_ago)
            .group_by(DetectionHistory.location)
            .order_by(desc('count'))
            .limit(5)
            .all()
        )
        
        # Get pending maintenance
        pending_maintenance = (
            db.query(MaintenanceSchedule)
            .filter(MaintenanceSchedule.status == 'pending')
            .order_by(MaintenanceSchedule.scheduled_date.asc())
            .limit(5)
            .all()
        )
        
        return {
            "today": {
                "total_detections": today_stats.total_detections or 0,
                "severe_count": today_stats.severe_count or 0,
                "minor_count": today_stats.minor_count or 0,
                "no_pothole_count": today_stats.no_pothole_count or 0,
                "avg_confidence": round(float(today_stats.avg_confidence or 0), 2),
            },
            "weekly_trend": [
                {
                    "day": row.day.isoformat(),
                    "count": row.count,
                }
                for row in weekly_trend
            ],
            "top_locations": [
                {
                    "location": row.location,
                    "count": row.count,
                }
                for row in top_locations
            ],
            "pending_maintenance": [
                {
                    "id": m.id,
                    "scheduled_date": m.scheduled_date.isoformat(),
                    "priority": m.priority,
                }
                for m in pending_maintenance
            ],
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
