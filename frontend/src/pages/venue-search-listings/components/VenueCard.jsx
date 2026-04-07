import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VenueCard = ({ venue }) => {
  const [isFavorited, setIsFavorited] = useState(venue?.isFavorited || false);
  const navigate = useNavigate();

  const handleFavoriteToggle = (e) => {
    e?.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleCardClick = () => {
    navigate(`/venue-booking?id=${venue?.id}`);
  };

  const handleQuickBook = (e) => {
    e?.stopPropagation();
    navigate(`/venue-booking?id=${venue?.id}&quickbook=true`);
  };

  const renderStars = (rating) => {
    return [...Array(5)]?.map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={i < Math.floor(rating) ? 'text-accent fill-current' : 'text-muted'}
      />
    ));
  };

  const formatSports = (sports) => {
    if (sports?.length <= 2) {
      return sports?.join(', ');
    }
    return `${sports?.slice(0, 2)?.join(', ')} +${sports?.length - 2} more`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-medium transition-smooth cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={venue?.image}
          alt={venue?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-smooth"
        >
          <Icon
            name="Heart"
            size={16}
            className={
              isFavorited ? "text-error fill-current" : "text-text-secondary"
            }
          />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleQuickBook}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            Quick Book
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {venue?.isVerified && (
            <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-medium">
              Verified
            </span>
          )}
          {venue?.isPopular && (
            <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
              Popular
            </span>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-smooth">
            {venue?.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon name="MapPin" size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">
              {venue?.distance}
            </span>
          </div>
        </div>

        {/* Sports */}
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Activity" size={14} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">
            {formatSports(venue?.sports)}
          </span>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(venue?.rating || 4)}
          </div>
          <span className="text-sm font-medium text-foreground">
            {venue?.rating}
          </span>
          <span className="text-sm text-text-secondary">
            ({venue?.reviewCount} reviews)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-3 mb-4">
          {venue?.amenities?.slice(0, 3)?.map((amenity) => (
            <div key={amenity?.id} className="flex items-center space-x-1">
              <Icon
                name={amenity?.icon}
                size={14}
                className="text-text-secondary"
              />
              <span className="text-xs text-text-secondary">
                {amenity?.name}
              </span>
            </div>
          ))}
          {venue?.amenities?.length > 3 && (
            <span className="text-xs text-text-secondary">
              +{venue?.amenities?.length - 3} more
            </span>
          )}
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ₹ {venue?.startingPrice}
            </span>
            <span className="text-sm text-text-secondary">/hour</span>
          </div>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${
                venue?.availability === "available"
                  ? "bg-success"
                  : venue?.availability === "limited"
                  ? "bg-warning"
                  : "bg-error"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                venue?.availability === "available"
                  ? "text-success"
                  : venue?.availability === "limited"
                  ? "text-warning"
                  : "text-error"
              }`}
            >
              {venue?.availability === "available"
                ? "Available"
                : venue?.availability === "limited"
                ? "Limited"
                : "Busy"}
            </span>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex items-center space-x-1 mt-2">
          <Icon name="Clock" size={12} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">
            Open {venue?.openingHours?.start} - {venue?.openingHours?.end}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;