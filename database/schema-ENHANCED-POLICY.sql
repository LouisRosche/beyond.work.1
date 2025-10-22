-- =====================================================
-- ENHANCED SCHEMA FOR EDUCATIONAL POLICY DECISION MAKING
-- Mission St. Louis - Comprehensive Analytics Platform
-- =====================================================

-- This builds on the existing schema.sql
-- Run this AFTER the base schema.sql

-- =====================================================
-- DEMOGRAPHIC & SOCIOECONOMIC DATA
-- =====================================================

-- Student Demographics Table
CREATE TABLE IF NOT EXISTS student_demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,

  -- Demographics
  race_ethnicity TEXT CHECK (race_ethnicity IN (
    'African American', 'Hispanic/Latino', 'White', 'Asian',
    'Native American', 'Pacific Islander', 'Two or More Races', 'Other'
  )),
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Non-binary', 'Prefer not to say')),
  birth_date DATE,

  -- Socioeconomic Indicators
  free_reduced_lunch BOOLEAN DEFAULT FALSE,
  homeless_status BOOLEAN DEFAULT FALSE,
  foster_care BOOLEAN DEFAULT FALSE,
  migrant_status BOOLEAN DEFAULT FALSE,

  -- Language & Learning Needs
  english_language_learner BOOLEAN DEFAULT FALSE,
  primary_language TEXT,
  special_education BOOLEAN DEFAULT FALSE,
  iep_active BOOLEAN DEFAULT FALSE,
  section_504 BOOLEAN DEFAULT FALSE,
  gifted_talented BOOLEAN DEFAULT FALSE,

  -- Geographic
  zip_code TEXT,
  neighborhood TEXT,
  district TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_demographics_student_id ON student_demographics(student_id);
CREATE INDEX idx_student_demographics_zip ON student_demographics(zip_code);
CREATE INDEX idx_student_demographics_neighborhood ON student_demographics(neighborhood);

-- =====================================================
-- ACADEMIC PERFORMANCE TRACKING
-- =====================================================

-- Standardized Test Scores
CREATE TABLE IF NOT EXISTS test_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,

  -- Test Information
  test_type TEXT CHECK (test_type IN ('MAP', 'SAT', 'ACT', 'State Assessment', 'Other')),
  subject TEXT CHECK (subject IN ('Math', 'Reading', 'Science', 'English', 'Writing', 'Social Studies')),
  test_date DATE NOT NULL,
  school_year TEXT, -- e.g., "2024-2025"

  -- Scores
  raw_score DECIMAL(10, 2),
  scaled_score DECIMAL(10, 2),
  percentile DECIMAL(5, 2) CHECK (percentile >= 0 AND percentile <= 100),
  proficiency_level TEXT CHECK (proficiency_level IN ('Below Basic', 'Basic', 'Proficient', 'Advanced')),

  -- Growth Metrics
  growth_percentile DECIMAL(5, 2),
  met_growth_target BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_test_scores_student ON test_scores(student_id);
CREATE INDEX idx_test_scores_date ON test_scores(test_date);
CREATE INDEX idx_test_scores_type ON test_scores(test_type);

-- Academic Milestones
CREATE TABLE IF NOT EXISTS academic_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,

  milestone_type TEXT CHECK (milestone_type IN (
    'Grade Promotion', 'Honor Roll', 'Perfect Attendance',
    'Reading Level Advancement', 'Math Proficiency', 'Graduation',
    'College Acceptance', 'Scholarship Award', 'Other'
  )),
  milestone_date DATE NOT NULL,
  description TEXT,
  recognition_given BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SCHOOL & DISTRICT METRICS
-- =====================================================

