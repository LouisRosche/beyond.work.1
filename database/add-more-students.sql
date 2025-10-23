-- Add More Sample Students
-- Run this in Supabase SQL Editor to add 20+ realistic student records

-- Insert 24 additional students across the 4 sites
INSERT INTO students (student_id, first_name, last_name, site_id, grade, risk_score, priority, attendance_rate, homework_completion_rate, reading_level, math_level, behavioral_incidents, mentor_engagement_score, strengths, concerns, recommended_actions, notes, last_contact_date)
SELECT
  'STU0003', 'Marcus', 'Davis', id, 6, 0.82, 'high', 68, 58, 4.8, 5.1, 5, 2.2,
  ARRAY['Basketball', 'Teamwork'],
  ARRAY['Chronic absenteeism', 'Behavioral issues', 'Reading gaps'],
  ARRAY['Daily check-ins', 'Behavioral plan', 'Reading intervention'],
  'Talented athlete, struggling with consistency',
  CURRENT_DATE - INTERVAL '3 days'
FROM sites WHERE site_code = 'kairos'
UNION ALL
SELECT
  'STU0004', 'Destiny', 'Williams', id, 7, 0.35, 'medium', 91, 88, 7.8, 7.2, 0, 4.1,
  ARRAY['Math', 'Science', 'Debate'],
  ARRAY['Writing skills'],
  ARRAY['Writing workshop'],
  'Strong student, college potential',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'kairos'
UNION ALL
SELECT
  'STU0005', 'Isaiah', 'Brown', id, 8, 0.91, 'high', 45, 32, 3.2, 3.8, 8, 1.8,
  ARRAY['Music', 'Hands-on learning'],
  ARRAY['Severe attendance issues', 'Academic gaps', 'Family instability'],
  ARRAY['Home visits', 'Social services referral', 'Intensive tutoring'],
  'Facing significant challenges, needs wraparound support',
  CURRENT_DATE - INTERVAL '7 days'
FROM sites WHERE site_code = 'kairos'
UNION ALL
SELECT
  'STU0006', 'Aaliyah', 'Jones', id, 6, 0.28, 'low', 96, 94, 8.1, 8.5, 0, 4.8,
  ARRAY['Reading', 'Leadership', 'Peer mentoring'],
  ARRAY[]::text[],
  ARRAY['Enrichment opportunities', 'Advanced coursework'],
  'Exceptional student, leadership potential',
  CURRENT_DATE - INTERVAL '2 days'
FROM sites WHERE site_code = 'kairos'
UNION ALL
SELECT
  'STU0007', 'Jamal', 'Miller', id, 9, 0.55, 'medium', 82, 76, 6.4, 6.8, 2, 3.4,
  ARRAY['History', 'Public speaking'],
  ARRAY['Math fluency', 'Organization'],
  ARRAY['Math tutoring', 'Study skills workshop'],
  'Bright student, needs structure',
  CURRENT_DATE - INTERVAL '4 days'
FROM sites WHERE site_code = 'lafayette'
UNION ALL
SELECT
  'STU0008', 'Zoe', 'Garcia', id, 8, 0.41, 'medium', 87, 83, 7.2, 6.5, 1, 3.9,
  ARRAY['Art', 'Creative writing', 'Bilingual'],
  ARRAY['Science support needed'],
  ARRAY['Science tutoring'],
  'Creative student, strong in humanities',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'lafayette'
UNION ALL
SELECT
  'STU0009', 'Cameron', 'Rodriguez', id, 7, 0.69, 'high', 74, 68, 5.6, 5.9, 4, 2.9,
  ARRAY['Video games', 'Technology'],
  ARRAY['Focus issues', 'Missing assignments'],
  ARRAY['Structured homework time', 'Technology-based learning'],
  'Tech-savvy, needs engagement strategies',
  CURRENT_DATE - INTERVAL '5 days'
FROM sites WHERE site_code = 'lafayette'
UNION ALL
SELECT
  'STU0010', 'Nia', 'Martinez', id, 9, 0.22, 'low', 97, 96, 9.2, 8.8, 0, 4.9,
  ARRAY['STEM', 'Robotics', 'Math competitions'],
  ARRAY[]::text[],
  ARRAY['AP preparation', 'College visits'],
  'Outstanding student, STEM focus',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'lafayette'
