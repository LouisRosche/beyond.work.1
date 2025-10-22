# 🚀 QUICKSTART - Get the Dashboard Running in 5 Minutes

## Step 1: Create Supabase Project (2 minutes)

1. Go to: https://supabase.com
2. Click "Start your project" (sign up with GitHub - it's free)
3. Click "New Project"
   - Name: `mission-stl-dashboard`
   - Password: (create any password - save it!)
   - Region: **US East** (closest to St. Louis)
4. Click "Create new project"
5. ⏳ Wait 2-3 minutes while it creates

## Step 2: Create Database (1 minute)

1. Click **"SQL Editor"** in left sidebar
2. Click **"New Query"**
3. Copy ALL contents from this file: `database/schema.sql`
4. Paste into SQL Editor
5. Click **"Run"** button (or press Ctrl+Enter)
6. Should see: ✅ "Success. No rows returned"

## Step 3: Get API Keys (30 seconds)

1. Click **"Settings"** (gear icon in sidebar)
2. Click **"API"**
3. You'll see two keys - copy both:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Create .env File (30 seconds)

In your project folder, run:

```bash
cp .env.example .env
```

Then edit `.env` and paste your keys:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-long-key-here
```

## Step 5: Start the Dashboard (30 seconds)

```bash
npm run dev
```

Open: **http://localhost:5173**

## ✅ You Should Now See:

- Map of St. Louis with 4 school markers
- 2 sample students in the sidebar
- Metrics in the header showing totals
- Click markers to see school info
- Click students to see details
- Click gear icon (bottom right) for Admin Panel

## 🎉 That's It!

Total time: ~5 minutes
Cost: $0 (Supabase free tier)

## 🐛 Troubleshooting

**Still spinning?**
- Check browser console (F12) for errors
- Verify .env file exists: `ls -la .env`
- Check .env has correct values: `cat .env`
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

**"Missing environment variables" error?**
- Make sure variable names start with `VITE_`
- No quotes around values in .env file
- Restart dev server after editing .env

**Map not loading?**
- This is normal if no internet connection (uses OpenStreetMap)
- Check if sites data loaded by looking at sidebar
