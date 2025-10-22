import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, handleSupabaseError } from '../lib/supabaseClient'

const STUDENTS_PER_PAGE = 50

export function useDashboardData() {
  const [sites, setSites] = useState([])
  const [students, setStudents] = useState([])
  const [selectedSite, setSelectedSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const [filters, setFilters] = useState({
    showHigh: true,
    showMedium: true,
    showLow: true,
    searchQuery: ''
  })
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const subscriptionsRef = useRef([])

  // Calculate metrics from current data
  const metrics = {
    totalStudents: students.length,
    highPriority: students.filter(s => s.priority === 'high').length,
    mediumPriority: students.filter(s => s.priority === 'medium').length,
    lowPriority: students.filter(s => s.priority === 'low').length,
    avgAttendance: students.length > 0
      ? (students.reduce((sum, s) => sum + (s.attendance_rate || 0), 0) / students.length).toFixed(1)
      : 0,
    avgEngagement: students.length > 0
      ? (students.reduce((sum, s) => sum + (s.mentor_engagement_score || 0), 0) / students.length).toFixed(1)
      : 0
  }

  // Fetch dashboard data with pagination
  const fetchDashboardData = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch sites
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('*')
        .order('name')

      if (sitesError) throw sitesError
      setSites(sitesData || [])

      // Build student query with filters
      let query = supabase
        .from('students')
        .select('*', { count: 'exact' })
        .eq('active', true)

      // Apply site filter
      if (selectedSite) {
        query = query.eq('site_id', selectedSite)
      }

      // Apply priority filters
      const priorityFilters = []
      if (filters.showHigh) priorityFilters.push('high')
      if (filters.showMedium) priorityFilters.push('medium')
      if (filters.showLow) priorityFilters.push('low')

      if (priorityFilters.length > 0 && priorityFilters.length < 3) {
        query = query.in('priority', priorityFilters)
      }

      // Apply search filter
      if (filters.searchQuery) {
        query = query.or(`first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,student_id.ilike.%${filters.searchQuery}%`)
      }

      // Apply pagination
      const start = (page - 1) * STUDENTS_PER_PAGE
      const end = start + STUDENTS_PER_PAGE - 1

      query = query
        .range(start, end)
        .order('priority', { ascending: false })
        .order('last_name')

      const { data: studentsData, error: studentsError, count } = await query

      if (studentsError) throw studentsError

      setStudents(studentsData || [])
      setTotalStudents(count || 0)
      setCurrentPage(page)
      setLastUpdate(new Date())

    } catch (err) {
      const errorMessage = handleSupabaseError(err, 'fetching dashboard data')
      setError(errorMessage)
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedSite, filters])

  // Set up real-time subscriptions
  useEffect(() => {
    // Clean up existing subscriptions
    subscriptionsRef.current.forEach(sub => {
      supabase.removeChannel(sub)
    })
    subscriptionsRef.current = []

    // Subscribe to sites changes
    const sitesSubscription = supabase
      .channel('sites-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sites' }, () => {
        fetchDashboardData(currentPage)
      })
      .subscribe()

    // Subscribe to students changes
    const studentsSubscription = supabase
      .channel('students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchDashboardData(currentPage)
      })
      .subscribe()

    subscriptionsRef.current = [sitesSubscription, studentsSubscription]

    // Cleanup on unmount
    return () => {
      subscriptionsRef.current.forEach(sub => {
        supabase.removeChannel(sub)
      })
      subscriptionsRef.current = []
    }
  }, [fetchDashboardData, currentPage])

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData(1)
  }, [fetchDashboardData])

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Pagination helpers
  const totalPages = Math.ceil(totalStudents / STUDENTS_PER_PAGE)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      fetchDashboardData(currentPage + 1)
    }
  }, [hasNextPage, currentPage, fetchDashboardData])

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      fetchDashboardData(currentPage - 1)
    }
  }, [hasPrevPage, currentPage, fetchDashboardData])

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      fetchDashboardData(page)
    }
  }, [totalPages, fetchDashboardData])

  const refresh = useCallback(() => {
    fetchDashboardData(currentPage)
  }, [currentPage, fetchDashboardData])

  return {
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
    totalStudents,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage,
    hasPrevPage
  }
}
