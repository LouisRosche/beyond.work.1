# Mission St. Louis - Student Support Dashboard

A real-time, production-ready dashboard for coordinating student support services across Mission St. Louis partner schools. Built with React, Vite, and Supabase.

## 🎯 Features

- **Real-time Updates**: Automatic data synchronization using Supabase real-time subscriptions
- **Interactive Map**: Visualize school locations and student distributions across St. Louis
- **Student Management**: Full CRUD operations with validation and error handling
- **Advanced Filtering**: Filter by site, priority level, and search students
- **Pagination**: Efficient data loading with 50 students per page
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Input Validation**: Comprehensive data validation using Zod schema
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Security**: Row-level security with authentication requirements

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd beyond.work.1
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `database/schema.sql`
3. Enable Realtime for the `sites` and `students` tables:
   - Go to Database → Replication
   - Toggle ON for `sites` and `students` tables
4. Get your API credentials:
   - Settings → API
   - Copy your `Project URL` and `anon` key

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 📦 Project Structure

```
beyond.work.1/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── database/
│   ├── schema.sql              # Main database schema
│   └── schema-SECURITY-FIX.sql # Security policy updates
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx      # Student management interface
│   │   ├── ErrorBoundary.jsx   # Error handling component
│   │   ├── Header.jsx          # Dashboard header with metrics
│   │   ├── MapView.jsx         # Interactive school map
│   │   ├── Sidebar.jsx         # Filters and student list
│   │   └── StudentModal.jsx    # Student detail view
│   ├── hooks/
│   │   └── useDashboardData.js # Data fetching and state management
│   ├── lib/
│   │   ├── supabaseClient.js   # Supabase configuration
│   │   └── validation.js       # Zod schemas and validation
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🔐 Security

### ⚠️ IMPORTANT: Before Deploying to Production

**Current State**: The default schema allows authenticated access. For production:

1. **Enable Authentication**: Set up Supabase Auth (Email, Google SSO, etc.)
2. **Apply Security Policies**: Run `database/schema-SECURITY-FIX.sql` to enforce authentication
3. **Test Access Control**: Verify unauthenticated users cannot access student data
4. **Review Compliance**: Ensure FERPA compliance for student data handling

### Security Features

- ✅ Input validation using Zod schemas
- ✅ XSS prevention through text sanitization
- ✅ Row-level security policies in Supabase
- ✅ Environment variable validation
- ✅ Error boundary protection
- ✅ Double-submit prevention

## 📊 Database Schema

### Tables

**sites**: School/site information
- `id`, `site_code`, `name`, `address`, `latitude`, `longitude`
- Coordinator contact information

**students**: Student records
- Basic info: `student_id`, `first_name`, `last_name`, `site_id`, `grade`
- Metrics: `risk_score`, `priority`, `attendance_rate`, `homework_completion_rate`
- Academic: `reading_level`, `math_level`
- Support: `strengths`, `concerns`, `recommended_actions`, `notes`

### Views

**dashboard_summary**: Aggregated metrics per site
- Student counts by priority level
- Average attendance and engagement scores

## 🎨 Component Overview

### Header
- Displays key metrics (total students, high priority, avg attendance, engagement)
- Refresh button and last update timestamp
- Admin panel toggle

### Sidebar
- Site filter dropdown
- Priority level checkboxes (high, medium, low)
- Search bar for students
- Scrollable student list with click-to-select

### MapView
- Interactive Leaflet map centered on St. Louis
- Custom markers with priority-based colors
- Popup with site details and student counts
- Auto-center on selected site

### StudentModal
- Full student detail view
- Performance metrics with progress bars
- Strengths, concerns, and recommended actions
- Close on ESC or backdrop click

### AdminPanel
- Side-panel with student list and form
- Full CRUD operations
- Real-time validation with Zod
- Success/error messaging

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Quality

- **Validation**: All form inputs validated with Zod
- **Error Handling**: Comprehensive try/catch with user-friendly messages
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Performance**: Pagination, memoization, optimized re-renders
- **Type Safety**: PropTypes ready, TypeScript-compatible structure

## 🚢 Deployment

### Option 1: GitHub Pages (Free)

1. Push code to GitHub
2. Go to Settings → Secrets and variables → Actions
3. Add secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Go to Settings → Pages
5. Set source to "GitHub Actions"
6. Push to `main` branch - auto-deploys!

### Option 2: Other Platforms

Works on any static host:
- Vercel: Import from GitHub
- Netlify: Connect repository
- Cloudflare Pages: Deploy from Git

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env` file exists (copy from `.env.example`)
- Check variable names start with `VITE_`
- Restart dev server after changing `.env`

### Map not displaying
- Check internet connection (requires OpenStreetMap tiles)
- Verify site coordinates in database

### Students not loading
- Check Supabase project is active
- Verify database schema is applied
- Check browser console for errors

### Build fails on GitHub Actions
- Verify secrets are set in repository settings
- Check all environment variables are prefixed with `VITE_`

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Email: support@missionstl.org
- GitHub Issues: [Create an issue](https://github.com/your-org/beyond.work.1/issues)

## 🙏 Acknowledgments

Built for Mission St. Louis to support student success across partner schools in the St. Louis area.

---

**Version**: 2.0.0
**Last Updated**: October 2025
**Status**: Production Ready (pending authentication setup)
