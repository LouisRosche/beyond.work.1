import React from 'react';
import { RefreshCw, Settings, Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import './Header.css';

/**
 * Header component for the Mission St. Louis dashboard
 * Displays metrics, refresh button, admin panel button, and last update timestamp
 */
const Header = ({
  metrics = {},
  onRefresh,
  lastUpdate,
  onAdminOpen,
  loading = false
}) => {
  // Default metrics if not provided
  const {
    totalStudents = 0,
    highPriority = 0,
    avgAttendance = 0,
    avgEngagement = 0
  } = metrics;

  // Format last update time
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle keyboard navigation for buttons
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback?.();
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        {/* Logo and Title Section */}
        <div className="header-brand">
          <div className="brand-logo">
            <Activity className="logo-icon" aria-hidden="true" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Mission St. Louis</h1>
            <p className="brand-subtitle">Student Support Dashboard</p>
          </div>
        </div>

        {/* Metrics Display */}
        <div className="header-metrics" role="region" aria-label="Dashboard metrics">
          <div className="metric-card">
            <div className="metric-icon metric-icon-primary">
              <Users size={20} aria-hidden="true" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Total Students</div>
              <div className="metric-value" aria-live="polite">
                {loading ? '...' : totalStudents.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-icon-danger">
              <AlertTriangle size={20} aria-hidden="true" />
            </div>
            <div className="metric-content">
              <div className="metric-label">High Priority</div>
              <div className="metric-value metric-value-danger" aria-live="polite">
                {loading ? '...' : highPriority.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-icon-success">
              <TrendingUp size={20} aria-hidden="true" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Avg Attendance</div>
              <div className="metric-value" aria-live="polite">
                {loading ? '...' : `${avgAttendance.toFixed(1)}%`}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon metric-icon-info">
              <Activity size={20} aria-hidden="true" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Avg Engagement</div>
              <div className="metric-value" aria-live="polite">
                {loading ? '...' : `${avgEngagement.toFixed(1)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="header-actions">
          {/* Last Update Timestamp */}
          <div className="last-update" aria-live="polite" aria-atomic="true">
            <span className="last-update-label">Last updated:</span>
            <span className="last-update-time">{formatLastUpdate(lastUpdate)}</span>
          </div>

          {/* Refresh Button */}
          <button
            className={`header-btn refresh-btn ${loading ? 'loading' : ''}`}
            onClick={onRefresh}
            onKeyDown={(e) => handleKeyDown(e, onRefresh)}
            disabled={loading}
            aria-label="Refresh dashboard data"
            title="Refresh dashboard data"
          >
            <RefreshCw
              size={18}
              className={loading ? 'spin' : ''}
              aria-hidden="true"
            />
            <span className="btn-text">Refresh</span>
          </button>

          {/* Admin Panel Button */}
          <button
            className="header-btn admin-btn"
            onClick={onAdminOpen}
            onKeyDown={(e) => handleKeyDown(e, onAdminOpen)}
            aria-label="Open admin panel"
            title="Open admin panel"
          >
            <Settings size={18} aria-hidden="true" />
            <span className="btn-text">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
