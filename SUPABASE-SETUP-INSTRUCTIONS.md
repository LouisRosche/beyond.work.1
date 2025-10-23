# 📊 SUPABASE DATABASE SETUP - Step by Step

## ⚠️ IMPORTANT: Run These in Order!

You need to run TWO SQL files, in this order:
1. First: `schema.sql` (creates base tables)
2. Second: `schema-ENHANCED-POLICY.sql` (adds policy features)

---

## 🎯 Step-by-Step Instructions

### **Part 1: Run Base Schema** (Creates sites & students tables)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Click on your project: `zupcfmoxdsifqykyyufh`

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query" button

3. **Get the SQL from your computer**
   - On your computer, open file: `database/schema.sql`
   - Select ALL the text inside (Ctrl+A or Cmd+A)
   - Copy it (Ctrl+C or Cmd+C)

4. **Paste into Supabase**
   - Click in the Supabase SQL Editor window
   - Paste (Ctrl+V or Cmd+V)
   - You should see SQL starting with: `-- Mission St. Louis Dashboard`

5. **Run It**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait 5-10 seconds
   - ✅ Should see: "Success. No rows returned"

6. **Verify Base Tables Created**
   - Click "Table Editor" in left sidebar
   - You should see these tables:
     - ✅ sites (4 rows)
     - ✅ students (2 rows)

---

### **Part 2: Run Enhanced Schema** (Adds policy analytics)

1. **Open New Query in SQL Editor**
   - Click "SQL Editor" again
   - Click "New Query" button

2. **Get the Enhanced SQL from your computer**
   - On your computer, open file: `database/schema-ENHANCED-POLICY.sql`
   - Select ALL the text inside (Ctrl+A or Cmd+A)
   - Copy it (Ctrl+C or Cmd+C)

3. **Paste into Supabase**
   - Click in the new query window
   - Paste (Ctrl+V or Cmd+V)
   - You should see SQL starting with: `-- ENHANCED SCHEMA FOR EDUCATIONAL POLICY`

4. **Run It**
   - Click "Run" button
   - Wait 15-20 seconds (this one takes longer)
   - ✅ Should see: "Success. No rows returned"

5. **Verify Enhanced Tables Created**
   - Click "Table Editor" in left sidebar
   - You should now see 13 total tables:
     - ✅ sites
     - ✅ students
     - ✅ student_demographics (NEW)
     - ✅ test_scores (NEW)
     - ✅ academic_milestones (NEW)
     - ✅ site_metrics_detailed (NEW)
     - ✅ intervention_programs (NEW - should have 4 rows)
     - ✅ student_program_participation (NEW)
     - ✅ community_metrics (NEW - should have 4 rows)
     - ✅ policy_kpis (NEW)
     - ✅ benchmarks (NEW - should have 5 rows)

6. **Check Sample Data**
   - Click on `intervention_programs` table
   - Should see 4 programs (Mission Mentors, Summer Reading, etc.)
   - Click on `community_metrics` table
   - Should see 4 St. Louis zip codes (63118, 63112, 63108, 63113)

---

## ✅ How to Know It Worked

### After Part 1:
- Table Editor shows `sites` table with 4 schools
- Table Editor shows `students` table with 2 students

### After Part 2:
- Table Editor shows 13 total tables
- `intervention_programs` has 4 rows
- `community_metrics` has 4 rows
- `benchmarks` has 5 rows

---

## 🆘 Troubleshooting

### Error: "relation 'students' does not exist"
**Problem**: You skipped Part 1
**Solution**: Run `schema.sql` first, then `schema-ENHANCED-POLICY.sql`

### Error: "syntax error at or near 'schema'"
**Problem**: You're pasting the FILENAME instead of the FILE CONTENTS
**Solution**: 
1. Open the file in a text editor (VS Code, Notepad, etc.)
2. Select ALL the text INSIDE the file
3. Copy that text
4. Paste into Supabase

### Error: "already exists"
**Problem**: You already ran this schema
**Solution**: This is OK! The tables already exist. Just verify in Table Editor.

### No error, but no tables showing
**Problem**: Might be looking at wrong schema
**Solution**: 
1. In Table Editor, make sure schema dropdown is set to "public"
2. Click refresh button
3. Check "All tables" not "My tables"

---

## 🎯 Quick Checklist

Before running SQL:
- [ ] I'm logged into Supabase dashboard
- [ ] I see my project name: `zupcfmoxdsifqykyyufh`
- [ ] I'm in "SQL Editor"
- [ ] I clicked "New Query"
- [ ] I opened the .sql FILE on my computer
- [ ] I selected ALL text INSIDE the file
- [ ] I copied it
- [ ] I pasted into Supabase (not the filename!)

After running SQL:
- [ ] I see "Success" message (not an error)
- [ ] Table Editor shows the new tables
- [ ] Sample data is present

---

## 💡 Alternative: Use Supabase CLI

If copy/paste isn't working, you can use the command line:

```bash
# Install Supabase CLI (one time)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zupcfmoxdsifqykyyufh

# Run base schema
supabase db push database/schema.sql

# Run enhanced schema  
supabase db push database/schema-ENHANCED-POLICY.sql
```

---

## ✅ Once Complete

After both SQL files are run successfully:

```bash
# Start your dashboard
npm run dev

# Open browser to:
http://localhost:5173
```

You should see:
- Map with 4 schools
- Sidebar with students
- All data loading correctly

---

**Still stuck? Let me know which error you're seeing!**
