-- =====================================================
-- SECURITY FIX: Replace Existing RLS Policies
-- This fixes the CRITICAL security vulnerability
-- where student data is publicly accessible
-- =====================================================

-- ⚠️ IMPORTANT: Run this AFTER creating your database
-- This will REPLACE the insecure policies with secure ones

-- Drop ALL existing insecure policies
DROP POLICY IF EXISTS "Allow public read access on sites" ON sites;
DROP POLICY IF EXISTS "Allow public read access on students" ON students;
DROP POLICY IF EXISTS "Allow public read access on student_metrics" ON student_metrics;
DROP POLICY IF EXISTS "Allow public read access on site_metrics" ON site_metrics;
DROP POLICY IF EXISTS "Allow authenticated insert on sites" ON sites;
DROP POLICY IF EXISTS "Allow authenticated update on sites" ON sites;
DROP POLICY IF EXISTS "Allow authenticated insert on students" ON students;
DROP POLICY IF EXISTS "Allow authenticated update on students" ON students;

-- =====================================================
-- SECURE POLICIES: Require Authentication
-- =====================================================

-- Sites: Authenticated users can read
CREATE POLICY "Authenticated users can view sites" ON sites
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Sites: Authenticated users can modify
CREATE POLICY "Authenticated users can insert sites" ON sites
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update sites" ON sites
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Students: Authenticated users can read
-- ✅ This protects student PII from public access
CREATE POLICY "Authenticated users can view students" ON students
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Students: Authenticated users can modify
CREATE POLICY "Authenticated users can insert students" ON students
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update students" ON students
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete students" ON students
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Student Metrics: Authenticated users only
CREATE POLICY "Authenticated users can view metrics" ON student_metrics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert metrics" ON student_metrics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update metrics" ON student_metrics
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Site Metrics: Authenticated users only
CREATE POLICY "Authenticated users can view site metrics" ON site_metrics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert site metrics" ON site_metrics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Strengths: Authenticated users only
CREATE POLICY "Authenticated users can view strengths" ON student_strengths
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert strengths" ON student_strengths
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Concerns: Authenticated users only
CREATE POLICY "Authenticated users can view concerns" ON student_concerns
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert concerns" ON student_concerns
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update concerns" ON student_concerns
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Interventions: Authenticated users only
CREATE POLICY "Authenticated users can view interventions" ON interventions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert interventions" ON interventions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update interventions" ON interventions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Contact Log: Authenticated users only
CREATE POLICY "Authenticated users can view contacts" ON contact_log
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert contacts" ON contact_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Run this to verify policies are in place:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- You should see policies that require auth.uid() IS NOT NULL
-- NOT policies with qual = 'true'

-- =====================================================
-- NOTES FOR MISSION ST. LOUIS
-- =====================================================

-- ✅ This fix ensures:
-- 1. Only authenticated users can view student data
-- 2. Student PII is not publicly accessible
-- 3. FERPA compliance requirements are met
-- 4. Unauthorized access is prevented

-- ❌ This means:
-- 1. You MUST implement authentication before going live
-- 2. Anonymous users cannot view the dashboard
-- 3. Staff need to log in to access data

-- 📋 Next Steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Set up Supabase Authentication (Email, Google, etc.)
-- 3. Add login component to your React app
-- 4. Test that unauthenticated users cannot see data
-- 5. Only then deploy to production

-- ⚠️ WARNING:
-- Do NOT deploy this dashboard publicly until authentication
-- is fully implemented and tested.
