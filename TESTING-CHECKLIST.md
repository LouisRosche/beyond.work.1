# Dashboard Testing Checklist

Quick checklist to verify everything is working after the latest updates.

## ✅ What Should Work Now

### Map (Main View)
- [ ] **4 colored school markers** visible on St. Louis map
  - Red = High priority (many high-risk students)
  - Orange = Medium priority
  - Green = Low priority
- [ ] **Click any marker** → Shows popup with:
  - School name
  - Student count
  - High priority count
  - Address
  - "View Students" button
- [ ] **Click "View Students"** → Filters sidebar to show only that school's students
- [ ] **Map zooms/pans** smoothly with mouse/trackpad

### Header (Top Bar)
- [ ] **Total Students: 26** (after running the SQL to add 24 more)
- [ ] **High Priority count** shows correct number
- [ ] **Avg Attendance %** displays (not blank or error)
- [ ] **Avg Engagement** displays (not blank or error)
- [ ] **Refresh button** works (shows loading spinner)
- [ ] **Admin button** opens admin panel

### Sidebar (Left Panel)
- [ ] **26 students listed** (or 2 if you haven't run the add-more-students.sql yet)
- [ ] Each student shows:
  - Name
  - Grade
  - School name
  - Priority indicator (colored icon)
- [ ] **Collapse button** (pancake icon) properly positioned (not overlapping Filters)
- [ ] **Site dropdown** lets you filter by school
  - "All Sites" shows all students
  - Selecting a school filters to just those students
- [ ] **Priority checkboxes** filter students correctly
- [ ] **Search box** filters by student name
- [ ] **Scrolling** works smoothly in student list

### Known Design Choices
⚠️ **Students don't have individual pins on the map** - This is intentional! Students are grouped by school. Each school marker shows how many students are at that location. Click a school marker to see its students in the sidebar.

## 🚨 Common Issues & Fixes

### Issue: "Still only 2 students"
**Fix:** Run the `add-more-students.sql` in Supabase SQL Editor (with the fixed ARRAY[]::text[] version)

### Issue: "UUID error when clicking school"
**Fix:** Run `git pull` to get the latest fixes

### Issue: "Metrics show 0.0% or error"
**Fix:** Run `git pull` to get the Number() conversion fix

### Issue: "Leaflet attribution overlaps legend"
**Fix:** Run `git pull` to get spacing fix

### Issue: "Collapse button overlaps Filter icon"
**Fix:** Run `git pull` to get positioning fix

## 🎯 Next Features to Test (Once Basic Works)

### Admin Panel
- [ ] Click **Settings/Admin** button in header
- [ ] **Add Student** form appears
- [ ] Can add a new student with validation
- [ ] New student appears in sidebar immediately (real-time)
- [ ] Can **Edit** existing student
- [ ] Can **Delete** student (with confirmation)

### Real-Time Updates
- [ ] Open dashboard in **2 browser tabs**
- [ ] Add/edit student in one tab
- [ ] Changes appear **automatically** in other tab (no refresh needed)

## 📊 Expected Student Distribution (After SQL)

- **Kairos Academies**: 8 students (2 original + 6 new)
- **Lafayette Prep**: 7 students
- **SLLIS**: 6 students
- **Biome School**: 5 students
- **Total**: 26 students

## 🐛 Report Issues

If something doesn't work:
1. Open browser console (F12)
2. Click "Console" tab
3. Copy any **red error messages**
4. Share with Claude for quick fixes

## 🚀 Ready for Next Steps

Once basic dashboard works:
- [ ] CSV/XLSX import tool (bulk upload students)
- [ ] Deploy to live URL (Vercel)
- [ ] Fix Supabase security warnings
- [ ] Additional policy analytics features