UNION ALL
SELECT
  'STU0011', 'Elijah', 'Anderson', id, 6, 0.78, 'high', 71, 62, 4.9, 5.4, 6, 2.4,
  ARRAY['Sports', 'Physical education'],
  ARRAY['Reading difficulties', 'Behavior management'],
  ARRAY['Reading specialist', 'Behavioral support'],
  'Energetic student, learning differences suspected',
  CURRENT_DATE - INTERVAL '2 days'
FROM sites WHERE site_code = 'sllis'
UNION ALL
SELECT
  'STU0012', 'Sofia', 'Thomas', id, 7, 0.38, 'medium', 89, 85, 7.5, 7.1, 0, 4.2,
  ARRAY['Languages', 'Cultural studies', 'Music'],
  ARRAY['Math problem-solving'],
  ARRAY['Math enrichment'],
  'Multilingual student, strong language skills',
  CURRENT_DATE - INTERVAL '3 days'
FROM sites WHERE site_code = 'sllis'
UNION ALL
SELECT
  'STU0013', 'Xavier', 'Taylor', id, 8, 0.52, 'medium', 84, 79, 6.7, 6.2, 2, 3.5,
  ARRAY['Drama', 'Performance', 'Communication'],
  ARRAY['Written expression', 'Test anxiety'],
  ARRAY['Writing support', 'Test-taking strategies'],
  'Expressive student, performance strengths',
  CURRENT_DATE - INTERVAL '6 days'
FROM sites WHERE site_code = 'sllis'
UNION ALL
SELECT
  'STU0014', 'Mia', 'Jackson', id, 6, 0.31, 'low', 94, 92, 8.3, 7.9, 0, 4.6,
  ARRAY['Reading', 'Art', 'Helping others'],
  ARRAY[]::text[],
  ARRAY['Peer tutoring opportunities', 'Enrichment'],
  'Compassionate student, excels academically',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'sllis'
UNION ALL
SELECT
  'STU0015', 'Noah', 'White', id, 9, 0.63, 'medium', 79, 73, 6.1, 6.4, 3, 3.1,
  ARRAY['Environmental science', 'Outdoor activities'],
  ARRAY['Inconsistent effort', 'Missing work'],
  ARRAY['Goal-setting', 'Weekly progress checks'],
  'Interested in nature, needs motivation',
  CURRENT_DATE - INTERVAL '4 days'
FROM sites WHERE site_code = 'biome'
UNION ALL
SELECT
  'STU0016', 'Olivia', 'Harris', id, 7, 0.44, 'medium', 86, 82, 7.1, 6.9, 1, 3.8,
  ARRAY['Biology', 'Sustainability', 'Gardening'],
  ARRAY['Time management'],
  ARRAY['Study skills', 'Planners'],
  'Environmental focus, good student',
  CURRENT_DATE - INTERVAL '2 days'
FROM sites WHERE site_code = 'biome'
UNION ALL
SELECT
  'STU0017', 'Liam', 'Clark', id, 8, 0.87, 'high', 52, 47, 4.1, 4.5, 7, 1.9,
  ARRAY['Hands-on learning', 'Building'],
  ARRAY['Severe attendance', 'Academic deficits', 'Motivation'],
  ARRAY['Attendance intervention', 'Career exploration', 'Intensive support'],
  'Needs re-engagement, career-technical focus may help',
  CURRENT_DATE - INTERVAL '10 days'
FROM sites WHERE site_code = 'biome'
UNION ALL
SELECT
  'STU0018', 'Emma', 'Lewis', id, 6, 0.26, 'low', 95, 93, 8.5, 8.2, 0, 4.7,
  ARRAY['Science experiments', 'Research', 'Writing'],
  ARRAY[]::text[],
  ARRAY['Science fair', 'Advanced projects'],
  'Curious mind, loves hands-on science',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'biome'
