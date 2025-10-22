import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Menu, Settings } from 'lucide-react'
import { supabase, checkConnection } from './lib/supabaseClient'
import { useDashboardData } from './hooks/useDashboardData'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import StudentModal from './components/StudentModal'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const {
    sites,
    students,
    metrics,
    filters,
    updateFilters,
    selectedSite,
    setSelectedSite,
    lastUpdate,
    refresh,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = useDashboardData()

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  // Check Supabase connection on mount
  useEffect(() => {
    async function verifyConnection() {
      const isConnected = await checkConnection()
      setConnectionStatus(isConnected ? 'connected' : 'disconnected')
    }
    verifyConnection()
  }, [])

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const loadTime = performance.now()
      console.log('Dashboard loaded in:', loadTime.toFixed(2), 'ms')

      if (loadTime > 3000) {
        console.warn('⚠️  Slow load time - check network/query performance')
      }
    }
  }, [])

  // Handle authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear sensitive data on sign out
        setSelectedStudent(null)
        setShowAdminPanel(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Connection error handling
  if (connectionStatus === 'disconnected') {
    return (
      <div className="connection-error">
        <div className="error-content">
          <h2>Unable to Connect</h2>
          <p>Cannot connect to the database. Please check:</p>
          <ul>
            <li>Your internet connection</li>
            <li>Supabase project is active</li>
            <li>Environment variables are set correctly</li>
          </ul>
          <button onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  // Data error handling
  if (error && !loading) {
    return (
      <div className="data-error">
        <div className="error-content">
          <h2>Data Error</h2>
          <p>{error}</p>
          <button onClick={refresh}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Header
          metrics={metrics}
          onRefresh={refresh}
          lastUpdate={lastUpdate}
          onAdminOpen={() => setShowAdminPanel(true)}
          loading={loading}
        />

        <div className="app-content">
          <button
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label={showSidebar ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={24} />
          </button>

          <AnimatePresence>
            {showSidebar && (
              <Sidebar
                sites={sites}
                students={students}
                metrics={metrics}
                filters={filters}
                onFilterChange={updateFilters}
                onStudentSelect={setSelectedStudent}
                onSiteSelect={setSelectedSite}
                selectedSite={selectedSite}
                onCollapse={() => setShowSidebar(false)}
              />
            )}
          </AnimatePresence>

          <main className="main-content" id="main-content">
            <MapView
              sites={sites}
              selectedSite={selectedSite}
              onSiteSelect={setSelectedSite}
              loading={loading}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  className="pagination-btn"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="pagination-info" aria-live="polite">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className="pagination-btn"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </main>

          {/* Floating Admin Button */}
          <button
            className="floating-admin-btn"
            onClick={() => setShowAdminPanel(true)}
            aria-label="Open admin panel"
            title="Manage student data"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Student Detail Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <StudentModal
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          )}
        </AnimatePresence>

        {/* Admin Panel */}
        <AnimatePresence>
          {showAdminPanel && (
            <AdminPanel onClose={() => setShowAdminPanel(false)} />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}

export default App
