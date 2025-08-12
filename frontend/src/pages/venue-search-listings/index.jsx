import React, { useState, useEffect, useMemo } from "react";
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
import { useVenue } from "context/VenueContext";

const VenueSearchListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 9;

  const {
    venues,
    loading,
    error,
    pagination,
    getFacilities,
    loadMoreVenues,
    searchVenues,
  } = useVenue();

  const [filters, setFilters] = useState({
    sports: [],
    priceRange: { min: 0, max: 200 },
    venueTypes: [],
    location: { radius: 25, coordinates: null },
    minRating: 0,
    amenities: [],
  });

  const [filteredVenues, setFilteredVenues] = useState([]);

  // Transform API data to match component expectations
  const transformVenueData = (apiVenues) => {
    return (
      apiVenues?.map((venue) => ({
        id: venue.id,
        name: venue.name,
        image: venue.photos?.[0]
          ? `http://localhost:7000${venue.photos[0]}`
          : "/placeholder-venue.jpg",
        sports: venue.sports || [],
        rating: venue.averageRating || 0,
        reviewCount: venue.totalReviews || 0,
        startingPrice: venue.basePrice || 50,
        distance: "0.0 mi",
        availability: venue.status === "APPROVED" ? "available" : "unavailable",
        isVerified: venue.status === "APPROVED",
        isPopular: venue.totalReviews > 50,
        isFavorited: false,
        openingHours: {
          start: venue.openingTime || "6:00 AM",
          end: venue.closingTime || "10:00 PM",
        },
        amenities:
          venue.amenities?.map((amenity, index) => ({
            id: index + 1,
            name: amenity,
            icon: getAmenityIcon(amenity),
          })) || [],
        address: venue.address,
        phone: venue.phone,
        description: venue.description,
        latitude: parseFloat(venue.latitude),
        longitude: parseFloat(venue.longitude),
        ownerName: venue.ownerName,
        createdAt: venue.createdAt,
      })) || []
    );
  };

  // Helper function to map amenities to icons
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      Parking: "Car",
      Locker: "Lock",
      Shower: "Droplets",
      WiFi: "Wifi",
      "First Aid": "Heart",
      Lighting: "Sun",
      Equipment: "Dumbbell",
      Cafeteria: "Coffee",
      "Pro Shop": "ShoppingBag",
    };
    return iconMap[amenity] || "Star";
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialVenues = async () => {
      try {
        await getFacilities([], "", 0, venuesPerPage);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchInitialVenues();
  }, []);

  // Transform and filter venues when data changes
  useEffect(() => {
    const transformedVenues = transformVenueData(venues);
    let filtered = [...transformedVenues];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (venue) =>
          venue?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          venue?.sports?.some((sport) =>
            sport?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          ) ||
          venue?.description
            ?.toLowerCase()
            ?.includes(searchQuery?.toLowerCase())
      );
    }

    // Sports filter
    if (filters?.sports?.length > 0) {
      filtered = filtered.filter((venue) =>
        venue?.sports?.some((sport) =>
          filters?.sports?.includes(sport?.toLowerCase())
        )
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (venue) =>
        venue?.startingPrice >= filters?.priceRange?.min &&
        venue?.startingPrice <= filters?.priceRange?.max
    );

    // Rating filter
    if (filters?.minRating > 0) {
      filtered = filtered.filter(
        (venue) => venue?.rating >= filters?.minRating
      );
    }

    // Amenities filter
    if (filters?.amenities?.length > 0) {
      filtered = filtered.filter((venue) =>
        filters?.amenities?.some((amenityFilter) =>
          venue?.amenities?.some((amenity) =>
            amenity?.name
              ?.toLowerCase()
              ?.includes(amenityFilter?.replace("-", " ")?.toLowerCase())
          )
        )
      );
    }

    // Sort venues
    filtered.sort((a, b) => {
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
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        default:
          return 0;
      }
    });

    setFilteredVenues(filtered);
    setCurrentPage(1); // Reset to first page when filters or sort change
  }, [venues, filters, searchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
  const getPaginatedVenues = () => {
    const startIndex = (currentPage - 1) * venuesPerPage;
    const endIndex = startIndex + venuesPerPage;
    return filteredVenues.slice(startIndex, endIndex);
  };

  const paginatedVenues = getPaginatedVenues();

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];

    filters?.sports?.forEach((sport) => {
      active.push({ type: "sport", value: sport });
    });

    if (filters?.priceRange?.min > 0 || filters?.priceRange?.max < 200) {
      active.push({ type: "priceRange", value: filters?.priceRange });
    }

    filters?.venueTypes?.forEach((type) => {
      active.push({ type: "venueType", value: type });
    });

    if (filters?.minRating > 0) {
      active.push({ type: "rating", value: filters?.minRating });
    }

    filters?.amenities?.forEach((amenity) => {
      active.push({ type: "amenity", value: amenity });
    });

    return active;
  };

  const handleSearchSubmit = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
    if (query) {
      setSearchParams({ q: query });
      try {
        await searchVenues(filters.sports, query, 0, venuesPerPage);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSearchParams({});
      try {
        await getFacilities(filters.sports, "", 0, venuesPerPage);
      } catch (error) {
        console.error("Fetch error:", error);
      }
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
    setCurrentPage(1); // Reset to first page when filters are removed
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
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handleLoadMoreVenues = async () => {
    if (pagination.hasNext && !loading) {
      try {
        await loadMoreVenues(filters.sports, searchQuery);
      } catch (error) {
        console.error("Load more error:", error);
      }
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-xl ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-xl ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-xl ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  const calculatePriceRange = () => {
    if (!venues || venues.length === 0) {
      return { min: 0, max: 200 }; // Default fallback
    }

    const prices = venues
      .map((venue) => venue.basePrice || venue.startingPrice || 0)
      .filter((price) => price > 0); // Filter out zero or null prices

    if (prices.length === 0) {
      return { min: 0, max: 200 }; // Fallback if no valid prices
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Round to nearest 10 for cleaner UI
    return {
      min: Math.floor(minPrice / 10) * 10,
      max: Math.ceil(maxPrice / 10) * 10,
    };
  };

  const priceRange = useMemo(() => {
  return calculatePriceRange();
}, [venues]);

  const calculateSportCounts = () => {
    const sportCounts = {};

    // Initialize all sports with 0 count
    const allSports = [
      "tennis",
      "badminton",
      "basketball",
      "football",
      "cricket",
      "swimming",
      "squash",
      "volleyball",
    ];
    allSports.forEach((sport) => {
      sportCounts[sport] = 0;
    });

    // Count occurrences of each sport in venues
    venues?.forEach((venue) => {
      venue?.sports?.forEach((sport) => {
        const sportKey = sport.toLowerCase();
        if (sportCounts.hasOwnProperty(sportKey)) {
          sportCounts[sportKey]++;
        }
      });
    });

    return sportCounts;
  };

  const calculateAmenityCounts = () => {
    const amenityCounts = {};

    // Initialize all amenities with 0 count
    const amenityMap = {
      parking: "Parking",
      locker: ["Changing Rooms", "Lockers"],
      shower: "Showers",
      equipment: "Equipment Rental",
      cafeteria: "Cafeteria",
      "pro-shop": "Pro Shop",
      coaching: "Coaching",
      wifi: "WiFi",
    };

    Object.keys(amenityMap).forEach((key) => {
      amenityCounts[key] = 0;
    });

    // Count occurrences of each amenity in venues
    venues?.forEach((venue) => {
      venue?.amenities?.forEach((amenity) => {
        const amenityName = amenity.toLowerCase();

        // Check each amenity mapping
        Object.entries(amenityMap).forEach(([key, mappedNames]) => {
          const namesToCheck = Array.isArray(mappedNames)
            ? mappedNames
            : [mappedNames];

          if (
            namesToCheck.some(
              (name) =>
                amenityName.includes(name.toLowerCase()) ||
                name.toLowerCase().includes(amenityName)
            )
          ) {
            amenityCounts[key]++;
          }
        });
      });
    });

    return amenityCounts;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-2">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={true}
              onClose={() => {}}
              isMobile={false}
              sportCounts={calculateSportCounts()}
              amenityCounts={calculateAmenityCounts()}
              priceRange={priceRange}
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Content Area */}
            {viewMode === "list" ? (
              <>
                {/* Venue Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedVenues?.map((venue) => (
                    <VenueCard key={venue?.id} venue={venue} />
                  ))}

                  {/* Loading Skeletons */}
                  {loading && <LoadingSkeleton count={venuesPerPage} />}
                </div>

                {/* Pagination */}
                {renderPagination()}

                {/* Load More Button */}
                {pagination.hasNext &&
                  !loading &&
                  filteredVenues?.length > 0 && (
                    <div className="text-center mt-8">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreVenues}
                        className="px-8"
                      >
                        Load More Venues
                      </Button>
                    </div>
                  )}

                {/* No Results */}
                {paginatedVenues?.length === 0 && !loading && (
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
        sportCounts={calculateSportCounts()}
        amenityCounts={calculateAmenityCounts()}
        priceRange={priceRange}
      />
    </div>
  );
};

export default VenueSearchListings;
