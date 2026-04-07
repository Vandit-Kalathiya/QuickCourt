import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ venues, onVenueSelect, selectedVenue }) => {
  console.log(venues)
  const [mapCenter] = useState({ lat: venues.latitude, lng: venues.longitude });

  const handleMarkerClick = (venue) => {
    onVenueSelect(venue);
  };

  const renderVenueMarkers = () => {
    return venues?.map((venue, index) => (
      <div
        key={venue?.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
          selectedVenue?.id === venue?.id ? 'z-20 scale-110' : 'z-10'
        }`}
        style={{
          left: `${20 + (index % 5) * 15}%`,
          top: `${25 + Math.floor(index / 5) * 20}%`
        }}
        onClick={() => handleMarkerClick(venue)}
      >
        <div className={`relative ${selectedVenue?.id === venue?.id ? 'animate-bounce' : ''}`}>
          {/* Marker Pin */}
          <div className={`w-8 h-8 rounded-full border-2 border-white shadow-medium flex items-center justify-center ${
            selectedVenue?.id === venue?.id ? 'bg-primary' : 'bg-accent'
          }`}>
            <Icon 
              name="MapPin" 
              size={16} 
              color="white"
            />
          </div>
          
          {/* Price Badge */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface border border-border rounded px-2 py-1 shadow-medium whitespace-nowrap">
            <span className="text-xs font-semibold text-primary">${venue?.startingPrice}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="w-full h-full relative">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Venue Locations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`}
          className="absolute inset-0"
        />
        
        {/* Custom Venue Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full pointer-events-auto">
            {renderVenueMarkers()}
          </div>
        </div>
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-surface border border-border shadow-medium"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-surface border border-border shadow-medium"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-surface border border-border shadow-medium"
        >
          <Icon name="Locate" size={16} />
        </Button>
      </div>
      {/* Selected Venue Info Card */}
      {selectedVenue && (
        <div className="absolute bottom-4 left-4 right-4 bg-surface border border-border rounded-lg shadow-medium p-4 max-w-sm mx-auto">
          <div className="flex items-start space-x-3">
            <img
              src={selectedVenue?.image}
              alt={selectedVenue?.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{selectedVenue?.name}</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="Star" size={14} className="text-accent fill-current" />
                <span className="text-sm text-foreground">{selectedVenue?.rating}</span>
                <span className="text-sm text-text-secondary">({selectedVenue?.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-primary">${selectedVenue?.startingPrice}/hr</span>
                <Button
                  size="sm"
                  onClick={() => window.location.href = `/venue-booking?id=${selectedVenue?.id}`}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-surface border border-border rounded-lg p-3 shadow-medium">
        <h4 className="font-semibold text-foreground text-sm mb-2">Map Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded-full"></div>
            <span className="text-xs text-text-secondary">Available Venues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full"></div>
            <span className="text-xs text-text-secondary">Selected Venue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;