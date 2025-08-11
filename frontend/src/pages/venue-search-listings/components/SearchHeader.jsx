import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSuggestions = [
    { id: 1, type: 'venue', text: 'Elite Tennis Club', icon: 'MapPin' },
    { id: 2, type: 'sport', text: 'Tennis Courts', icon: 'Activity' },
    { id: 3, type: 'location', text: 'Downtown Sports Complex', icon: 'MapPin' },
    { id: 4, type: 'venue', text: 'Riverside Basketball Courts', icon: 'MapPin' },
    { id: 5, type: 'sport', text: 'Badminton Courts', icon: 'Activity' },
    { id: 6, type: 'location', text: 'Central Park Sports Center', icon: 'MapPin' }
  ];

  useEffect(() => {
    if (searchQuery?.length > 1) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion?.text);
    setShowSuggestions(false);
    onSearchSubmit(suggestion?.text);
  };

  const getFilterLabel = (filter) => {
    switch (filter?.type) {
      case 'sport':
        return filter?.value?.charAt(0)?.toUpperCase() + filter?.value?.slice(1);
      case 'priceRange':
        return `$${filter?.value?.min}-$${filter?.value?.max}`;
      case 'venueType':
        return filter?.value?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      case 'rating':
        return `${filter?.value}+ Stars`;
      case 'amenity':
        return filter?.value?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      default:
        return filter?.value;
    }
  };

  return (
    <div className="bg-surface border-b border-border sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <form onSubmit={(e) => { e?.preventDefault(); onSearchSubmit(searchQuery); }}>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search venues, sports, or locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="w-full pl-12 pr-4 h-12 text-lg"
              />
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
              />
            </div>
          </form>

          {/* Search Suggestions */}
          {showSuggestions && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-lg shadow-medium mt-1 z-50">
              {suggestions?.map((suggestion) => (
                <button
                  key={suggestion?.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg"
                >
                  <Icon name={suggestion?.icon} size={16} className="text-text-secondary" />
                  <div className="flex-1">
                    <span className="text-foreground">{suggestion?.text}</span>
                    <span className="text-xs text-text-secondary ml-2 capitalize">
                      {suggestion?.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters?.length > 0 && (
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">Active filters:</span>
            {activeFilters?.map((filter, index) => (
              <div
                key={`${filter?.type}-${index}`}
                className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{getFilterLabel(filter)}</span>
                <button
                  onClick={() => onRemoveFilter(filter)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-smooth"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-text-secondary hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;