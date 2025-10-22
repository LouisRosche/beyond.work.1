import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, GraduationCap, DollarSign, Target,
  BarChart3, PieChart, Activity, Award, AlertCircle
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './PolicyDashboard.css'

export default function PolicyDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [kpis, setKpis] = useState([])
  const [programs, setPrograms] = useState([])
  const [sitePerformance, setSitePerformance] = useState([])
  const [benchmarks, setBenchmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolicyData()
  }, [])

  const fetchPolicyData = async () => {
    try {
      // Fetch KPIs
      const { data: kpiData } = await supabase
        .from('policy_kpis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      // Fetch Program Effectiveness
      const { data: programData } = await supabase
        .from('program_effectiveness_analysis')
        .select('*')
        .eq('is_active', true)

      // Fetch Site Performance
      const { data: siteData } = await supabase
        .from('site_performance_dashboard')
        .select('*')

      // Fetch Benchmarks
      const { data: benchmarkData } = await supabase
        .from('benchmarks')
        .select('*')

      setKpis(kpiData || [])
      setPrograms(programData || [])
      setSitePerformance(siteData || [])
      setBenchmarks(benchmarkData || [])
    } catch (error) {
      console.error('Error fetching policy data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'programs', label: 'Programs', icon: Target },
    { id: 'equity', label: 'Equity', icon: Users },
    { id: 'financial', label: 'Financial', icon: DollarSign }
  ]

  return (
    <motion.div
      className="policy-dashboard-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="policy-dashboard"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="policy-header">
          <div>
            <h1>Educational Policy Analytics</h1>
            <p className="subtitle">St. Louis Area Schools - Data-Driven Decision Making</p>
          </div>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {/* Tabs */}
        <div className="policy-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`policy-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="policy-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading analytics...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab kpis={kpis} sites={sitePerformance} />}
              {activeTab === 'academics' && <AcademicsTab kpis={kpis} benchmarks={benchmarks} />}
              {activeTab === 'programs' && <ProgramsTab programs={programs} />}
              {activeTab === 'equity' && <EquityTab sites={sitePerformance} />}
              {activeTab === 'financial' && <FinancialTab sites={sitePerformance} />}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Overview Tab Component
function OverviewTab({ kpis, sites }) {
  const latestKPI = kpis[0] || {}

  const metrics = [
    { label: 'Avg Attendance Rate', value: `${latestKPI.attendance_rate || 0}%`, icon: Users, color: 'blue' },
    { label: 'Proficiency Rate', value: `${latestKPI.proficiency_rate || 0}%`, icon: GraduationCap, color: 'green' },
    { label: 'Growth Rate', value: `${latestKPI.growth_rate || 0}%`, icon: TrendingUp, color: 'purple' },
    { label: 'Graduation Rate', value: `${latestKPI.graduation_rate || 0}%`, icon: Award, color: 'orange' }
  ]

  return (
    <div className="overview-tab">
      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className={`metric-card ${metric.color}`}>
              <div className="metric-icon">
                <Icon size={24} />
              </div>
              <div className="metric-info">
                <p className="metric-label">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* School Performance Summary */}
      <div className="section-card">
        <h3>School Performance Summary</h3>
        <div className="schools-table">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Students</th>
                <th>Attendance</th>
                <th>Avg Reading</th>
                <th>Free Lunch %</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.site_id}>
                  <td>{site.site_name}</td>
                  <td>{site.total_students}</td>
                  <td>{site.avg_attendance}%</td>
                  <td>{site.avg_reading_level}</td>
                  <td>{site.pct_free_lunch}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Box */}
      {latestKPI.chronic_absenteeism_rate > 20 && (
        <div className="alert-box warning">
          <AlertCircle size={20} />
          <div>
            <strong>Chronic Absenteeism Alert</strong>
            <p>Current rate: {latestKPI.chronic_absenteeism_rate}% - Above state target of 15%</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Academics Tab Component
function AcademicsTab({ kpis, benchmarks }) {
  const latestKPI = kpis[0] || {}
  const stateBenchmarks = benchmarks.filter(b => b.benchmark_type === 'State Average')
  const goalBenchmarks = benchmarks.filter(b => b.benchmark_type === 'Goal Target')

  return (
    <div className="academics-tab">
      <div className="section-card">
        <h3>Academic Performance vs. State Averages</h3>
        <div className="benchmark-comparison">
          {stateBenchmarks.map(benchmark => (
            <div key={benchmark.id} className="benchmark-item">
              <div className="benchmark-header">
                <span className="benchmark-name">{benchmark.metric_name}</span>
                <span className="benchmark-year">{benchmark.comparison_year}</span>
              </div>
              <div className="benchmark-values">
                <div className="our-value">
                  <span className="label">Our District</span>
                  <span className="value">{latestKPI[benchmark.metric_name?.toLowerCase().replace(/ /g, '_')] || 'N/A'}</span>
                </div>
                <div className="state-value">
                  <span className="label">State Average</span>
                  <span className="value">{benchmark.benchmark_value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h3>Progress Toward Goals</h3>
        <div className="goals-list">
          {goalBenchmarks.map(goal => (
            <div key={goal.id} className="goal-item">
              <div className="goal-header">
                <span>{goal.metric_name}</span>
                <span className="goal-target">Target: {goal.benchmark_value}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, (latestKPI[goal.metric_name?.toLowerCase().replace(/ /g, '_')] / goal.benchmark_value) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Programs Tab Component
function ProgramsTab({ programs }) {
  return (
    <div className="programs-tab">
      <div className="section-card">
        <h3>Active Intervention Programs</h3>
        <p className="section-subtitle">Effectiveness analysis of current programs</p>
        <div className="programs-grid">
          {programs.map(program => (
            <div key={program.program_id} className="program-card">
              <div className="program-header">
                <h4>{program.program_name}</h4>
                <span className="program-type">{program.program_type}</span>
              </div>
              <div className="program-stats">
                <div className="stat">
                  <span className="stat-label">Participants</span>
                  <span className="stat-value">{program.total_participants}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Completion Rate</span>
                  <span className="stat-value">{program.completion_rate}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Avg Improvement</span>
                  <span className="stat-value">{program.avg_improvement}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Goals Met</span>
                  <span className="stat-value">{program.pct_goals_met}%</span>
                </div>
              </div>
              <div className="program-cost">
                <span>Cost per Participant: ${program.actual_cost_per_participant?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Equity Tab Component
function EquityTab({ sites }) {
  return (
    <div className="equity-tab">
      <div className="section-card">
        <h3>Equity Analysis Across Schools</h3>
        <p className="section-subtitle">Examining resource distribution and opportunity gaps</p>
        <div className="equity-table">
          <table>
            <thead>
              <tr>
                <th>School</th>
                <th>Free/Reduced Lunch</th>
                <th>ELL Students</th>
                <th>Teacher-Student Ratio</th>
                <th>Per-Pupil Spending</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site.site_id}>
                  <td>{site.site_name}</td>
                  <td>{site.pct_free_lunch}%</td>
                  <td>{site.pct_ell}%</td>
                  <td>{site.teacher_student_ratio || 'N/A'}</td>
                  <td>${site.per_pupil_spending?.toLocaleString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert-box info">
        <AlertCircle size={20} />
        <div>
          <strong>Equity Considerations</strong>
          <p>Schools with higher free/reduced lunch percentages may require additional resources to ensure equitable outcomes.</p>
        </div>
      </div>
    </div>
  )
}

// Financial Tab Component
function FinancialTab({ sites }) {
  const totalSpending = sites.reduce((sum, site) => sum + (site.per_pupil_spending * site.total_students || 0), 0)
  const avgPerPupil = sites.length > 0 ? totalSpending / sites.reduce((sum, site) => sum + site.total_students, 0) : 0

  return (
    <div className="financial-tab">
      <div className="metrics-grid">
        <div className="metric-card blue">
          <div className="metric-info">
            <p className="metric-label">Total Spending</p>
            <p className="metric-value">${totalSpending.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card green">
          <div className="metric-info">
            <p className="metric-label">Avg Per-Pupil Spending</p>
            <p className="metric-value">${avgPerPupil.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3>Spending by School</h3>
        <div className="financial-breakdown">
          {sites.map(site => (
            <div key={site.site_id} className="financial-item">
              <div className="school-info">
                <span className="school-name">{site.site_name}</span>
                <span className="student-count">{site.total_students} students</span>
              </div>
              <div className="spending-info">
                <span className="per-pupil">${site.per_pupil_spending?.toLocaleString() || 'N/A'} per student</span>
                <span className="total">${((site.per_pupil_spending || 0) * site.total_students).toLocaleString()} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
