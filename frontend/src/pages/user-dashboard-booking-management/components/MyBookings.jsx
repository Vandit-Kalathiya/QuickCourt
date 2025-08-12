import React, { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import Icon from "components/AppIcon";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import Button from "components/ui/Button";
import { useBooking } from "context/BookingContext";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const { createBooking, getUserBookings } = useBooking();

  const [bookingStats, setBookingStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterAndSortBookings();
    calculateStats();
  }, [bookings, searchQuery, statusFilter, dateFilter, sortBy, currentPage]);

  const calculateStats = () => {
    const now = new Date();
    const stats = bookings.reduce(
      (acc, booking) => {
        acc.total += 1;
        acc.totalAmount += booking.amount;

        const bookingDate = new Date(booking.date);
        if (
          bookingDate >= now &&
          booking.status.toLowerCase() !== "cancelled"
        ) {
          acc.upcoming += 1;
        }
        if (booking.status.toLowerCase() === "completed") {
          acc.completed += 1;
        }

        return acc;
      },
      { total: 0, upcoming: 0, completed: 0, totalAmount: 0 }
    );

    setBookingStats(stats);
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await getUserBookings();
      console.log(response.content);
      setBookings(response.content || response); // Adjust based on API response structure
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  const totalSpent = bookings.reduce(
    (acc, booking) => acc + booking.totalPrice,
    0
  );

  const filterAndSortBookings = () => {
    let filtered = [...bookings];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (booking) =>
          booking.facilityName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.status.toLowerCase() === statusFilter
      );
    }

    const now = new Date();
    if (dateFilter !== "all") {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date);
        const diffDays = Math.ceil((bookingDate - now) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "upcoming":
            return diffDays >= 0;
          case "past":
            return diffDays < 0;
          case "thisWeek":
            return diffDays >= 0 && diffDays <= 7;
          case "thisMonth":
            return diffDays >= 0 && diffDays <= 30;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.bookingDate) - new Date(a.bookingDate);
        case "oldest":
          return new Date(a.bookingDate) - new Date(b.bookingDate);
        case "dateAsc":
          return new Date(a.date) - new Date(b.date);
        case "dateDesc":
          return new Date(b.date) - new Date(a.date);
        case "amount":
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const getPaginatedBookings = () => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  };

  const paginatedBookings = getPaginatedBookings();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "CREATED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSportIcon = (sport) => {
    const icons = {
      TENNIS: "Circle",
      BASKETBALL: "Circle",
      FOOTBALL: "Circle",
      BADMINTON: "Zap",
      VOLLEYBALL: "Circle",
      CRICKET: "Target",
      SWIMMING: "Waves",
    };
    return icons[sport] || "Circle";
  };

  const getSportGradient = (sport) => {
    const gradients = {
      TENNIS: "from-green-400 to-green-600",
      BASKETBALL: "from-orange-400 to-orange-600",
      FOOTBALL: "from-blue-400 to-blue-600",
      BADMINTON: "from-purple-400 to-purple-600",
      VOLLEYBALL: "from-pink-400 to-pink-600",
      CRICKET: "from-yellow-400 to-yellow-600",
      SWIMMING: "from-cyan-400 to-cyan-600",
    };
    return gradients[sport] || "from-gray-400 to-gray-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const canCancelBooking = (booking) => {
    const now = new Date();
    const cancellationDeadline = new Date(booking.cancellationDeadline);
    return (
      booking.status.toLowerCase() === "created" && now < cancellationDeadline
    );
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELLED" }
              : booking
          )
        );
        alert("Booking cancelled successfully");
        setCurrentPage(1); // Reset to first page after cancellation
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking");
      }
    }
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={12}
            className={
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-xs text-text-secondary ml-1">{rating}</span>
      </div>
    );
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "created", label: "Created" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "dateAsc", label: "Date (Earliest)" },
    { value: "dateDesc", label: "Date (Latest)" },
    { value: "amount", label: "Amount (Highest)" },
  ];

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
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full mx-auto"></div>
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">
                Loading your bookings...
              </p>
              <p className="text-text-secondary">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with gradient background */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                My Bookings
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Track, manage, and explore all your sports facility reservations
                in one place
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = "/listings")}
                className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                iconName="Plus"
                size="lg"
              >
                New Booking
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {bookingStats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Icon name="Calendar" size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Upcoming
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {bookingStats.upcoming}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {bookingStats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹ {totalSpent}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="DollarSign" size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icon name="Filter" size={20} className="text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter & Search
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Search Bookings
              </label>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search facilities, courts, or booking IDs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status
              </label>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date Range
              </label>
              <Select
                options={dateOptions}
                value={dateFilter}
                onChange={(value) => {
                  setDateFilter(value);
                  setCurrentPage(1);
                }}
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sort By
              </label>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
                className="h-12"
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3 w-full">
                <span className="font-medium">{filteredBookings.length}</span>{" "}
                of <span className="font-medium">{bookings.length}</span>{" "}
                bookings
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bookings List */}
        {paginatedBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Calendar" size={40} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {bookings.length === 0
                ? "Start your sports journey by booking your first venue!"
                : "No bookings match your current filters. Try adjusting your search criteria."}
            </p>
            <Button
              onClick={() => (window.location.href = "/listings")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg px-8 py-3"
              iconName="Search"
              size="lg"
            >
              Explore Venues
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Enhanced Sport Icon with Gradient */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getSportGradient(
                            booking.sport
                          )} flex items-center justify-center shadow-lg`}
                        >
                          <Icon
                            name={getSportIcon(booking.sport)}
                            size={28}
                            className="text-white"
                          />
                        </div>
                      </div>

                      {/* Enhanced Booking Information */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {booking.facilityName}
                              </h3>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {booking.courtName} •{" "}
                              {booking.courtName ? booking.courtName : "N/A"}
                            </p>
                            {booking.rating && renderStars(booking?.rating)}
                          </div>
                        </div>

                        {/* Enhanced Details Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <Icon
                                name="Calendar"
                                size={16}
                                className="text-blue-500 mr-2"
                              />
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Date
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatDate(booking.date)}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <Icon
                                name="Clock"
                                size={16}
                                className="text-emerald-500 mr-2"
                              />
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Time
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatTime(booking.startTime)} -{" "}
                              {formatTime(booking.endTime)}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <Icon
                                name="Timer"
                                size={16}
                                className="text-purple-500 mr-2"
                              />
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Duration
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {booking.duration} hours
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <Icon
                                name="DollarSign"
                                size={16}
                                className="text-orange-500 mr-2"
                              />
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Amount
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900 text-lg">
                              ₹ {booking.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="outline"
                            onClick={() => openBookingDetails(booking)}
                            className="border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            iconName="Eye"
                          >
                            View Details
                          </Button>

                          {canCancelBooking(booking) && (
                            <Button
                              variant="outline"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                              iconName="X"
                            >
                              Cancel Booking
                            </Button>
                          )}

                          {booking.status.toLowerCase() === "completed" && (
                            <Button
                              variant="outline"
                              className="border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700"
                              iconName="Star"
                            >
                              Write Review
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            iconName="Download"
                          >
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}

        {/* Enhanced Modal */}
        {isDetailModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Enhanced Modal Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}
                    >
                      <Icon
                        name={getSportIcon(selectedBooking.sport)}
                        size={24}
                        className="text-white"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {selectedBooking.facilityName}
                      </h2>
                      <p className="text-blue-100">
                        Booking ID: {selectedBooking.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        selectedBooking.status
                      )
                        .replace("text-", "text-")
                        .replace(
                          "bg-",
                          "bg-white/20 text-white border-white/30"
                        )}`}
                    >
                      {selectedBooking.status}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsDetailModalOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      <Icon name="X" size={24} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Booking Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Icon
                          name="Calendar"
                          size={20}
                          className="mr-2 text-blue-500"
                        />
                        Booking Information
                      </h4>

                      <div className="space-y-4">
                        {[
                          {
                            label: "Court",
                            value: selectedBooking.courtName,
                            icon: "MapPin",
                          },
                          {
                            label: "Sport",
                            value: selectedBooking.sportType,
                            icon: "Activity",
                          },
                          {
                            label: "Date",
                            value: formatDate(selectedBooking.date),
                            icon: "Calendar",
                          },
                          {
                            label: "Time",
                            value: `${formatTime(
                              selectedBooking.startTime
                            )} - ${formatTime(selectedBooking.endTime)}`,
                            icon: "Clock",
                          },
                          {
                            label: "Duration",
                            value: `${selectedBooking?.duration} hours`,
                            icon: "Timer",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Icon
                              name={item.icon}
                              size={16}
                              className="text-gray-400"
                            />
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {item.label}
                              </p>
                              <p className="font-semibold text-gray-900">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Facility Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Icon
                          name="Building"
                          size={20}
                          className="mr-2 text-emerald-500"
                        />
                        Facility Information
                      </h4>

                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Icon
                              name="MapPin"
                              size={16}
                              className="text-gray-400 mt-1"
                            />
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Address
                              </p>
                              <p className="font-medium text-gray-900">
                                {selectedBooking.facilityAddress}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Icon
                              name="Phone"
                              size={16}
                              className="text-gray-400 mt-1"
                            />
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Phone
                              </p>
                              <p className="font-medium text-gray-900">
                                {selectedBooking.facilityPhone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Icon
                          name="CreditCard"
                          size={20}
                          className="mr-2 text-purple-500"
                        />
                        Payment Information
                      </h4>

                      <div className="space-y-4">
                        {[
                          {
                            label: "Amount",
                            value: `₹ ${selectedBooking.totalPrice.toFixed(2)}`,
                            icon: "DollarSign",
                            highlight: true,
                          },
                          {
                            label: "Payment Method",
                            value: "Razorpay",
                            icon: "CreditCard",
                          },
                          {
                            label: "Payment Order ID",
                            value: selectedBooking?.razorpayOrderId,
                            icon: "Hash",
                          },
                          {
                            label: "Booking Date",
                            value: new Date(
                              selectedBooking?.createdAt
                            ).toLocaleString(),
                            icon: "Clock",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-3 p-3 rounded-lg ${
                              item.highlight
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <Icon
                              name={item.icon}
                              size={16}
                              className={
                                item.highlight
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }
                            />
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {item.label}
                              </p>
                              <p
                                className={`font-semibold ${
                                  item.highlight
                                    ? "text-green-900 text-lg"
                                    : "text-gray-900"
                                }`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-8 mt-8 border-t border-gray-200">
                  {canCancelBooking(selectedBooking) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleCancelBooking(selectedBooking.id);
                      }}
                      className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                      iconName="X"
                    >
                      Cancel Booking
                    </Button>
                  )}

                  {selectedBooking.status.toLowerCase() === "completed" && (
                    <Button
                      variant="outline"
                      className="border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700"
                      iconName="Star"
                    >
                      Write Review
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    iconName="Download"
                  >
                    Download Receipt
                  </Button>

                  <div className="flex-1"></div>

                  <Button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
