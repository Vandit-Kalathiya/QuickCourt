import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";

const FilterPanel = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  isMobile,
  sportCounts = {}, // Add this prop
  amenityCounts = {},
  priceRange = { min: 0, max: 200 },
}) => {
  const [expandedSections, setExpandedSections] = useState({
    sport: true,
    price: true,
    venueType: true,
    location: true,
    rating: true,
    amenities: true,
  });

  const sportTypes = [
    { id: "tennis", label: "Tennis", count: sportCounts.tennis || 0 },
    { id: "badminton", label: "Badminton", count: sportCounts.badminton || 0 },
    {
      id: "basketball",
      label: "Basketball",
      count: sportCounts.basketball || 0,
    },
    { id: "football", label: "Football", count: sportCounts.football || 0 },
    { id: "cricket", label: "Cricket", count: sportCounts.cricket || 0 },
    { id: "swimming", label: "Swimming", count: sportCounts.swimming || 0 },
    { id: "squash", label: "Squash", count: sportCounts.squash || 0 },
    {
      id: "volleyball",
      label: "Volleyball",
      count: sportCounts.volleyball || 0,
    },
  ];

  // const venueTypes = [
  //   { id: 'indoor', label: 'Indoor Courts', count: 89 },
  //   { id: 'outdoor', label: 'Outdoor Courts', count: 76 },
  //   { id: 'covered', label: 'Covered Courts', count: 34 },
  //   { id: 'synthetic', label: 'Synthetic Surface', count: 42 }
  // ];

  const amenities = [
    {
      id: "parking",
      label: "Parking Available",
      count: amenityCounts.parking || 0,
    },
    { id: "locker", label: "Locker Rooms", count: amenityCounts.locker || 0 },
    {
      id: "shower",
      label: "Shower Facilities",
      count: amenityCounts.shower || 0,
    },
    {
      id: "equipment",
      label: "Equipment Rental",
      count: amenityCounts.equipment || 0,
    },
    {
      id: "cafeteria",
      label: "Cafeteria",
      count: amenityCounts.cafeteria || 0,
    },
    {
      id: "pro-shop",
      label: "Pro Shop",
      count: amenityCounts["pro-shop"] || 0,
    },
    {
      id: "coaching",
      label: "Coaching Available",
      count: amenityCounts.coaching || 0,
    },
    { id: "wifi", label: "Free WiFi", count: amenityCounts.wifi || 0 },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev?.[section],
    }));
  };

  const handleSportChange = (sportId, checked) => {
    const updatedSports = checked
      ? [...filters?.sports, sportId]
      : filters?.sports?.filter((s) => s !== sportId);

    onFiltersChange({ ...filters, sports: updatedSports });
  };

  const handleVenueTypeChange = (typeId, checked) => {
    const updatedTypes = checked
      ? [...filters?.venueTypes, typeId]
      : filters?.venueTypes?.filter((t) => t !== typeId);

    onFiltersChange({ ...filters, venueTypes: updatedTypes });
  };

  const handleAmenityChange = (amenityId, checked) => {
    const updatedAmenities = checked
      ? [...filters?.amenities, amenityId]
      : filters?.amenities?.filter((a) => a !== amenityId);

    onFiltersChange({ ...filters, amenities: updatedAmenities });
  };

  const handlePriceChange = (field, value) => {
    onFiltersChange({
      ...filters,
      priceRange: { ...filters?.priceRange, [field]: value },
    });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sports: [],
      priceRange: { min: 0, max: 200 },
      venueTypes: [],
      location: { radius: 25, coordinates: null },
      minRating: 0,
      amenities: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters?.sports?.length +
      filters?.venueTypes?.length +
      filters?.amenities?.length +
      (filters?.minRating > 0 ? 1 : 0) +
      (filters?.priceRange?.min > 0 || filters?.priceRange?.max < 200 ? 1 : 0)
    );
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Icon
          name={expandedSections?.[section] ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-text-secondary"
        />
      </button>
      {expandedSections?.[section] && children}
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-text-secondary"
          >
            Clear All
          </Button>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* Sport Type Filter */}
      <FilterSection title="Sport Type" section="sport">
        <div className="space-y-2">
          {sportTypes?.map((sport) => (
            <div key={sport?.id} className="flex items-center justify-between">
              <Checkbox
                label={sport?.label}
                checked={filters?.sports?.includes(sport?.id)}
                onChange={(e) =>
                  handleSportChange(sport?.id, e?.target?.checked)
                }
              />
              <span className="text-sm text-text-secondary">
                ({sport?.count})
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range (per hour)" section="price">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              label="Min"
              value={filters?.priceRange?.min}
              onChange={(e) =>
                handlePriceChange(
                  "min",
                  parseInt(e?.target?.value) || priceRange.min
                )
              }
              className="flex-1"
              min={priceRange.min}
              max={priceRange.max}
              placeholder={`Min ₹${priceRange.min}`}
            />
            <Input
              type="number"
              label="Max"
              value={filters?.priceRange?.max}
              onChange={(e) =>
                handlePriceChange(
                  "max",
                  parseInt(e?.target?.value) || priceRange.max
                )
              }
              className="flex-1"
              min={priceRange.min}
              max={priceRange.max}
              placeholder={`Max ₹${priceRange.max}`}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>₹ {filters?.priceRange?.min || priceRange.min}</span>
            <span>₹ {filters?.priceRange?.max || priceRange.max}</span>
          </div>

          {/* Optional: Show the actual range from venues */}
          <div className="text-xs text-text-secondary text-center">
            Available range: ₹{priceRange.min} - ₹{priceRange.max}
          </div>
        </div>
      </FilterSection>

      {/* Venue Type Filter */}
      {/* <FilterSection title="Venue Type" section="venueType">
        <div className="space-y-2">
          {venueTypes?.map((type) => (
            <div key={type?.id} className="flex items-center justify-between">
              <Checkbox
                label={type?.label}
                checked={filters?.venueTypes?.includes(type?.id)}
                onChange={(e) => handleVenueTypeChange(type?.id, e?.target?.checked)}
              />
              <span className="text-sm text-text-secondary">({type?.count})</span>
            </div>
          ))}
        </div>
      </FilterSection> */}

      {/* Location Filter */}
      <FilterSection title="Location" section="location">
        <div className="space-y-3">
          <Input
            type="number"
            label="Radius (miles)"
            value={filters?.location?.radius}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                location: {
                  ...filters?.location,
                  radius: parseInt(e?.target?.value) || 25,
                },
              })
            }
            min="1"
            max="100"
          />
          <Button variant="outline" size="sm" className="w-full">
            <Icon name="MapPin" size={16} className="mr-2" />
            Use Current Location
          </Button>
        </div>
      </FilterSection>

      {/* Rating Filter
      <FilterSection title="Minimum Rating" section="rating">
        <div className="space-y-2">
          {[4, 3, 2, 1]?.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-smooth ${
                filters?.minRating === rating
                  ? "bg-primary/10 border border-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={16}
                    className={
                      i < rating ? "text-accent fill-current" : "text-muted"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-foreground">{rating}+ Stars</span>
            </button>
          ))}
        </div>
      </FilterSection> */}

      {/* Amenities Filter */}
      <FilterSection title="Amenities" section="amenities">
        <div className="space-y-2">
          {amenities?.map((amenity) => (
            <div
              key={amenity?.id}
              className="flex items-center justify-between"
            >
              <Checkbox
                label={amenity?.label}
                checked={filters?.amenities?.includes(amenity?.id)}
                onChange={(e) =>
                  handleAmenityChange(amenity?.id, e?.target?.checked)
                }
              />
              <span className="text-sm text-text-secondary">
                ({amenity?.count})
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Apply Button (Mobile) */}
      {isMobile && (
        <div className="sticky bottom-0 bg-surface border-t border-border p-4 -mx-6 -mb-6">
          <Button onClick={onClose} className="w-full">
            Apply Filters ({getActiveFilterCount()})
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        )}

        {/* Mobile Filter Panel */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-sm bg-surface z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto p-6">{content}</div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="bg-surface border border-border rounded-lg p-6 h-fit sticky top-20">
      {content}
    </div>
  );
};

export default FilterPanel;