-- Enhanced Site Metrics (extends existing sites table)
CREATE TABLE IF NOT EXISTS site_metrics_detailed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  school_year TEXT NOT NULL,

  -- Staffing
  total_teachers INTEGER,
  certified_teachers INTEGER,
  teacher_student_ratio DECIMAL(5, 2),
  teacher_turnover_rate DECIMAL(5, 2),
  average_teacher_experience DECIMAL(5, 2), -- years

  -- Financial
  per_pupil_spending DECIMAL(10, 2),
  title_i_funding DECIMAL(12, 2),
  state_funding DECIMAL(12, 2),
  federal_funding DECIMAL(12, 2),
  local_funding DECIMAL(12, 2),

  -- Facilities & Resources
  technology_devices_per_student DECIMAL(5, 2),
  library_books_per_student DECIMAL(5, 2),
  facility_quality_score DECIMAL(3, 2) CHECK (facility_quality_score >= 0 AND facility_quality_score <= 5),

  -- Performance
  overall_graduation_rate DECIMAL(5, 2),
  college_readiness_rate DECIMAL(5, 2),
  chronic_absenteeism_rate DECIMAL(5, 2),
  suspension_rate DECIMAL(5, 2),

  -- Programs
  extracurricular_programs TEXT[], -- Array of program names
  sports_offered TEXT[],
  ap_courses_offered INTEGER,
  dual_credit_available BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_site_metrics_site ON site_metrics_detailed(site_id);
CREATE INDEX idx_site_metrics_year ON site_metrics_detailed(school_year);

-- =====================================================
-- POLICY INTERVENTIONS & PROGRAMS
-- =====================================================

-- Intervention Programs
CREATE TABLE IF NOT EXISTS intervention_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  program_name TEXT NOT NULL,
  program_type TEXT CHECK (program_type IN (
    'Academic Support', 'Mentoring', 'Social-Emotional Learning',
    'Family Engagement', 'Health & Wellness', 'Career Readiness',
    'Arts & Enrichment', 'STEM', 'Literacy', 'Other'
  )),
  description TEXT,

  -- Implementation
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Scope
  target_population TEXT, -- e.g., "9th graders", "ELL students"
  sites_implemented UUID[], -- Array of site IDs

  -- Funding
  funding_source TEXT,
  annual_budget DECIMAL(12, 2),
  cost_per_student DECIMAL(10, 2),

  -- Staffing
  staff_allocated INTEGER,
  volunteer_hours_per_week DECIMAL(6, 2),

  -- Goals
  goals_objectives TEXT,
  success_metrics TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Participation in Programs
CREATE TABLE IF NOT EXISTS student_program_participation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  program_id UUID REFERENCES intervention_programs(id) ON DELETE CASCADE,

  enrollment_date DATE NOT NULL,
  completion_date DATE,
  status TEXT CHECK (status IN ('Active', 'Completed', 'Withdrawn', 'On Hold')),

  -- Attendance
  sessions_attended INTEGER DEFAULT 0,
  sessions_total INTEGER,
  attendance_rate DECIMAL(5, 2),

  -- Outcomes
  pre_assessment_score DECIMAL(5, 2),
  post_assessment_score DECIMAL(5, 2),
  improvement_percentage DECIMAL(5, 2),
  goals_met BOOLEAN,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_program_participation_student ON student_program_participation(student_id);
CREATE INDEX idx_program_participation_program ON student_program_participation(program_id);

-- =====================================================
-- COMMUNITY CONTEXT DATA
-- =====================================================

-- Neighborhood/Zip Code Statistics
CREATE TABLE IF NOT EXISTS community_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Geographic Identifiers
  zip_code TEXT,
  neighborhood TEXT,
  census_tract TEXT,

  -- Socioeconomic
  median_household_income DECIMAL(12, 2),
  poverty_rate DECIMAL(5, 2),
  unemployment_rate DECIMAL(5, 2),

  -- Housing
  homeownership_rate DECIMAL(5, 2),
  median_home_value DECIMAL(12, 2),
  housing_instability_index DECIMAL(5, 2),

  -- Health
  food_desert BOOLEAN DEFAULT FALSE,
  health_facility_access_score DECIMAL(3, 2),

  -- Safety
  crime_rate_per_1000 DECIMAL(6, 2),
  violent_crime_rate DECIMAL(6, 2),

  -- Resources
  library_access BOOLEAN DEFAULT FALSE,
  park_access BOOLEAN DEFAULT FALSE,
  public_transit_access BOOLEAN DEFAULT FALSE,
  internet_access_rate DECIMAL(5, 2),

  -- Education Context
  adult_education_level TEXT, -- e.g., "Bachelor's degree or higher: 35%"

  data_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_zip ON community_metrics(zip_code);
