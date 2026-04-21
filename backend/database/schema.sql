-- Pothole Detection System Database Schema
-- PostgreSQL Schema

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS maintenance_schedules CASCADE;
DROP TABLE IF EXISTS municipal_road_segments CASCADE;
DROP TABLE IF EXISTS detection_history CASCADE;
DROP TABLE IF EXISTS severity_mix_history CASCADE;

-- Detection History Table
-- Stores all pothole detections with location and severity information
CREATE TABLE detection_history (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL, -- 'no_pothole', 'minor', 'severe'
    confidence DECIMAL(5,2) NOT NULL, -- 0.00 to 1.00
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    detection_type VARCHAR(50) NOT NULL, -- 'live', 'uploaded', 'batch'
    camera_id INTEGER,
    all_probabilities JSONB, -- Stores all class probabilities
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_detection_history_timestamp ON detection_history(timestamp DESC);
CREATE INDEX idx_detection_history_severity ON detection_history(severity);
CREATE INDEX idx_detection_history_location ON detection_history(location);
CREATE INDEX idx_detection_history_lat_lon ON detection_history(latitude, longitude);
CREATE INDEX idx_detection_history_type ON detection_history(detection_type);

-- Severity Mix History Table
-- Stores aggregated severity mix data over time for trend analysis
CREATE TABLE severity_mix_history (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    severe_count INTEGER NOT NULL DEFAULT 0,
    minor_count INTEGER NOT NULL DEFAULT 0,
    no_pothole_count INTEGER NOT NULL DEFAULT 0,
    total_count INTEGER NOT NULL DEFAULT 0,
    severe_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    minor_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    no_pothole_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    time_window VARCHAR(50) NOT NULL, -- 'hourly', 'daily', 'weekly', 'monthly'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_severity_mix_history_timestamp ON severity_mix_history(timestamp DESC);
CREATE INDEX idx_severity_mix_history_window ON severity_mix_history(time_window);

-- Municipal Road Segments Table
-- Static data for municipal road management integration
CREATE TABLE municipal_road_segments (
    id SERIAL PRIMARY KEY,
    road_name VARCHAR(255) NOT NULL,
    segment_name VARCHAR(255) NOT NULL,
    start_latitude DECIMAL(10, 8) NOT NULL,
    start_longitude DECIMAL(11, 8) NOT NULL,
    end_latitude DECIMAL(10, 8) NOT NULL,
    end_longitude DECIMAL(11, 8) NOT NULL,
    road_type VARCHAR(50) NOT NULL, -- 'arterial', 'collector', 'local', 'highway'
    length_km DECIMAL(10, 2) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    zone VARCHAR(100),
    responsible_department VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    last_inspection_date TIMESTAMP WITH TIME ZONE,
    last_maintenance_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_municipal_road_segments_name ON municipal_road_segments(road_name);
CREATE INDEX idx_municipal_road_segments_municipality ON municipal_road_segments(municipality);
CREATE INDEX idx_municipal_road_segments_type ON municipal_road_segments(road_type);

-- Maintenance Schedules Table
-- Stores scheduled maintenance based on severity trends
CREATE TABLE maintenance_schedules (
    id SERIAL PRIMARY KEY,
    road_segment_id INTEGER REFERENCES municipal_road_segments(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    priority VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    estimated_duration_hours DECIMAL(5, 2),
    estimated_cost DECIMAL(10, 2),
    assigned_team VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_maintenance_schedules_date ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_maintenance_schedules_status ON maintenance_schedules(status);
CREATE INDEX idx_maintenance_schedules_priority ON maintenance_schedules(priority);
CREATE INDEX idx_maintenance_schedules_segment ON maintenance_schedules(road_segment_id);

-- Insert sample municipal road data (Bengaluru)
INSERT INTO municipal_road_segments (road_name, segment_name, start_latitude, start_longitude, end_latitude, end_longitude, road_type, length_km, municipality, ward, zone, responsible_department, contact_email, contact_phone) VALUES
('MG Road', 'Main Junction', 12.9755, 77.6065, 12.9790, 77.6100, 'arterial', 0.5, 'Bengaluru', 'Shivajinagar', 'Central', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Koramangala 80ft Road', '5th Block', 12.9352, 77.6245, 12.9380, 77.6280, 'collector', 0.4, 'Bengaluru', 'Koramangala', 'South', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Whitefield Main Road', 'ITPL Junction', 12.9698, 77.7499, 12.9730, 77.7530, 'arterial', 0.6, 'Bengaluru', 'Whitefield', 'East', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Hebbal Flyover', 'Airport Road', 13.0352, 77.5970, 13.0380, 77.6000, 'highway', 0.5, 'Bengaluru', 'Hebbal', 'North', 'NHAI', 'hebbal@nhai.gov.in', '+91-80-22334455'),
('Indiranagar 100ft Road', 'Domlur', 12.9719, 77.6412, 12.9750, 77.6450, 'arterial', 0.5, 'Bengaluru', 'Indiranagar', 'East', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('HSR Layout Sector 2', '27th Main', 12.9116, 77.6474, 12.9150, 77.6510, 'local', 0.4, 'Bengaluru', 'HSR Layout', 'South', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('BTM Layout', 'Silk Board', 12.9166, 77.6101, 12.9200, 77.6140, 'collector', 0.5, 'Bengaluru', 'BTM Layout', 'South', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Electronic City', 'Hosur Road', 12.8458, 77.6654, 12.8490, 77.6690, 'highway', 0.6, 'Bengaluru', 'Electronic City', 'South', 'NHAI', 'electronic@nhai.gov.in', '+91-80-22334455'),
('Yelahanka', 'Doddaballapur Road', 13.1007, 77.5963, 13.1040, 77.6000, 'arterial', 0.5, 'Bengaluru', 'Yelahanka', 'North', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Banashankari', 'Kanakapura Road', 12.9181, 77.5734, 12.9210, 77.5770, 'arterial', 0.4, 'Bengaluru', 'Banashankari', 'South', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Marathahalli', 'Outer Ring Road', 12.9591, 77.6974, 12.9620, 77.7010, 'arterial', 0.5, 'Bengaluru', 'Marathahalli', 'East', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Bellandur', 'Outer Ring Road', 12.9279, 77.6762, 12.9310, 77.6800, 'arterial', 0.5, 'Bengaluru', 'Bellandur', 'East', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Rajajinagar', 'West of Chord Road', 12.9915, 77.5536, 12.9950, 77.5570, 'collector', 0.5, 'Bengaluru', 'Rajajinagar', 'West', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('KR Puram', 'Old Madras Road', 13.0087, 77.6959, 13.0120, 77.6990, 'arterial', 0.5, 'Bengaluru', 'KR Puram', 'East', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111'),
('Jayanagar', '4th Block Main', 12.9250, 77.5938, 12.9280, 77.5970, 'local', 0.4, 'Bengaluru', 'Jayanagar', 'South', 'BBMP Road Maintenance', 'roads@bbmp.gov.in', '+91-80-22221111');

-- Create views for common queries

-- View: Daily severity mix summary
CREATE OR REPLACE VIEW daily_severity_mix AS
SELECT
    DATE(timestamp) as date,
    COUNT(*) as total_detections,
    SUM(CASE WHEN severity = 'severe' THEN 1 ELSE 0 END) as severe_count,
    SUM(CASE WHEN severity = 'minor' THEN 1 ELSE 0 END) as minor_count,
    SUM(CASE WHEN severity = 'no_pothole' THEN 1 ELSE 0 END) as no_pothole_count,
    ROUND(SUM(CASE WHEN severity = 'severe' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as severe_percentage,
    ROUND(SUM(CASE WHEN severity = 'minor' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as minor_percentage,
    ROUND(SUM(CASE WHEN severity = 'no_pothole' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as no_pothole_percentage
FROM detection_history
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- View: Weekly pothole density by location
CREATE OR REPLACE VIEW weekly_pothole_density AS
SELECT
    location,
    DATE_TRUNC('week', timestamp) as week_start,
    COUNT(*) as detection_count,
    SUM(CASE WHEN severity = 'severe' THEN 1 ELSE 0 END) as severe_count,
    SUM(CASE WHEN severity = 'minor' THEN 1 ELSE 0 END) as minor_count,
    AVG(confidence) as avg_confidence
FROM detection_history
WHERE timestamp >= NOW() - INTERVAL '8 weeks'
GROUP BY location, DATE_TRUNC('week', timestamp)
ORDER BY week_start DESC, detection_count DESC;

-- View: Maintenance priority summary
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

-- Create trigger functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_detection_history_updated_at BEFORE UPDATE ON detection_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_municipal_road_segments_updated_at BEFORE UPDATE ON municipal_road_segments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON maintenance_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
