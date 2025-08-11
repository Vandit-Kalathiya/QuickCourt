import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuickStatsCard from './components/QuickStatsCard';
import BookingCard from './components/BookingCard';
import BookingFilters from './components/BookingFilters';
import BookingDetailsModal from './components/BookingDetailsModal';
import ReviewModal from './components/ReviewModal';
import AccountSettings from './components/AccountSettings';
import Header from 'components/ui/Header';

const UserDashboardBookingManagement = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sport: '',
    dateFrom: '',
    dateTo: '',
    sort: 'date-desc'
  });

  // Mock user data
  const [user] = useState({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingReminders: true,
      promotionalEmails: false,
      weeklyDigest: true,
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD'
    }
  });

  // Mock bookings data remains the same...
  const [upcomingBookings] = useState([
    {
      id: 'BK001',
      venue: {
        name: 'Elite Tennis Center',
        location: 'Downtown Sports Complex',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
        rating: 4.8,
        phone: '+1 (555) 987-6543',
        email: 'info@elitetenniscenter.com',
        address: '123 Sports Ave, Downtown, NY 10001'
      },
      date: '2025-01-15',
      startTime: '14:00',
      endTime: '16:00',
      duration: 2,
      court: 'Court A',
      sport: 'Tennis',
      status: 'CONFIRMED',
      hourlyRate: 50,
      subtotal: 100,
      tax: 8,
      totalAmount: 108,
      paymentStatus: 'Paid',
      paymentMethod: 'Visa •••• 4242',
      notes: 'Please bring your own racket and balls.'
    },
    {
      id: 'BK002',
      venue: {
        name: 'City Basketball Arena',
        location: 'Midtown Recreation Center',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
        rating: 4.6,
        phone: '+1 (555) 876-5432',
        email: 'bookings@citybasketball.com',
        address: '456 Court St, Midtown, NY 10002'
      },
      date: '2025-01-18',
      startTime: '18:00',
      endTime: '20:00',
      duration: 2,
      court: 'Full Court 1',
      sport: 'Basketball',
      status: 'CONFIRMED',
      hourlyRate: 40,
      subtotal: 80,
      tax: 6.4,
      totalAmount: 86.4,
      paymentStatus: 'Paid',
      paymentMethod: 'Mastercard •••• 5555',
      notes: ''
    },
    {
      id: 'BK003',
      venue: {
        name: 'Aqua Fitness Pool',
        location: 'Westside Community Center',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop',
        rating: 4.7,
        phone: '+1 (555) 765-4321',
        email: 'swim@aquafitness.com',
        address: '789 Pool Lane, Westside, NY 10003'
      },
      date: '2025-01-20',
      startTime: '07:00',
      endTime: '08:00',
      duration: 1,
      court: 'Lane 3-4',
      sport: 'Swimming',
      status: 'CONFIRMED',
      hourlyRate: 25,
      subtotal: 25,
      tax: 2,
      totalAmount: 27,
      paymentStatus: 'Paid',
      paymentMethod: 'Visa •••• 4242',
      notes: 'Early morning swim session.'
    }
  ]);

  const [bookingHistory] = useState([
    {
      id: 'BK004',
      venue: {
        name: 'Elite Tennis Center',
        location: 'Downtown Sports Complex',
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
        rating: 4.8,
        phone: '+1 (555) 987-6543',
        email: 'info@elitetenniscenter.com',
        address: '123 Sports Ave, Downtown, NY 10001'
      },
      date: '2025-01-05',
      startTime: '16:00',
      endTime: '18:00',
      duration: 2,
      court: 'Court B',
      sport: 'Tennis',
      status: 'COMPLETED',
      hourlyRate: 50,
      subtotal: 100,
      tax: 8,
      totalAmount: 108,
      paymentStatus: 'Paid',
      paymentMethod: 'Visa •••• 4242',
      notes: '',
      hasReview: false
    },
    {
      id: 'BK005',
      venue: {
        name: 'Premier Badminton Club',
        location: 'Eastside Sports Hub',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop',
        rating: 4.5,
        phone: '+1 (555) 654-3210',
        email: 'play@premierbadminton.com',
        address: '321 Shuttle Ave, Eastside, NY 10004'
      },
      date: '2024-12-28',
      startTime: '19:00',
      endTime: '21:00',
      duration: 2,
      court: 'Court 2',
      sport: 'Badminton',
      status: 'COMPLETED',
      hourlyRate: 35,
      subtotal: 70,
      tax: 5.6,
      totalAmount: 75.6,
      paymentStatus: 'Paid',
      paymentMethod: 'Mastercard •••• 5555',
      notes: 'Great session with friends!',
      hasReview: true
    },
    {
      id: 'BK006',
      venue: {
        name: 'City Basketball Arena',
        location: 'Midtown Recreation Center',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
        rating: 4.6,
        phone: '+1 (555) 876-5432',
        email: 'bookings@citybasketball.com',
        address: '456 Court St, Midtown, NY 10002'
      },
      date: '2024-12-20',
      startTime: '15:00',
      endTime: '16:00',
      duration: 1,
      court: 'Half Court 2',
      sport: 'Basketball',
      status: 'CANCELLED',
      hourlyRate: 40,
      subtotal: 40,
      tax: 3.2,
      totalAmount: 43.2,
      paymentStatus: 'Refunded',
      paymentMethod: 'Visa •••• 4242',
      notes: 'Cancelled due to weather conditions.',
      hasReview: false
    }
  ]);

  // Quick stats calculation
  const quickStats = {
    totalBookings: upcomingBookings?.length + bookingHistory?.length,
    upcomingBookings: upcomingBookings?.length,
    favoriteVenues: 3,
    totalSpent: [...upcomingBookings, ...bookingHistory]?.filter(b => b?.status !== 'CANCELLED')?.reduce((sum, b) => sum + b?.totalAmount, 0)
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Bookings', icon: 'Calendar', count: upcomingBookings?.length, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'history', label: 'Booking History', icon: 'Clock', count: bookingHistory?.length, gradient: 'from-purple-500 to-pink-500' },
    { id: 'settings', label: 'Account Settings', icon: 'Settings', count: null, gradient: 'from-emerald-500 to-teal-500' }
  ];

  // All existing functions remain the same...
  const filterBookings = (bookings) => {
    return bookings?.filter(booking => {
      const matchesSearch = !filters?.search || 
        booking?.venue?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        booking?.venue?.location?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      
      const matchesStatus = !filters?.status || booking?.status === filters?.status;
      const matchesSport = !filters?.sport || booking?.sport === filters?.sport;
      
      const bookingDate = new Date(booking.date);
      const matchesDateFrom = !filters?.dateFrom || bookingDate >= new Date(filters.dateFrom);
      const matchesDateTo = !filters?.dateTo || bookingDate <= new Date(filters.dateTo);
      
      return matchesSearch && matchesStatus && matchesSport && matchesDateFrom && matchesDateTo;
    })?.sort((a, b) => {
      switch (filters?.sort) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'venue-asc':
          return a?.venue?.name?.localeCompare(b?.venue?.name);
        case 'amount-desc':
          return b?.totalAmount - a?.totalAmount;
        case 'amount-asc':
          return a?.totalAmount - b?.totalAmount;
        default:
          return 0;
      }
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      sport: '',
      dateFrom: '',
      dateTo: '',
      sort: 'date-desc'
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      console.log('Cancelling booking:', booking?.id);
    }
  };

  const handleRebook = (booking) => {
    window.location.href = `/venue-details-booking?venue=${booking?.venue?.name}&sport=${booking?.sport}`;
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    console.log('Submitting review:', reviewData);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAddToCalendar = (booking) => {
    const startDate = new Date(`${booking.date}T${booking.startTime}`);
    const endDate = new Date(`${booking.date}T${booking.endTime}`);
    
    const event = {
      title: `${booking?.sport} at ${booking?.venue?.name}`,
      start: startDate?.toISOString(),
      end: endDate?.toISOString(),
      description: `Court: ${booking?.court}\nLocation: ${booking?.venue?.location}\nBooking ID: ${booking?.id}`
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event?.title)}&dates=${startDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z/${endDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z&details=${encodeURIComponent(event?.description)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleUpdateProfile = async (profileData) => {
    console.log('Updating profile:', profileData);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUpdatePreferences = async (preferences) => {
    console.log('Updating preferences:', preferences);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleExportBookings = () => {
    const bookings = activeTab === 'upcoming' ? upcomingBookings : bookingHistory;
    const csvContent = [
      ['Booking ID', 'Venue', 'Date', 'Time', 'Sport', 'Court', 'Status', 'Amount']?.join(','),
      ...bookings?.map(booking => [
        booking?.id,
        booking?.venue?.name,
        booking?.date,
        `${booking?.startTime}-${booking?.endTime}`,
        booking?.sport,
        booking?.court,
        booking?.status,
        `$${booking?.totalAmount}`
      ]?.join(','))
    ]?.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${activeTab}-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const filteredUpcomingBookings = filterBookings(upcomingBookings);
  const filteredBookingHistory = filterBookings(bookingHistory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-10">
      <Header />
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
                <span className="text-emerald-700 text-sm font-semibold">Welcome back, {user.firstName}!</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-gray-600 font-medium">Manage your bookings and account settings</p>
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
                onClick={() => window.location.href = '/venue-search-listings'}
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
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{quickStats?.totalBookings}</p>
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
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900">{quickStats?.upcomingBookings}</p>
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
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Favorite Venues</p>
                    <p className="text-2xl font-bold text-gray-900">{quickStats?.favoriteVenues}</p>
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
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">${quickStats?.totalSpent?.toFixed(2)}</p>
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
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activeTab === tab?.id 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-white'
                      } transition-all duration-300`}>
                        <Icon name={tab?.icon} size={18} />
                      </div>
                      <span className="font-semibold">{tab?.label}</span>
                    </div>
                    {tab?.count !== null && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        activeTab === tab?.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
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
              {activeTab === 'upcoming' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
                      <p className="text-gray-600">Your confirmed sports sessions</p>
                    </div>
                  </div>
                  
                  <BookingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                  
                  <div className="space-y-4">
                    {filteredUpcomingBookings?.length > 0 ? (
                      filteredUpcomingBookings?.map((booking) => (
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
                          <Icon name="Calendar" size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming bookings</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                          {filters?.search || filters?.status || filters?.sport || filters?.dateFrom || filters?.dateTo
                            ? 'No bookings match your current filters.'
                            : 'Book your next sports session to get started!'
                          }
                        </p>
                        <button
                          onClick={() => window.location.href = '/venue-search-listings'}
                          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                        >
                          <Icon name="Plus" size={18} />
                          <span>Find Venues</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Booking History</h2>
                      <p className="text-gray-600">Your past sports sessions</p>
                    </div>
                  </div>
                  
                  <BookingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />
                  
                  <div className="space-y-4">
                    {filteredBookingHistory?.length > 0 ? (
                      filteredBookingHistory?.map((booking) => (
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
                          <Icon name="Clock" size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking history</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                          {filters?.search || filters?.status || filters?.sport || filters?.dateFrom || filters?.dateTo
                            ? 'No bookings match your current filters.'
                            : 'Your completed bookings will appear here.'
                          }
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
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                    <p className="text-gray-600">Manage your profile and preferences</p>
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
