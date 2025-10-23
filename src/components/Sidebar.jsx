import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar component for filtering and selecting students
 * Includes site filter, priority filters, search, and student list
 */
const Sidebar = ({
  sites = [],
  students = [],
  metrics = {},
  filters = {},
  onFilterChange,
  onStudentSelect,
  onSiteSelect,
  selectedSite = null,
  onCollapse
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const siteDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        siteDropdownRef.current &&
        !siteDropdownRef.current.contains(event.target)
      ) {
        setSiteDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter students based on search term, priority filters, and selected site
  const filteredStudents = students.filter((student) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        student.name?.toLowerCase().includes(searchLower) ||
        student.grade?.toString().includes(searchLower) ||
        student.site?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(student.priority)) return false;
    }

    // Site filter
    if (selectedSite && selectedSite !== 'all') {
      if (student.site_id !== selectedSite) return false;
    }

    return true;
  });

  // Handle priority checkbox changes
  const handlePriorityToggle = (priority) => {
    const currentPriorities = filters.priorities || [];
    let newPriorities;

    if (currentPriorities.includes(priority)) {
      newPriorities = currentPriorities.filter((p) => p !== priority);
    } else {
      newPriorities = [...currentPriorities, priority];
    }

    onFilterChange?.({ ...filters, priorities: newPriorities });
  };

  // Handle site selection
  const handleSiteSelect = (siteId) => {
    onSiteSelect?.(siteId);
    setSiteDropdownOpen(false);
  };

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  // Get priority icon and color
  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'priority-high',
          label: 'High Priority'
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: 'priority-medium',
          label: 'Medium Priority'
        };
      case 'low':
        return {
          icon: CheckCircle,
          color: 'priority-low',
          label: 'Low Priority'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'priority-medium',
          label: 'Unknown Priority'
        };
    }
  };

  // Get selected site name
  const selectedSiteName = selectedSite === 'all' || !selectedSite
    ? 'All Sites'
    : sites.find((s) => s.id === selectedSite)?.name || 'Selected Site';

  // Count students by priority
  const priorityCounts = {
    high: students.filter((s) => s.priority === 'high').length,
    medium: students.filter((s) => s.priority === 'medium').length,
    low: students.filter((s) => s.priority === 'low').length
  };

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      role="complementary"
      aria-label="Student filters and list"
    >
      {/* Collapse Toggle Button */}
      <button
        className="sidebar-collapse-btn"
        onClick={handleCollapseToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="sidebar-content">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title-section">
            <h2 className="sidebar-title">Filters</h2>
          </div>
          <div className="student-count" aria-live="polite">
            {filteredStudents.length} of {students.length}
          </div>
        </div>

        {/* Site Filter Dropdown */}
        <div className="filter-section">
          <label htmlFor="site-select" className="filter-label">
            Site Location
          </label>
          <div className="site-dropdown" ref={siteDropdownRef}>
            <button
              id="site-select"
              className="site-dropdown-toggle"
              onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={siteDropdownOpen}
            >
              <MapPin size={16} aria-hidden="true" />
              <span className="site-dropdown-text">{selectedSiteName}</span>
              <ChevronDown
                size={16}
                className={siteDropdownOpen ? 'rotate-180' : ''}
                aria-hidden="true"
              />
            </button>

            {siteDropdownOpen && (
              <ul
                className="site-dropdown-menu"
                role="listbox"
                aria-label="Site selection"
              >
                <li role="option" aria-selected={selectedSite === 'all' || !selectedSite}>
                  <button
                    className={`site-option ${
                      selectedSite === 'all' || !selectedSite ? 'selected' : ''
                    }`}
                    onClick={() => handleSiteSelect('all')}
                  >
                    <MapPin size={14} aria-hidden="true" />
                    <span>All Sites</span>
                    <span className="site-count">{students.length}</span>
                  </button>
                </li>
                {sites.map((site) => (
                  <li
                    key={site.id}
                    role="option"
                    aria-selected={selectedSite === site.id}
                  >
                    <button
                      className={`site-option ${
                        selectedSite === site.id ? 'selected' : ''
                      }`}
                      onClick={() => handleSiteSelect(site.id)}
                    >
                      <MapPin size={14} aria-hidden="true" />
                      <span>{site.name}</span>
                      <span className="site-count">{site.studentCount || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Priority Filters */}
        <div className="filter-section">
          <div className="filter-label">Priority Level</div>
          <div className="priority-filters" role="group" aria-label="Priority filters">
            {['high', 'medium', 'low'].map((priority) => {
              const { icon: Icon, color, label } = getPriorityDisplay(priority);
              const isChecked = filters.priorities?.includes(priority) ?? true;

              return (
                <label
                  key={priority}
                  className={`priority-checkbox ${color}`}
                  htmlFor={`priority-${priority}`}
                >
                  <input
                    type="checkbox"
                    id={`priority-${priority}`}
                    checked={isChecked}
                    onChange={() => handlePriorityToggle(priority)}
                    aria-label={`Filter ${label} students`}
                  />
                  <Icon size={16} className="priority-icon" aria-hidden="true" />
                  <span className="priority-label">{label}</span>
                  <span className="priority-count">{priorityCounts[priority]}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Search Box */}
        <div className="filter-section">
          <label htmlFor="student-search" className="filter-label">
            Search Students
          </label>
          <div className="search-box">
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="student-search"
              type="text"
              className="search-input"
              placeholder="Name, grade, or site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search students by name, grade, or site"
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Student List */}
        <div className="student-list-section">
          <div className="student-list-header">
            <span className="filter-label">Students</span>
            <span className="student-list-count" aria-live="polite">
              {filteredStudents.length}
            </span>
          </div>

          <div
            className="student-list"
            role="list"
            aria-label="Filtered student list"
          >
            {filteredStudents.length === 0 ? (
              <div className="empty-state" role="status">
                <Search size={32} aria-hidden="true" />
                <p>No students found</p>
                <small>Try adjusting your filters</small>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const { icon: Icon, color } = getPriorityDisplay(student.priority);

                return (
                  <button
                    key={student.id}
                    className="student-item"
                    onClick={() => onStudentSelect?.(student)}
                    role="listitem"
                    aria-label={`View details for ${student.name}, grade ${student.grade}, ${student.priority} priority`}
                  >
                    <div className={`student-priority-indicator ${color}`}>
                      <Icon size={14} aria-hidden="true" />
                    </div>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                      <div className="student-meta">
                        <span>Grade {student.grade}</span>
                        <span className="meta-separator">•</span>
                        <span>{student.site}</span>
                      </div>
                    </div>
                    <div className="student-metrics">
                      <div className="metric-badge">
                        <span className="metric-value">
                          {student.attendance?.toFixed(0) || 0}%
                        </span>
                        <span className="metric-label-small">Att.</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
