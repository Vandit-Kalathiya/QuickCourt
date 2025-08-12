import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import QuickStatsCard from "./components/QuickStatsCard";
import BookingCard from "./components/BookingCard";
import BookingFilters from "./components/BookingFilters";
import BookingDetailsModal from "./components/BookingDetailsModal";
import ReviewModal from "./components/ReviewModal";
import AccountSettings from "./components/AccountSettings";
import Header from "components/ui/Header";
import { useAuth } from "context/AuthContext";
import { useBooking } from "context/BookingContext";

const UserDashboardBookingManagement = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sport: "",
    dateFrom: "",
    dateTo: "",
    sort: "date-desc",
  });
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const bookingsPerPage = 5;

  const { userProfile } = useAuth();
  const { getUserBookings } = useBooking();

  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        console.log("Fetched bookings:", response.content);

        // Separate into upcoming & history
        const upcoming = response.content.filter(
          (b) => b.status?.toUpperCase() === "CREATED"
        );

        const history = response.content.filter(
          (b) => b.status?.toUpperCase() === "COMPLETED"
        );

        setUpcomingBookings(upcoming);
        setBookingHistory(history);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [getUserBookings]);

  const user = userProfile;

  // Quick stats calculation
  const quickStats = {
    totalBookings: upcomingBookings?.length + bookingHistory?.length,
    upcomingBookings: upcomingBookings?.length,
    favoriteVenues: 3,
    totalSpent: [...upcomingBookings, ...bookingHistory]
      ?.filter((b) => b?.status !== "CANCELLED")
      ?.reduce((sum, b) => sum + b?.totalAmount, 0),
  };

  const tabs = [
    {
      id: "upcoming",
      label: "Upcoming Bookings",
      icon: "Calendar",
      count: upcomingBookings?.length,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "history",
      label: "Booking History",
      icon: "Clock",
      count: bookingHistory?.length,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: "Settings",
      count: null,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  // Filter and sort bookings
  const filterBookings = (bookings) => {
    return bookings
      ?.filter((booking) => {
        const matchesSearch =
          !filters?.search ||
          booking?.venue?.name
            ?.toLowerCase()
            ?.includes(filters?.search?.toLowerCase()) ||
          booking?.venue?.location
            ?.toLowerCase()
            ?.includes(filters?.search?.toLowerCase());

        const matchesStatus =
          !filters?.status || booking?.status === filters?.status;
        const matchesSport =
          !filters?.sport || booking?.sport === filters?.sport;

        const bookingDate = new Date(booking.date);
        const matchesDateFrom =
          !filters?.dateFrom || bookingDate >= new Date(filters.dateFrom);
        const matchesDateTo =
          !filters?.dateTo || bookingDate <= new Date(filters.dateTo);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesSport &&
          matchesDateFrom &&
          matchesDateTo
        );
      })
      ?.sort((a, b) => {
        switch (filters?.sort) {
          case "date-asc":
            return new Date(a.date) - new Date(b.date);
          case "date-desc":
            return new Date(b.date) - new Date(a.date);
          case "venue-asc":
            return a?.venue?.name?.localeCompare(b?.venue?.name);
          case "amount-desc":
            return b?.totalAmount - a?.totalAmount;
          case "amount-asc":
            return a?.totalAmount - b?.totalAmount;
          default:
            return 0;
        }
      });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Reset page to 1 when filters change
    setUpcomingPage(1);
    setHistoryPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      sport: "",
      dateFrom: "",
      dateTo: "",
      sort: "date-desc",
    });
    setUpcomingPage(1);
    setHistoryPage(1);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      console.log("Cancelling booking:", booking?.id);
    }
  };

  const handleRebook = (booking) => {
    window.location.href = `/venue-booking?venue=${booking?.venue?.name}&sport=${booking?.sport}`;
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    console.log("Submitting review:", reviewData);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleAddToCalendar = (booking) => {
    const startDate = new Date(`${booking.date}T${booking.startTime}`);
    const endDate = new Date(`${booking.date}T${booking.endTime}`);

    const event = {
      title: `${booking?.sport} at ${booking?.venue?.name}`,
      start: startDate?.toISOString(),
      end: endDate?.toISOString(),
      description: `Court: ${booking?.court}\nLocation: ${booking?.venue?.location}\nBooking ID: ${booking?.id}`,
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event?.title
    )}&dates=${
      startDate?.toISOString()?.replace(/[-:]/g, "")?.split(".")?.[0]
    }Z/${
      endDate?.toISOString()?.replace(/[-:]/g, "")?.split(".")?.[0]
    }Z&details=${encodeURIComponent(event?.description)}`;

    window.open(calendarUrl, "_blank");
  };

  const handleUpdateProfile = async (profileData) => {
    console.log("Updating profile:", profileData);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleUpdatePreferences = async (preferences) => {
    console.log("Updating preferences:", preferences);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleExportBookings = () => {
    const bookings =
      activeTab === "upcoming" ? upcomingBookings : bookingHistory;
    const csvContent = [
      [
        "Booking ID",
        "Venue",
        "Date",
        "Time",
        "Sport",
        "Court",
        "Status",
        "Amount",
      ]?.join(","),
      ...bookings?.map((booking) =>
        [
          booking?.id,
          booking?.venue?.name,
          booking?.date,
          `${booking?.startTime}-${booking?.endTime}`,
          booking?.sport,
          booking?.court,
          booking?.status,
          `$${booking?.totalAmount}`,
        ]?.join(",")
      ),
    ]?.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${activeTab}-${
      new Date()?.toISOString()?.split("T")?.[0]
    }.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const filteredUpcomingBookings = filterBookings(upcomingBookings);
  const filteredBookingHistory = filterBookings(bookingHistory);

  // Pagination logic
  const getPaginatedBookings = (bookings, page) => {
    const startIndex = (page - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    return bookings.slice(startIndex, endIndex);
  };

  const totalUpcomingPages = Math.ceil(
    filteredUpcomingBookings.length / bookingsPerPage
  );
  const totalHistoryPages = Math.ceil(
    filteredBookingHistory.length / bookingsPerPage
  );

  const paginatedUpcomingBookings = getPaginatedBookings(
    filteredUpcomingBookings,
    upcomingPage
  );
  const paginatedBookingHistory = getPaginatedBookings(
    filteredBookingHistory,
    historyPage
  );

  const handlePageChange = (tab, page) => {
    if (tab === "upcoming") {
      setUpcomingPage(page);
    } else if (tab === "history") {
      setHistoryPage(page);
    }
  };

  const renderPagination = (tab, totalPages, currentPage) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(tab, currentPage - 1)}
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
            onClick={() => handlePageChange(tab, index + 1)}
            className={`px-4 py-2 rounded-xl ${
              currentPage === index + 1
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(tab, currentPage + 1)}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Enhanced Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center bg-white/60 backdrop-blur-xl rounded-full px-4 py-2 mb-4 border border-white/50 shadow-lg shadow-gray-900/5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-emerald-700 text-sm font-semibold">
                  Welcome back, {user.name}!
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My{" "}
                <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-gray-600 font-medium">
                Manage your bookings and account settings
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleExportBookings}
                className="hidden md:flex bg-white/80 backdrop-blur-xl text-gray-700 px-6 py-3 rounded-2xl font-semibold border border-white/50 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300 hover:bg-white/90 items-center space-x-2"
              >
                <Icon name="Download" size={18} />
                <span>Export Data</span>
              </button>
              <button
                onClick={() =>
                  (window.location.href = "/venue-search-listings")
                }
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 flex items-center space-x-2"
              >
                <Icon name="Plus" size={18} />
                <span>New Booking</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon name="Calendar" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {quickStats?.totalBookings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon name="Clock" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Upcoming
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {quickStats?.upcomingBookings}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center bg-emerald-100/80 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
                  <Icon name="TrendingUp" size={12} className="mr-1" />
                  +2 this week
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon name="Heart" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Favorite Venues
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {quickStats?.favoriteVenues}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon name="DollarSign" size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${quickStats?.totalSpent?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg shadow-gray-900/5 p-6">
              <nav className="space-y-3">
                {tabs?.map((tab, index) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 group ${
                      activeTab === tab?.id
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                        : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activeTab === tab?.id
                            ? "bg-white/20"
                            : "bg-gray-100 group-hover:bg-white"
                        } transition-all duration-300`}
                      >
                        <Icon name={tab?.icon} size={18} />
                      </div>
                      <span className="font-semibold">{tab?.label}</span>
                    </div>
                    {tab?.count !== null && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          activeTab === tab?.id
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab?.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg shadow-gray-900/5">
              {activeTab === "upcoming" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Upcoming Bookings
                      </h2>
                      <p className="text-gray-600">
                        Your confirmed sports sessions
                      </p>
                    </div>
                  </div>

                  {/* <BookingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  /> */}

                  <div className="space-y-4">
                    {paginatedUpcomingBookings?.length > 0 ? (
                      paginatedUpcomingBookings?.map((booking) => (
                        <BookingCard
                          key={booking?.id}
                          booking={booking}
                          type="upcoming"
                          onViewDetails={handleViewDetails}
                          onCancel={handleCancelBooking}
                          onRebook={handleRebook}
                          onReview={handleReview}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Icon
                            name="Calendar"
                            size={32}
                            className="text-gray-400"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No upcoming bookings
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                          {filters?.search ||
                          filters?.status ||
                          filters?.sport ||
                          filters?.dateFrom ||
                          filters?.dateTo
                            ? "No bookings match your current filters."
                            : "Book your next sports session to get started!"}
                        </p>
                        <button
                          onClick={() =>
                            (window.location.href = "/venue-search-listings")
                          }
                          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                        >
                          <Icon name="Plus" size={18} />
                          <span>Find Venues</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {renderPagination(
                    "upcoming",
                    totalUpcomingPages,
                    upcomingPage
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Booking History
                      </h2>
                      <p className="text-gray-600">Your past sports sessions</p>
                    </div>
                  </div>

                  {/* <BookingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  /> */}

                  <div className="space-y-4">
                    {paginatedBookingHistory?.length > 0 ? (
                      paginatedBookingHistory?.map((booking) => (
                        <BookingCard
                          key={booking?.id}
                          booking={booking}
                          type="history"
                          onViewDetails={handleViewDetails}
                          onRebook={handleRebook}
                          onReview={handleReview}
                          onCancel={handleCancelBooking}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Icon
                            name="Clock"
                            size={32}
                            className="text-gray-400"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No booking history
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                          {filters?.search ||
                          filters?.status ||
                          filters?.sport ||
                          filters?.dateFrom ||
                          filters?.dateTo
                            ? "No bookings match your current filters."
                            : "Your completed bookings will appear here."}
                        </p>
                        <button
                          onClick={handleClearFilters}
                          className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-2 mx-auto"
                        >
                          <Icon name="RotateCcw" size={18} />
                          <span>Clear Filters</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {renderPagination("history", totalHistoryPages, historyPage)}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Account Settings
                    </h2>
                    <p className="text-gray-600">
                      Manage your profile and preferences
                    </p>
                  </div>
                  <AccountSettings
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    onUpdatePreferences={handleUpdatePreferences}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        onCancel={handleCancelBooking}
        onAddToCalendar={handleAddToCalendar}
      />
      <ReviewModal
        booking={selectedBooking}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default UserDashboardBookingManagement;
