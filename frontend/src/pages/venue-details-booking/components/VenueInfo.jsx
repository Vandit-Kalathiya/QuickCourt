import React from 'react';
import Icon from '../../../components/AppIcon';

const VenueInfo = ({ venue }) => {
  const amenityIcons = {
    'Parking': 'Car',
    'WiFi': 'Wifi',
    'Changing Rooms': 'Users',
    'Equipment Rental': 'Package',
    'Cafeteria': 'Coffee',
    'First Aid': 'Heart',
    'Air Conditioning': 'Wind',
    'Lighting': 'Lightbulb',
    'Security': 'Shield',
    'Lockers': 'Lock'
  };

  const sportIcons = {
    'Tennis': 'Circle',
    'Basketball': 'Circle',
    'Badminton': 'Circle',
    'Football': 'Circle',
    'Cricket': 'Circle',
    'Swimming': 'Waves',
    'Gym': 'Dumbbell'
  };

  console.log(venue);

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">{venue?.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={16}
                  className={i < Math.floor(venue?.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{venue?.rating}</span>
            <span className="text-sm text-text-secondary">({venue?.reviewCount} reviews)</span>
          </div>
        </div>
        
        <p className="text-text-secondary leading-relaxed mb-6">{venue?.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={16} />
            <span>{venue?.address}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={16} />
            <span>{venue?.operatingHours || "8 AM - 10 PM"}</span>
          </div>
        </div>
      </div>
      {/* Sports Offered */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Sports Available</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {venue?.sports?.map((sport) => (
            <div key={sport} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={sportIcons?.[sport] || 'Circle'} size={16} className="text-primary" />
              </div>
              <span className="font-medium text-foreground">{sport}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Amenities */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {venue?.amenities?.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name={amenityIcons?.[amenity] || 'Check'} size={16} className="text-success" />
              </div>
              <span className="text-foreground">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Location & Map */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">Location</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="h-64 relative">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={venue?.name}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${venue?.latitude},${venue?.longitude}&z=14&output=embed`}
              className="border-0"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground mb-1">{venue?.location?.address}</p>
                <p className="text-sm text-text-secondary">{venue?.location?.city}, {venue?.location?.state} {venue?.location?.zipCode}</p>
              </div>
              <a
                href={`https://maps.google.com?q=${venue?.latitude},${venue?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Icon name="ExternalLink" size={16} />
                <span className="text-sm font-medium">Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;