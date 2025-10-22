import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Target,
  BookOpen,
  Activity,
  Clock
} from 'lucide-react';
import './StudentModal.css';

/**
 * StudentModal component to display full student details
 * Uses framer-motion for smooth animations
 */
const StudentModal = ({ student, onClose }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!student) return;

    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    // Trap focus within modal
    const handleTabKey = (e) => {
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [student, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Don't render if no student
  if (!student) return null;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Helper functions
  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'high':
        return { icon: AlertTriangle, color: 'priority-high', label: 'High Priority' };
      case 'medium':
        return { icon: Target, color: 'priority-medium', label: 'Medium Priority' };
      case 'low':
        return { icon: CheckCircle, color: 'priority-low', label: 'Low Priority' };
      default:
        return { icon: Target, color: 'priority-medium', label: 'Unknown' };
    }
  };

  const getMetricStatus = (value, threshold = 75) => {
    if (value >= threshold) return 'success';
    if (value >= 50) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const { icon: PriorityIcon, color: priorityColor, label: priorityLabel } =
    getPriorityDisplay(student.priority);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          ref={modalRef}
          className="modal-container"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="modal-header">
            <div className="modal-header-content">
              <div className={`modal-priority-badge ${priorityColor}`}>
                <PriorityIcon size={20} aria-hidden="true" />
              </div>
              <div className="modal-header-text">
                <h2 id="modal-title" className="modal-title">
                  {student.name}
                </h2>
                <div className="modal-subtitle">
                  <span>Grade {student.grade}</span>
                  <span className="subtitle-separator">•</span>
                  <span>{student.site}</span>
                  <span className="subtitle-separator">•</span>
                  <span className={priorityColor}>{priorityLabel}</span>
                </div>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close student details"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            {/* Basic Information */}
            <section className="modal-section">
              <h3 className="section-title">
                <User size={18} aria-hidden="true" />
                Student Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <Calendar className="info-icon" size={16} aria-hidden="true" />
                  <div className="info-content">
                    <span className="info-label">Enrollment Date</span>
                    <span className="info-value">
                      {formatDate(student.enrollmentDate)}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin className="info-icon" size={16} aria-hidden="true" />
                  <div className="info-content">
                    <span className="info-label">Site Location</span>
                    <span className="info-value">{student.site}</span>
                  </div>
                </div>
                {student.lastContact && (
                  <div className="info-item">
                    <Clock className="info-icon" size={16} aria-hidden="true" />
                    <div className="info-content">
                      <span className="info-label">Last Contact</span>
                      <span className="info-value">
                        {formatDate(student.lastContact)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Metrics */}
            <section className="modal-section">
              <h3 className="section-title">
                <Activity size={18} aria-hidden="true" />
                Performance Metrics
              </h3>
              <div className="metrics-grid">
                <div className="metric-card-modal">
                  <div className="metric-header">
                    <TrendingUp
                      className={`metric-icon-modal ${
                        getMetricStatus(student.attendance || 0)
                      }`}
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="metric-label-modal">Attendance</span>
                  </div>
                  <div className="metric-value-modal">
                    {student.attendance?.toFixed(1) || 0}%
                  </div>
                  <div className="metric-bar">
                    <div
                      className={`metric-bar-fill ${
                        getMetricStatus(student.attendance || 0)
                      }`}
                      style={{ width: `${student.attendance || 0}%` }}
                      role="progressbar"
                      aria-valuenow={student.attendance || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="metric-card-modal">
                  <div className="metric-header">
                    <BookOpen
                      className={`metric-icon-modal ${
                        getMetricStatus(student.engagement || 0)
                      }`}
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="metric-label-modal">Engagement</span>
                  </div>
                  <div className="metric-value-modal">
                    {student.engagement?.toFixed(1) || 0}%
                  </div>
                  <div className="metric-bar">
                    <div
                      className={`metric-bar-fill ${
                        getMetricStatus(student.engagement || 0)
                      }`}
                      style={{ width: `${student.engagement || 0}%` }}
                      role="progressbar"
                      aria-valuenow={student.engagement || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                {student.academicPerformance && (
                  <div className="metric-card-modal">
                    <div className="metric-header">
                      <Award
                        className={`metric-icon-modal ${
                          getMetricStatus(student.academicPerformance)
                        }`}
                        size={20}
                        aria-hidden="true"
                      />
                      <span className="metric-label-modal">Academic</span>
                    </div>
                    <div className="metric-value-modal">
                      {student.academicPerformance?.toFixed(1)}%
                    </div>
                    <div className="metric-bar">
                      <div
                        className={`metric-bar-fill ${
                          getMetricStatus(student.academicPerformance)
                        }`}
                        style={{ width: `${student.academicPerformance}%` }}
                        role="progressbar"
                        aria-valuenow={student.academicPerformance}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Strengths */}
            {student.strengths && student.strengths.length > 0 && (
              <section className="modal-section">
                <h3 className="section-title">
                  <CheckCircle size={18} aria-hidden="true" />
                  Strengths
                </h3>
                <ul className="list-items list-success" role="list">
                  {student.strengths.map((strength, index) => (
                    <li key={index} className="list-item">
                      <CheckCircle size={16} aria-hidden="true" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Concerns */}
            {student.concerns && student.concerns.length > 0 && (
              <section className="modal-section">
                <h3 className="section-title">
                  <AlertTriangle size={18} aria-hidden="true" />
                  Areas of Concern
                </h3>
                <ul className="list-items list-warning" role="list">
                  {student.concerns.map((concern, index) => (
                    <li key={index} className="list-item">
                      <AlertTriangle size={16} aria-hidden="true" />
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Recommended Actions */}
            {student.recommendedActions && student.recommendedActions.length > 0 && (
              <section className="modal-section">
                <h3 className="section-title">
                  <Target size={18} aria-hidden="true" />
                  Recommended Actions
                </h3>
                <ul className="list-items list-primary" role="list">
                  {student.recommendedActions.map((action, index) => (
                    <li key={index} className="list-item">
                      <Target size={16} aria-hidden="true" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Notes/Additional Info */}
            {student.notes && (
              <section className="modal-section">
                <h3 className="section-title">
                  <BookOpen size={18} aria-hidden="true" />
                  Notes
                </h3>
                <div className="notes-content">
                  <p>{student.notes}</p>
                </div>
              </section>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              className="modal-action-btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="modal-action-btn btn-primary"
              onClick={() => {
                // This would typically trigger an edit action
                console.log('Edit student:', student.id);
              }}
            >
              Edit Student
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentModal;