UNION ALL
SELECT
  'STU0019', 'Aiden', 'Walker', id, 9, 0.59, 'medium', 81, 75, 6.3, 6.6, 2, 3.3,
  ARRAY['Coding', 'Technology', 'Gaming'],
  ARRAY['Writing skills', 'Participation'],
  ARRAY['Writing workshop', 'Class engagement strategies'],
  'Tech-oriented, quiet student',
  CURRENT_DATE - INTERVAL '3 days'
FROM sites WHERE site_code = 'biome'
UNION ALL
SELECT
  'STU0020', 'Sophia', 'Hall', id, 7, 0.48, 'medium', 85, 80, 6.9, 7.3, 1, 3.7,
  ARRAY['Math', 'Problem-solving', 'Chess'],
  ARRAY['Reading comprehension'],
  ARRAY['Reading strategies'],
  'Analytical thinker, math strength',
  CURRENT_DATE - INTERVAL '2 days'
FROM sites WHERE site_code = 'kairos'
UNION ALL
SELECT
  'STU0021', 'Mason', 'Allen', id, 8, 0.71, 'high', 70, 64, 5.3, 5.7, 5, 2.6,
  ARRAY['Mechanics', 'Cars', 'Fixing things'],
  ARRAY['Reading level', 'Attendance', 'Engagement'],
  ARRAY['Career-technical exploration', 'Reading intervention', 'Attendance plan'],
  'Hands-on learner, interested in trades',
  CURRENT_DATE - INTERVAL '6 days'
FROM sites WHERE site_code = 'lafayette'
UNION ALL
SELECT
  'STU0022', 'Isabella', 'Young', id, 6, 0.33, 'low', 93, 91, 8.1, 7.8, 0, 4.5,
  ARRAY['Dance', 'Performance arts', 'Academics'],
  ARRAY[]::text[],
  ARRAY['Arts enrichment', 'Leadership opportunities'],
  'Well-rounded student, strong performer',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'sllis'
UNION ALL
SELECT
  'STU0023', 'Ethan', 'King', id, 9, 0.56, 'medium', 83, 77, 6.5, 6.7, 2, 3.4,
  ARRAY['History', 'Social studies', 'Debate'],
  ARRAY['Organization', 'Long-term projects'],
  ARRAY['Executive function coaching', 'Project planning'],
  'Interested in politics, needs structure',
  CURRENT_DATE - INTERVAL '4 days'
FROM sites WHERE site_code = 'lafayette'
UNION ALL
SELECT
  'STU0024', 'Ava', 'Wright', id, 7, 0.40, 'medium', 88, 84, 7.3, 7.0, 1, 3.9,
  ARRAY['Singing', 'Music', 'Languages'],
  ARRAY['Math fluency'],
  ARRAY['Math practice'],
  'Musical talent, good student',
  CURRENT_DATE - INTERVAL '2 days'
FROM sites WHERE site_code = 'sllis'
UNION ALL
SELECT
  'STU0025', 'James', 'Lopez', id, 8, 0.84, 'high', 62, 55, 4.6, 5.0, 6, 2.1,
  ARRAY['Art', 'Drawing'],
  ARRAY['Attendance issues', 'Academic gaps', 'Behavioral concerns'],
  ARRAY['Family engagement', 'Mentoring', 'Academic recovery plan'],
  'Creative student facing barriers, needs support',
  CURRENT_DATE - INTERVAL '8 days'
FROM sites WHERE site_code = 'biome'
UNION ALL
SELECT
  'STU0026', 'Charlotte', 'Scott', id, 9, 0.29, 'low', 96, 94, 8.9, 8.6, 0, 4.8,
  ARRAY['All subjects', 'Student government', 'Volunteering'],
  ARRAY[]::text[],
  ARRAY['College prep', 'Scholarship opportunities', 'Leadership roles'],
  'Exceptional all-around student, college-bound',
  CURRENT_DATE - INTERVAL '1 day'
FROM sites WHERE site_code = 'kairos';

-- Verify the insert
SELECT COUNT(*) as new_student_count FROM students WHERE student_id LIKE 'STU00%';
