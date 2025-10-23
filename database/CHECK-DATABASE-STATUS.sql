-- =====================================================
-- DATABASE STATUS CHECK
-- Run this in Supabase SQL Editor to see what's installed
-- =====================================================

-- Check which tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- This should show you if you have:
-- Base tables: sites, students
-- Enhanced tables: student_demographics, test_scores, intervention_programs, etc.
