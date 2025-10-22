-- Mission St. Louis Dashboard - Production Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Sites/Schools
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  coordinator_name TEXT,
  coordinator_phone TEXT,
  coordinator_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  grade INTEGER CHECK (grade >= 1 AND grade <= 12),

  -- Metrics
  risk_score DECIMAL(3, 2) CHECK (risk_score >= 0 AND risk_score <= 1),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  attendance_rate DECIMAL(5, 2) CHECK (attendance_rate >= 0 AND attendance_rate <= 100),
  homework_completion_rate DECIMAL(5, 2) CHECK (homework_completion_rate >= 0 AND homework_completion_rate <= 100),
  reading_level DECIMAL(4, 2),
  math_level DECIMAL(4, 2),
  behavioral_incidents INTEGER DEFAULT 0,
  mentor_engagement_score DECIMAL(3, 2) CHECK (mentor_engagement_score >= 0 AND mentor_engagement_score <= 5),

  -- Support info
  strengths TEXT[],
  concerns TEXT[],
  recommended_actions TEXT[],
  notes TEXT,
  last_contact_date DATE,

  -- Metadata
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_students_site_id ON students(site_id);
CREATE INDEX idx_students_priority ON students(priority);
CREATE INDEX idx_students_active ON students(active);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW dashboard_summary AS
SELECT
  s.id,
  s.site_code,
  s.name,
  s.address,
  s.latitude,
  s.longitude,
  s.coordinator_name,
  s.coordinator_phone,
  COUNT(st.id)::INTEGER as total_students,
  COUNT(st.id) FILTER (WHERE st.priority IN ('high', 'medium'))::INTEGER as students_receiving_support,
  COUNT(st.id) FILTER (WHERE st.priority = 'high')::INTEGER as high_priority_count,
  COUNT(st.id) FILTER (WHERE st.priority = 'medium')::INTEGER as medium_priority_count,
  COUNT(st.id) FILTER (WHERE st.priority = 'low')::INTEGER as low_priority_count,
  ROUND(AVG(st.attendance_rate), 2) as avg_attendance,
  ROUND(AVG(st.mentor_engagement_score), 2) as avg_engagement
FROM sites s
LEFT JOIN students st ON s.id = st.site_id AND st.active = TRUE
GROUP BY s.id, s.site_code, s.name, s.address, s.latitude, s.longitude,
         s.coordinator_name, s.coordinator_phone;

-- ============================================
-- ROW LEVEL SECURITY (IMPORTANT!)
-- ============================================

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can view sites" ON sites
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify sites" ON sites
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view students" ON students
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify students" ON students
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

INSERT INTO sites (site_code, name, address, latitude, longitude, coordinator_name, coordinator_phone, coordinator_email) VALUES
('kairos', 'Kairos Academies', '2315 Miami St, St. Louis, MO 63118', 38.5767, -90.2289, 'Maria Chen', '(314) 252-0602', 'mchen@kairosacademies.org'),
('lafayette', 'Lafayette Preparatory Academy', '5630 Minerva Ave, St. Louis, MO 63112', 38.6143, -90.2134, 'James Wilson', '(314) 534-5959', 'jwilson@lafayetteprep.org'),
('sllis', 'St. Louis Language Immersion', '4011 Papin St, St. Louis, MO 63108', 38.6331, -90.2156, 'Sarah Rodriguez', '(314) 773-0555', 'srodriguez@sllis.org'),
('biome', 'Biome School', '1500 Union Blvd, St. Louis, MO 63113', 38.6089, -90.2445, 'Michael Thompson', '(314) 531-0086', 'mthompson@biomeschool.org');

-- Sample students (you can delete these later)
INSERT INTO students (student_id, first_name, last_name, site_id, grade, risk_score, priority, attendance_rate, homework_completion_rate, reading_level, math_level, behavioral_incidents, mentor_engagement_score, strengths, concerns, recommended_actions, notes, last_contact_date)
SELECT
  'STU0001', 'Jordan', 'Smith', id, 7, 0.75, 'high', 72, 65, 5.2, 5.8, 3, 2.5,
  ARRAY['Creative writing', 'Art'],
  ARRAY['Attendance', 'Math support needed'],
  ARRAY['Weekly check-ins', 'Math tutoring'],
  'Talented artist, needs consistent support',
  CURRENT_DATE - INTERVAL '5 days'
FROM sites WHERE site_code = 'kairos'
UNION ALL
SELECT
  'STU0002', 'Taylor', 'Johnson', id, 8, 0.45, 'medium', 88, 82, 7.1, 6.9, 1, 3.8,
  ARRAY['Leadership', 'Sports'],
  ARRAY['Reading fluency'],
  ARRAY['Reading intervention'],
  'Strong student, minor reading gaps',
  CURRENT_DATE - INTERVAL '2 days'
FROM sites WHERE site_code = 'lafayette';
