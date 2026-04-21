# Schema SQL Fix - April 18, 2026

## Issue
When executing `schema.sql` in pgAdmin4, you got this error:

```
ERROR:  column "road_segment_id" does not exist
There is a column named "road_segment_id" in table "ms", but it cannot be referenced from this part of the query.
Hint: To reference that column, you must mark this subquery with LATERAL.
```

## Root Cause
The `maintenance_priority_summary` view was trying to join `detection_history` table with `road_segment_id`, but the `detection_history` table doesn't have a `road_segment_id` column. It only has `latitude` and `longitude` columns for location data.

## Fix Applied
Updated the `maintenance_priority_summary` view in `schema.sql` to:
- Remove the problematic LEFT JOIN with detection_history
- Simplify the view to show maintenance schedules with road segment information
- Remove detection count fields that required the problematic join

## What Changed

### Before (Buggy):
```sql
CREATE OR REPLACE VIEW maintenance_priority_summary AS
SELECT
    ms.id,
    ms.scheduled_date,
    ms.priority,
    ms.status,
    mrs.road_name,
    mrs.segment_name,
    mrs.municipality,
    mrs.ward,
    mrs.zone,
    mrs.contact_email,
    mrs.contact_phone,
    dh.detection_count,      -- This caused the error
    dh.severe_count,          -- This caused the error
    dh.minor_count            -- This caused the error
FROM maintenance_schedules ms
JOIN municipal_road_segments mrs ON ms.road_segment_id = mrs.id
LEFT JOIN (
    SELECT
        road_segment_id,      -- This column doesn't exist in detection_history
        COUNT(*) as detection_count,
        SUM(CASE WHEN severity = 'severe' THEN 1 ELSE 0 END) as severe_count,
        SUM(CASE WHEN severity = 'minor' THEN 1 ELSE 0 END) as minor_count
    FROM detection_history
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY road_segment_id
) dh ON mrs.id = dh.road_segment_id
ORDER BY ms.scheduled_date ASC, ms.priority DESC;
```

### After (Fixed):
```sql
CREATE OR REPLACE VIEW maintenance_priority_summary AS
SELECT
    ms.id,
    ms.scheduled_date,
    ms.priority,
    ms.status,
    mrs.road_name,
    mrs.segment_name,
    mrs.municipality,
    mrs.ward,
    mrs.zone,
    mrs.contact_email,
    mrs.contact_phone,
    ms.estimated_duration_hours,
    ms.estimated_cost,
    ms.assigned_team,
    ms.notes,
    ms.created_at,
    ms.updated_at,
    ms.completed_date
FROM maintenance_schedules ms
JOIN municipal_road_segments mrs ON ms.road_segment_id = mrs.id
ORDER BY ms.scheduled_date ASC, ms.priority DESC;
```

## How to Apply the Fix

### Option 1: Execute the Updated Schema
1. Open pgAdmin4 Query Tool
2. Open the updated `schema.sql` file
3. Execute the entire file (F5 or click the play button)

### Option 2: Drop and Recreate the View
If you already executed the schema and got the error:

```sql
-- Drop the problematic view
DROP VIEW IF EXISTS maintenance_priority_summary;

-- Recreate the fixed view
CREATE OR REPLACE VIEW maintenance_priority_summary AS
SELECT
    ms.id,
    ms.scheduled_date,
    ms.priority,
    ms.status,
    mrs.road_name,
    mrs.segment_name,
    mrs.municipality,
    mrs.ward,
    mrs.zone,
    mrs.contact_email,
    mrs.contact_phone,
    ms.estimated_duration_hours,
    ms.estimated_cost,
    ms.assigned_team,
    ms.notes,
    ms.created_at,
    ms.updated_at,
    ms.completed_date
FROM maintenance_schedules ms
JOIN municipal_road_segments mrs ON ms.road_segment_id = mrs.id
ORDER BY ms.scheduled_date ASC, ms.priority DESC;
```

### Option 3: Start Fresh
If you want to start completely fresh:

```sql
-- Drop all tables and views
DROP TABLE IF EXISTS maintenance_schedules CASCADE;
DROP TABLE IF EXISTS municipal_road_segments CASCADE;
DROP TABLE IF EXISTS detection_history CASCADE;
DROP TABLE IF EXISTS severity_mix_history CASCADE;
DROP VIEW IF EXISTS daily_severity_mix CASCADE;
DROP VIEW IF EXISTS weekly_pothole_density CASCADE;
DROP VIEW IF EXISTS maintenance_priority_summary CASCADE;

-- Then execute the full schema.sql file
```

## What the View Does Now

The `maintenance_priority_summary` view now shows:
- All maintenance schedules
- Associated road segment information (name, municipality, zone, etc.)
- Contact information for each road segment
- Schedule details (priority, status, estimated duration, cost, etc.)

## Future Enhancement

If you want to correlate detections with road segments in the future, you would need:

1. **Add geospatial queries** to match detection coordinates to road segments
2. **Or add a road_segment_id column** to detection_history (requires manual mapping)

Example geospatial approach:
```sql
-- This would require PostGIS extension
SELECT
    ms.*,
    COUNT(dh.id) as detection_count
FROM maintenance_schedules ms
JOIN municipal_road_segments mrs ON ms.road_segment_id = mrs.id
LEFT JOIN detection_history dh ON
    ST_Contains(
        ST_MakeLine(
            ST_Point(mrs.start_longitude, mrs.start_latitude),
            ST_Point(mrs.end_longitude, mrs.end_latitude)
        ),
        ST_Point(dh.longitude, dh.latitude)
    )
GROUP BY ms.id
```

## Verification

After applying the fix, verify the view works:

```sql
-- Test the view
SELECT * FROM maintenance_priority_summary LIMIT 5;

-- Check if view exists
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public' AND table_name = 'maintenance_priority_summary';
```

## Impact on Application

This fix has **minimal impact** on the application:
- The analytics API endpoint `/api/analytics/maintenance-schedules` still works
- It will return maintenance schedules with road segment information
- It just won't include detection counts (which weren't working anyway)

## Summary

The schema.sql file has been fixed. You can now execute it without errors. The `maintenance_priority_summary` view is simplified but still functional for displaying maintenance schedules with road segment information.
