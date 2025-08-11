import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import FilterPanel from "./components/FilterPanel";
import VenueCard from "./components/VenueCard";
import SearchHeader from "./components/SearchHeader";
import SortDropdown from "./components/SortDropdown";
import MapView from "./components/MapView";
import LoadingSkeleton from "./components/LoadingSkeleton";

const VenueSearchListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [sortBy, setSortBy] = useState("relevance");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    sports: [],
    priceRange: { min: 0, max: 200 },
    venueTypes: [],
    location: { radius: 25, coordinates: null },
    minRating: 0,
    amenities: [],
  });

  // Mock venue data
  const mockVenues = [
    {
      id: 1,
      name: "Elite Tennis Club",
      image:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop",
      sports: ["Tennis", "Squash"],
      rating: 4.8,
      reviewCount: 124,
      startingPrice: 45,
      distance: "0.8 mi",
      availability: "available",
      isVerified: true,
      isPopular: true,
      isFavorited: false,
      openingHours: { start: "6:00 AM", end: "10:00 PM" },
      amenities: [
        { id: 1, name: "Parking", icon: "Car" },
        { id: 2, name: "Locker", icon: "Lock" },
        { id: 3, name: "Shower", icon: "Droplets" },
        { id: 4, name: "WiFi", icon: "Wifi" },
      ],
    },
    {
      id: 2,
      name: "Downtown Basketball Arena",
      image:
        "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?w=400&h=300&fit=crop",
      sports: ["Basketball", "Volleyball"],
      rating: 4.6,
      reviewCount: 89,
      startingPrice: 35,
      distance: "1.2 mi",
      availability: "limited",
      isVerified: true,
      isPopular: false,
      isFavorited: true,
      openingHours: { start: "7:00 AM", end: "11:00 PM" },
      amenities: [
        { id: 1, name: "Parking", icon: "Car" },
        { id: 2, name: "Equipment", icon: "Dumbbell" },
        { id: 3, name: "Cafeteria", icon: "Coffee" },
      ],
    },
    {
      id: 3,
      name: "Riverside Badminton Center",
      image:
        "https://images.pixabay.com/photo/2017/09/03/21/45/badminton-2713062_1280.jpg?w=400&h=300&fit=crop",
      sports: ["Badminton", "Table Tennis"],
      rating: 4.4,
      reviewCount: 67,
      startingPrice: 25,
      distance: "2.1 mi",
      availability: "available",
      isVerified: false,
      isPopular: false,
      isFavorited: false,
      openingHours: { start: "6:30 AM", end: "9:30 PM" },
      amenities: [
        { id: 1, name: "Locker", icon: "Lock" },
        { id: 2, name: "Equipment", icon: "Dumbbell" },
        { id: 3, name: "WiFi", icon: "Wifi" },
      ],
    },
    {
      id: 4,
      name: "Central Park Sports Complex",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      sports: ["Football", "Cricket", "Tennis"],
      rating: 4.7,
      reviewCount: 156,
      startingPrice: 55,
      distance: "1.8 mi",
      availability: "busy",
      isVerified: true,
      isPopular: true,
      isFavorited: false,
      openingHours: { start: "5:00 AM", end: "11:00 PM" },
      amenities: [
        { id: 1, name: "Parking", icon: "Car" },
        { id: 2, name: "Locker", icon: "Lock" },
        { id: 3, name: "Shower", icon: "Droplets" },
        { id: 4, name: "Cafeteria", icon: "Coffee" },
        { id: 5, name: "Pro Shop", icon: "ShoppingBag" },
      ],
    },
    {
      id: 5,
      name: "Aquatic Swimming Center",
      image:
        "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?w=400&h=300&fit=crop",
      sports: ["Swimming", "Water Polo"],
      rating: 4.5,
      reviewCount: 92,
      startingPrice: 30,
      distance: "3.2 mi",
      availability: "available",
      isVerified: true,
      isPopular: false,
      isFavorited: true,
      openingHours: { start: "6:00 AM", end: "10:00 PM" },
      amenities: [
        { id: 1, name: "Parking", icon: "Car" },
        { id: 2, name: "Locker", icon: "Lock" },
        { id: 3, name: "Shower", icon: "Droplets" },
      ],
    },
    {
      id: 6,
      name: "Urban Squash Club",
      image:
        "https://images.pixabay.com/photo/2016/11/29/13/39/squash-1869047_1280.jpg?w=400&h=300&fit=crop",
      sports: ["Squash", "Racquetball"],
      rating: 4.3,
      reviewCount: 45,
      startingPrice: 40,
      distance: "2.5 mi",
      availability: "limited",
      isVerified: false,
      isPopular: false,
      isFavorited: false,
      openingHours: { start: "7:00 AM", end: "9:00 PM" },
      amenities: [
        { id: 1, name: "Equipment", icon: "Dumbbell" },
        { id: 2, name: "WiFi", icon: "Wifi" },
      ],
    },
  ];

  const [venues, setVenues] = useState(mockVenues);
  const [filteredVenues, setFilteredVenues] = useState(mockVenues);

  // Filter venues based on current filters
  useEffect(() => {
    let filtered = [...venues];

    // Search query filter
    if (searchQuery) {
      filtered = filtered?.filter(
        (venue) =>
          venue?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          venue?.sports?.some((sport) =>
            sport?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          )
      );
    }

    // Sports filter
    if (filters?.sports?.length > 0) {
      filtered = filtered?.filter((venue) =>
        venue?.sports?.some((sport) =>
          filters?.sports?.includes(sport?.toLowerCase())
        )
      );
    }

    // Price range filter
    filtered = filtered?.filter(
      (venue) =>
        venue?.startingPrice >= filters?.priceRange?.min &&
        venue?.startingPrice <= filters?.priceRange?.max
    );

    // Rating filter
    if (filters?.minRating > 0) {
      filtered = filtered?.filter(
        (venue) => venue?.rating >= filters?.minRating
      );
    }

    // Amenities filter
    if (filters?.amenities?.length > 0) {
      filtered = filtered?.filter((venue) =>
        filters?.amenities?.some((amenityId) =>
          venue?.amenities?.some((amenity) =>
            amenity?.name?.toLowerCase()?.includes(amenityId?.replace("-", " "))
          )
        )
      );
    }

    // Sort venues
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a?.startingPrice - b?.startingPrice;
        case "price-high":
          return b?.startingPrice - a?.startingPrice;
        case "rating":
          return b?.rating - a?.rating;
        case "distance":
          return parseFloat(a?.distance) - parseFloat(b?.distance);
        case "popular":
          return (b?.isPopular ? 1 : 0) - (a?.isPopular ? 1 : 0);
        case "newest":
          return b?.id - a?.id;
        default:
          return 0;
      }
    });

    setFilteredVenues(filtered);
  }, [venues, filters, searchQuery, sortBy]);

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];

    filters?.sports?.forEach((sport) => {
      active?.push({ type: "sport", value: sport });
    });

    if (filters?.priceRange?.min > 0 || filters?.priceRange?.max < 200) {
      active?.push({ type: "priceRange", value: filters?.priceRange });
    }

    filters?.venueTypes?.forEach((type) => {
      active?.push({ type: "venueType", value: type });
    });

    if (filters?.minRating > 0) {
      active?.push({ type: "rating", value: filters?.minRating });
    }

    filters?.amenities?.forEach((amenity) => {
      active?.push({ type: "amenity", value: amenity });
    });

    return active;
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleRemoveFilter = (filterToRemove) => {
    const newFilters = { ...filters };

    switch (filterToRemove?.type) {
      case "sport":
        newFilters.sports = newFilters?.sports?.filter(
          (s) => s !== filterToRemove?.value
        );
        break;
      case "priceRange":
        newFilters.priceRange = { min: 0, max: 200 };
        break;
      case "venueType":
        newFilters.venueTypes = newFilters?.venueTypes?.filter(
          (t) => t !== filterToRemove?.value
        );
        break;
      case "rating":
        newFilters.minRating = 0;
        break;
      case "amenity":
        newFilters.amenities = newFilters?.amenities?.filter(
          (a) => a !== filterToRemove?.value
        );
        break;
    }

    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      sports: [],
      priceRange: { min: 0, max: 200 },
      venueTypes: [],
      location: { radius: 25, coordinates: null },
      minRating: 0,
      amenities: [],
    });
  };

  const loadMoreVenues = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoading(false);
      if (page >= 3) setHasMore(false);
    }, 1000);
  };

  const activeFilterCount = getActiveFilters()?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        activeFilters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={true}
              onClose={() => {}}
              isMobile={false}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden relative"
                >
                  <Icon name="Filter" size={16} className="mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {/* Results Count */}
                <div className="text-sm text-text-secondary">
                  {filteredVenues?.length} venues found
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Sort Dropdown */}
                <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />

                {/* View Toggle */}
                <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none border-0"
                  >
                    <Icon name="List" size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="rounded-none border-0"
                  >
                    <Icon name="Map" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {viewMode === "list" ? (
              <>
                {/* Venue Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVenues?.map((venue) => (
                    <VenueCard key={venue?.id} venue={venue} />
                  ))}

                  {/* Loading Skeletons */}
                  {isLoading && <LoadingSkeleton count={6} />}
                </div>

                {/* Load More Button */}
                {hasMore && !isLoading && filteredVenues?.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={loadMoreVenues}
                      className="px-8"
                    >
                      Load More Venues
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {filteredVenues?.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Icon
                      name="Search"
                      size={48}
                      className="text-text-secondary mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No venues found
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <Button variant="outline" onClick={handleClearAllFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Map View */
              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapView
                  venues={filteredVenues}
                  onVenueSelect={setSelectedVenue}
                  selectedVenue={selectedVenue}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isMobile={true}
      />
    </div>
  );
};

export default VenueSearchListings;
