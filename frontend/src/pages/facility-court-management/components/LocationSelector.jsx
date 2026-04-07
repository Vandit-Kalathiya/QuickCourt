import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom draggable marker component
function DraggableMarker({ position, onPositionChange }) {
  const [draggable, setDraggable] = useState(true);
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPosition = marker.getLatLng();
          onPositionChange(newPosition);
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
    </Marker>
  );
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const LocationSelector = ({ onLocationChange, initialLocation = null }) => {
  const [position, setPosition] = useState(initialLocation || [51.505, -0.09]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    } else {
      setLoading(false);
    }
  }, [initialLocation]);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        setPosition(newPosition);
        onLocationChange({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location. Please select manually on the map.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handlePositionChange = useCallback(
    (newPosition) => {
      setPosition([newPosition.lat, newPosition.lng]);
      onLocationChange({ lat: newPosition.lat, lng: newPosition.lng });
    },
    [onLocationChange]
  );

  const handleMapClick = useCallback(
    (latlng) => {
      handlePositionChange(latlng);
    },
    [handlePositionChange]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-text-secondary">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Click on the map or drag the marker to set location
        </p>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Use Current Location
        </button>
      </div>

      <div className="h-64 w-full rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker
            position={position}
            onPositionChange={handlePositionChange}
          />
          <MapClickHandler onLocationSelect={handleMapClick} />
        </MapContainer>
      </div>

      <div className="bg-muted/10 rounded-lg p-3">
        <p className="text-xs text-text-secondary">
          Selected Location: <span className="font-mono">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;
