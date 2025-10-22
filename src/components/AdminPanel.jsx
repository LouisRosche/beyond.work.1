import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Save, Trash2, Search, Filter } from 'lucide-react'
import { supabase, handleSupabaseError } from '../lib/supabaseClient'
import { validateStudent, prepareStudentData, ValidationError } from '../lib/validation'
import './AdminPanel.css'

export default function AdminPanel({ onClose }) {
  const [sites, setSites] = useState([])
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch sites and students
  useEffect(() => {
    fetchSites()
    fetchStudents()
  }, [])

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = students.filter(student =>
        student.first_name?.toLowerCase().includes(query) ||
        student.last_name?.toLowerCase().includes(query) ||
        student.student_id?.toLowerCase().includes(query)
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, students])

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name')

      if (error) throw error
      setSites(data || [])
    } catch (error) {
      console.error('Error fetching sites:', error)
      setMessage({ type: 'error', text: handleSupabaseError(error, 'fetching sites') })
    }
  }

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*, sites(name)')
        .order('last_name')

      if (error) throw error
      setStudents(data || [])
      setFilteredStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
      setMessage({ type: 'error', text: handleSupabaseError(error, 'fetching students') })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
    setFormData({
      student_id: student.student_id || '',
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      site_id: student.site_id || '',
      grade: student.grade || '',
      risk_score: student.risk_score || '',
      priority: student.priority || 'medium',
      attendance_rate: student.attendance_rate || '',
      homework_completion_rate: student.homework_completion_rate || '',
      reading_level: student.reading_level || '',
      math_level: student.math_level || '',
      behavioral_incidents: student.behavioral_incidents || 0,
      mentor_engagement_score: student.mentor_engagement_score || '',
      strengths: Array.isArray(student.strengths) ? student.strengths.join(', ') : '',
      concerns: Array.isArray(student.concerns) ? student.concerns.join(', ') : '',
      recommended_actions: Array.isArray(student.recommended_actions) ? student.recommended_actions.join(', ') : '',
      notes: student.notes || '',
      last_contact_date: student.last_contact_date || '',
      active: student.active !== false
    })
    setMessage({ type: '', text: '' })
  }

  const handleNewStudent = () => {
    setSelectedStudent(null)
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      site_id: sites[0]?.id || '',
      grade: '',
      risk_score: '',
      priority: 'medium',
      attendance_rate: '',
      homework_completion_rate: '',
      reading_level: '',
      math_level: '',
      behavioral_incidents: 0,
      mentor_engagement_score: '',
      strengths: '',
      concerns: '',
      recommended_actions: '',
      notes: '',
      last_contact_date: '',
      active: true
    })
    setMessage({ type: '', text: '' })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSaveStudent = async () => {
    // Prevent double-submit
    if (isSaving) return
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // Prepare and validate data
      const dataToSave = prepareStudentData(formData)

      if (selectedStudent) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(dataToSave)
          .eq('id', selectedStudent.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Student updated successfully!' })
      } else {
        // Insert new student
        const { error } = await supabase
          .from('students')
          .insert([dataToSave])

        if (error) throw error
        setMessage({ type: 'success', text: 'Student added successfully!' })
      }

      // Refresh student list
      await fetchStudents()

      // Clear form after a delay
      setTimeout(() => {
        handleNewStudent()
        setMessage({ type: '', text: '' })
      }, 2000)

    } catch (error) {
      console.error('Save error:', error)
      if (error instanceof ValidationError) {
        setMessage({ type: 'error', text: `Validation error: ${error.message}` })
      } else {
        setMessage({ type: 'error', text: handleSupabaseError(error, 'saving student') })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedStudent.first_name} ${selectedStudent.last_name}?`
    )
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', selectedStudent.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Student deleted successfully!' })
      await fetchStudents()
      handleNewStudent()

      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 2000)

    } catch (error) {
      console.error('Delete error:', error)
      setMessage({ type: 'error', text: handleSupabaseError(error, 'deleting student') })
    }
  }

  return (
    <motion.div
      className="admin-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="admin-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-header">
          <h2>Student Management</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close admin panel">
            <X size={24} />
          </button>
        </div>

        <div className="admin-content">
          {/* Student List */}
          <div className="student-list-section">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button onClick={handleNewStudent} className="new-student-btn">
              <Plus size={18} />
              New Student
            </button>

            <div className="student-list">
              {loading ? (
                <div className="loading-message">Loading students...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="empty-message">No students found</div>
              ) : (
                filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                    onClick={() => handleSelectStudent(student)}
                  >
                    <div className="student-name">
                      {student.first_name} {student.last_name}
                    </div>
                    <div className="student-id">{student.student_id}</div>
                    <div className="student-site">{student.sites?.name || 'No site'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Form */}
          <div className="student-form-section">
            <h3>{selectedStudent ? 'Edit Student' : 'New Student'}</h3>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form className="student-form" onSubmit={(e) => e.preventDefault()}>
              {/* Basic Information */}
              <div className="form-section">
                <h4>Basic Information</h4>

                <label>
                  Student ID *
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id || ''}
                    onChange={handleInputChange}
                    placeholder="STU001"
                    required
                  />
                </label>

                <label>
                  First Name *
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Last Name *
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Site *
                  <select
                    name="site_id"
                    value={formData.site_id || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a site...</option>
                    {sites.map(site => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Grade (1-12)
                  <input
                    type="number"
                    name="grade"
                    min="1"
                    max="12"
                    value={formData.grade || ''}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              {/* Metrics */}
              <div className="form-section">
                <h4>Support Metrics</h4>

                <label>
                  Support Level (0-1)
                  <input
                    type="number"
                    name="risk_score"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.risk_score || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Support Intensity
                  <select
                    name="priority"
                    value={formData.priority || 'medium'}
                    onChange={handleInputChange}
                  >
                    <option value="high">Immediate Attention</option>
                    <option value="medium">Active Support</option>
                    <option value="low">Monitoring</option>
                  </select>
                </label>

                <label>
                  Attendance Rate (%)
                  <input
                    type="number"
                    name="attendance_rate"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.attendance_rate || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Homework Completion (%)
                  <input
                    type="number"
                    name="homework_completion_rate"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.homework_completion_rate || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Reading Level
                  <input
                    type="number"
                    name="reading_level"
                    min="0"
                    step="0.1"
                    value={formData.reading_level || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Math Level
                  <input
                    type="number"
                    name="math_level"
                    min="0"
                    step="0.1"
                    value={formData.math_level || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Support Check-ins
                  <input
                    type="number"
                    name="behavioral_incidents"
                    min="0"
                    value={formData.behavioral_incidents || 0}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Engagement Score (0-5)
                  <input
                    type="number"
                    name="mentor_engagement_score"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.mentor_engagement_score || ''}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              {/* Support Information */}
              <div className="form-section">
                <h4>Support Information</h4>

                <label>
                  Strengths (comma-separated)
                  <textarea
                    name="strengths"
                    value={formData.strengths || ''}
                    onChange={handleInputChange}
                    placeholder="Creative writing, Leadership, Sports"
                    rows="2"
                  />
                </label>

                <label>
                  Areas for Growth (comma-separated)
                  <textarea
                    name="concerns"
                    value={formData.concerns || ''}
                    onChange={handleInputChange}
                    placeholder="Reading fluency, Attendance"
                    rows="2"
                  />
                </label>

                <label>
                  Support Strategies (comma-separated)
                  <textarea
                    name="recommended_actions"
                    value={formData.recommended_actions || ''}
                    onChange={handleInputChange}
                    placeholder="Weekly check-ins, Math tutoring"
                    rows="2"
                  />
                </label>

                <label>
                  Notes
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </label>

                <label>
                  Last Contact Date
                  <input
                    type="date"
                    name="last_contact_date"
                    value={formData.last_contact_date || ''}
                    onChange={handleInputChange}
                  />
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active || false}
                    onChange={handleInputChange}
                  />
                  Active Student
                </label>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleSaveStudent}
                  className="save-btn"
                  disabled={isSaving}
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Student'}
                </button>

                {selectedStudent && (
                  <button
                    type="button"
                    onClick={handleDeleteStudent}
                    className="delete-btn"
                    disabled={isSaving}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
