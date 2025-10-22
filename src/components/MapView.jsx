import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Users, MapPin, Loader } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Component to handle map center changes
 */
const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), {
        animate: true,
        duration: 0.5
      });
    }
  }, [center, zoom, map]);

  return null;
};

/**
 * Custom marker icon creator
 */
const createCustomIcon = (isSelected = false, priority = 'medium') => {
  // Color based on priority
  const colors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
  };

  const color = colors[priority] || colors.medium;
  const size = isSelected ? 40 : 32;
  const iconHtml = `
    <div class="custom-marker ${isSelected ? 'marker-selected' : ''}"
         style="background: ${color}; width: ${size}px; height: ${size}px;">
      <svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-container',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

/**
 * MapView component to display sites on a map
 * Uses react-leaflet for mapping functionality
 */
const MapView = ({
  sites = [],
  selectedSite = null,
  onSiteSelect,
  loading = false
}) => {
  const mapRef = useRef(null);

  // St. Louis coordinates (default center)
  const defaultCenter = [38.6270, -90.1994];
  const defaultZoom = 12;

  // Calculate center based on sites or use default
  const getMapCenter = () => {
    if (sites.length === 0) return defaultCenter;

    // If a site is selected, center on it
    const selected = sites.find((s) => s.name === selectedSite);
    if (selected && selected.coordinates) {
      return [selected.coordinates.lat, selected.coordinates.lng];
    }

    // Otherwise, center on first site or default
    if (sites[0]?.coordinates) {
      return [sites[0].coordinates.lat, sites[0].coordinates.lng];
    }

    return defaultCenter;
  };

  const mapCenter = getMapCenter();

  // Handle marker click
  const handleMarkerClick = (site) => {
    onSiteSelect?.(site.name);
  };

  // Handle keyboard navigation for markers
  const handleMarkerKeyDown = (e, site) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMarkerClick(site);
    }
  };

  // Get site priority based on students
  const getSitePriority = (site) => {
    // This would typically be calculated from actual student data
    // For now, we'll use a simple heuristic
    if (site.highPriorityCount > 5) return 'high';
    if (site.highPriorityCount > 2) return 'medium';
    return 'low';
  };

  return (
    <div className="map-view" role="region" aria-label="Map of student sites">
      {loading && (
        <div className="map-loading-overlay" role="status" aria-live="polite">
          <Loader className="map-spinner" aria-hidden="true" />
          <span className="sr-only">Loading map...</span>
        </div>
      )}

      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={defaultZoom}
        className="map-container"
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        {/* Map Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {/* Dark theme alternative (uncomment to use) */}
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        /> */}

        {/* Map Controller for center changes */}
        <MapController center={mapCenter} zoom={defaultZoom} />

        {/* Site Markers */}
        {sites.map((site) => {
          if (!site.coordinates) return null;

          const isSelected = selectedSite === site.name;
          const priority = getSitePriority(site);

          return (
            <Marker
              key={site.name}
              position={[site.coordinates.lat, site.coordinates.lng]}
              icon={createCustomIcon(isSelected, priority)}
              eventHandlers={{
                click: () => handleMarkerClick(site),
                keypress: (e) => handleMarkerKeyDown(e, site),
              }}
              aria-label={`Site marker for ${site.name}`}
            >
              <Popup
                className="custom-popup"
                closeButton={true}
                aria-label={`Details for ${site.name}`}
              >
                <div className="popup-content">
                  <div className="popup-header">
                    <MapPin className="popup-icon" aria-hidden="true" />
                    <h3 className="popup-title">{site.name}</h3>
                  </div>

                  <div className="popup-stats">
                    <div className="popup-stat">
                      <Users size={16} aria-hidden="true" />
                      <span className="popup-stat-label">Students:</span>
                      <span className="popup-stat-value">
                        {site.studentCount || 0}
                      </span>
                    </div>

                    {site.highPriorityCount > 0 && (
                      <div className="popup-stat popup-stat-priority">
                        <span className="popup-stat-label">High Priority:</span>
                        <span className="popup-stat-value priority-badge">
                          {site.highPriorityCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {site.address && (
                    <div className="popup-address">
                      <MapPin size={14} aria-hidden="true" />
                      <span>{site.address}</span>
                    </div>
                  )}

                  <button
                    className="popup-action-btn"
                    onClick={() => handleMarkerClick(site)}
                    aria-label={`View students at ${site.name}`}
                  >
                    View Students
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend" role="complementary" aria-label="Map legend">
        <h4 className="legend-title">Site Priority</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker legend-marker-high"></div>
            <span>High Priority (5+ students)</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker legend-marker-medium"></div>
            <span>Medium Priority (2-5 students)</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker legend-marker-low"></div>
            <span>Low Priority (0-2 students)</span>
          </div>
        </div>
      </div>

      {/* Site Count Badge */}
      {sites.length > 0 && (
        <div className="map-info-badge" role="status" aria-live="polite">
          <MapPin size={16} aria-hidden="true" />
          <span>{sites.length} Sites</span>
        </div>
      )}
    </div>
  );
};

export default MapView;