CREATE INDEX idx_community_neighborhood ON community_metrics(neighborhood);

-- =====================================================
-- POLICY OUTCOMES & ANALYTICS
-- =====================================================

-- Key Performance Indicators (KPIs) by Time Period
CREATE TABLE IF NOT EXISTS policy_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Time Period
  school_year TEXT NOT NULL,
  reporting_period TEXT CHECK (reporting_period IN ('Q1', 'Q2', 'Q3', 'Q4', 'Annual')),

  -- District/Site Level
  site_id UUID REFERENCES sites(id),
  district_wide BOOLEAN DEFAULT FALSE,

  -- Academic KPIs
  average_test_scores DECIMAL(5, 2),
  proficiency_rate DECIMAL(5, 2),
  growth_rate DECIMAL(5, 2),
  achievement_gap_reduction DECIMAL(5, 2),

  -- Engagement KPIs
  attendance_rate DECIMAL(5, 2),
  chronic_absenteeism_rate DECIMAL(5, 2),
  parent_engagement_rate DECIMAL(5, 2),

  -- Support KPIs
  students_receiving_interventions INTEGER,
  intervention_success_rate DECIMAL(5, 2),

  -- Post-Secondary KPIs
  graduation_rate DECIMAL(5, 2),
  college_enrollment_rate DECIMAL(5, 2),
  career_readiness_rate DECIMAL(5, 2),

  -- Equity KPIs
  opportunity_gap_index DECIMAL(5, 2),
  resource_equity_score DECIMAL(5, 2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kpis_year ON policy_kpis(school_year);
CREATE INDEX idx_kpis_site ON policy_kpis(site_id);

-- =====================================================
-- COMPARISON & BENCHMARKING
-- =====================================================

-- External Benchmarks (State, National averages)
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  benchmark_type TEXT CHECK (benchmark_type IN ('State Average', 'National Average', 'Similar Districts', 'Goal Target')),
  metric_name TEXT NOT NULL,

  -- Values
  benchmark_value DECIMAL(10, 2),
  comparison_year TEXT,

  -- Context
  population_size INTEGER,
  demographic_context TEXT,

  source TEXT, -- e.g., "Missouri DESE", "NCES"
  source_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADVANCED ANALYTICS VIEWS
-- =====================================================

-- Comprehensive Student Profile View
CREATE OR REPLACE VIEW student_comprehensive_profile AS
SELECT
  s.id,
  s.student_id,
  s.first_name,
  s.last_name,
  s.grade,
  s.active,

  -- Site Info
  si.name as site_name,
  si.address as site_address,

  -- Demographics
  sd.race_ethnicity,
  sd.gender,
  sd.free_reduced_lunch,
  sd.english_language_learner,
  sd.special_education,
  sd.zip_code,
  sd.neighborhood,

  -- Academic Performance
  s.attendance_rate,
  s.homework_completion_rate,
  s.reading_level,
  s.math_level,

  -- Support Info
  s.risk_score,
  s.priority,
  s.mentor_engagement_score,

  -- Community Context
  cm.median_household_income as neighborhood_income,
  cm.poverty_rate as neighborhood_poverty_rate,
  cm.crime_rate_per_1000 as neighborhood_crime_rate

FROM students s
LEFT JOIN sites si ON s.site_id = si.id
LEFT JOIN student_demographics sd ON s.id = sd.student_id
LEFT JOIN community_metrics cm ON sd.zip_code = cm.zip_code;

-- Site Performance Dashboard View
CREATE OR REPLACE VIEW site_performance_dashboard AS
SELECT
  s.id as site_id,
  s.name as site_name,
  s.latitude,
  s.longitude,

  -- Student Counts
  COUNT(DISTINCT st.id) as total_students,
  COUNT(DISTINCT CASE WHEN st.priority = 'high' THEN st.id END) as high_priority_students,
  COUNT(DISTINCT CASE WHEN sd.free_reduced_lunch = TRUE THEN st.id END) as free_lunch_students,
  COUNT(DISTINCT CASE WHEN sd.english_language_learner = TRUE THEN st.id END) as ell_students,
  COUNT(DISTINCT CASE WHEN sd.special_education = TRUE THEN st.id END) as sped_students,

  -- Performance Averages
  ROUND(AVG(st.attendance_rate), 2) as avg_attendance,
  ROUND(AVG(st.reading_level), 2) as avg_reading_level,
  ROUND(AVG(st.math_level), 2) as avg_math_level,
  ROUND(AVG(st.mentor_engagement_score), 2) as avg_engagement,

  -- Demographics Percentages
  ROUND(100.0 * COUNT(CASE WHEN sd.free_reduced_lunch = TRUE THEN 1 END) / NULLIF(COUNT(st.id), 0), 1) as pct_free_lunch,
  ROUND(100.0 * COUNT(CASE WHEN sd.english_language_learner = TRUE THEN 1 END) / NULLIF(COUNT(st.id), 0), 1) as pct_ell,

  -- Site Metrics
  smd.teacher_student_ratio,
  smd.per_pupil_spending,
  smd.overall_graduation_rate,
  smd.chronic_absenteeism_rate

FROM sites s
LEFT JOIN students st ON s.id = st.site_id AND st.active = TRUE
LEFT JOIN student_demographics sd ON st.id = sd.student_id
LEFT JOIN site_metrics_detailed smd ON s.id = smd.site_id
  AND smd.school_year = (SELECT MAX(school_year) FROM site_metrics_detailed)
GROUP BY s.id, s.name, s.latitude, s.longitude, smd.teacher_student_ratio,
         smd.per_pupil_spending, smd.overall_graduation_rate, smd.chronic_absenteeism_rate;

-- Program Effectiveness View
CREATE OR REPLACE VIEW program_effectiveness_analysis AS
SELECT
  ip.id as program_id,
  ip.program_name,
  ip.program_type,
  ip.is_active,

  -- Participation
  COUNT(DISTINCT spp.student_id) as total_participants,
  COUNT(DISTINCT CASE WHEN spp.status = 'Completed' THEN spp.student_id END) as completed_participants,
  ROUND(100.0 * COUNT(CASE WHEN spp.status = 'Completed' THEN 1 END) / NULLIF(COUNT(*), 0), 1) as completion_rate,

  -- Attendance
  ROUND(AVG(spp.attendance_rate), 2) as avg_attendance_rate,

  -- Outcomes
  ROUND(AVG(spp.pre_assessment_score), 2) as avg_pre_score,
  ROUND(AVG(spp.post_assessment_score), 2) as avg_post_score,
  ROUND(AVG(spp.improvement_percentage), 2) as avg_improvement,
  ROUND(100.0 * COUNT(CASE WHEN spp.goals_met = TRUE THEN 1 END) / NULLIF(COUNT(*), 0), 1) as pct_goals_met,

  -- Cost Effectiveness
  ip.cost_per_student,
  ip.annual_budget,
  ROUND(ip.annual_budget / NULLIF(COUNT(DISTINCT spp.student_id), 0), 2) as actual_cost_per_participant

FROM intervention_programs ip
LEFT JOIN student_program_participation spp ON ip.id = spp.program_id
GROUP BY ip.id, ip.program_name, ip.program_type, ip.is_active, ip.cost_per_student, ip.annual_budget;

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE
-- =====================================================

CREATE TRIGGER update_demographics_updated_at
  BEFORE UPDATE ON student_demographics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_site_metrics_updated_at
  BEFORE UPDATE ON site_metrics_detailed
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON intervention_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_participation_updated_at
  BEFORE UPDATE ON student_program_participation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Apply RLS to all new tables
ALTER TABLE student_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_metrics_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_program_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view demographics" ON student_demographics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify demographics" ON student_demographics
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view test scores" ON test_scores
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify test scores" ON test_scores
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view milestones" ON academic_milestones
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify milestones" ON academic_milestones
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view site metrics" ON site_metrics_detailed
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify site metrics" ON site_metrics_detailed
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view programs" ON intervention_programs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify programs" ON intervention_programs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view participation" ON student_program_participation
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify participation" ON student_program_participation
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can view community metrics" ON community_metrics
  FOR SELECT USING (TRUE); -- Public data

CREATE POLICY "Authenticated users can modify community metrics" ON community_metrics
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can view KPIs" ON policy_kpis
  FOR SELECT USING (TRUE); -- Public data for transparency

CREATE POLICY "Authenticated users can modify KPIs" ON policy_kpis
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can view benchmarks" ON benchmarks
  FOR SELECT USING (TRUE); -- Public data

CREATE POLICY "Authenticated users can modify benchmarks" ON benchmarks
  FOR ALL USING (auth.uid() IS NOT NULL);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert Sample Community Data for St. Louis Zip Codes
INSERT INTO community_metrics (zip_code, neighborhood, median_household_income, poverty_rate, unemployment_rate, crime_rate_per_1000, data_year) VALUES
('63118', 'Dutchtown', 32000, 28.5, 8.2, 45.3, 2024),
('63112', 'The Ville', 28500, 32.1, 9.5, 52.7, 2024),
('63108', 'Central West End', 55000, 18.2, 5.1, 28.4, 2024),
('63113', 'North City', 25000, 35.8, 11.2, 58.9, 2024);

-- Insert Sample Intervention Programs
INSERT INTO intervention_programs (program_name, program_type, description, start_date, is_active, funding_source, annual_budget, cost_per_student, goals_objectives) VALUES
('Mission Mentors', 'Mentoring', 'One-on-one mentoring for at-risk students', '2024-08-15', TRUE, 'Private Foundation', 150000, 500, 'Improve academic performance and engagement'),
('Summer Reading Academy', 'Literacy', 'Intensive summer reading intervention', '2024-06-01', TRUE, 'Title I', 75000, 350, 'Prevent summer learning loss'),
('STEM Saturdays', 'STEM', 'Weekend STEM enrichment program', '2024-09-01', TRUE, 'Corporate Sponsor', 50000, 250, 'Increase interest in STEM careers'),
('Family Engagement Initiative', 'Family Engagement', 'Monthly family events and workshops', '2024-08-01', TRUE, 'Grant Funding', 40000, 100, 'Increase family involvement in education');

-- Insert Sample Benchmarks
INSERT INTO benchmarks (benchmark_type, metric_name, benchmark_value, comparison_year, source) VALUES
('State Average', 'Graduation Rate', 89.5, '2023-2024', 'Missouri DESE'),
('State Average', 'Chronic Absenteeism Rate', 22.3, '2023-2024', 'Missouri DESE'),
('National Average', 'Reading Proficiency', 34.0, '2023-2024', 'NAEP'),
('National Average', 'Math Proficiency', 28.0, '2023-2024', 'NAEP'),
('Goal Target', 'College Readiness Rate', 75.0, '2025-2026', 'Mission STL Strategic Plan');

-- =====================================================
-- NOTES FOR IMPLEMENTATION
-- =====================================================

-- This enhanced schema provides:
-- 1. Comprehensive student demographic and socioeconomic tracking
-- 2. Detailed academic performance metrics
-- 3. School/district-level resource and outcome data
-- 4. Program intervention tracking with effectiveness analysis
-- 5. Community context integration
-- 6. Policy KPI monitoring
-- 7. Benchmarking against state/national standards
-- 8. Advanced analytics views for decision-making

-- Next steps:
-- 1. Run this SQL in Supabase after the base schema
-- 2. Update UI components to display layered data
-- 3. Add filtering controls for policy analysis
-- 4. Create data visualization dashboards
-- 5. Implement data import tools for bulk loading
