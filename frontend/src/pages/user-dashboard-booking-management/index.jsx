import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuickStatsCard from './components/QuickStatsCard';
import BookingCard from './components/BookingCard';
import BookingFilters from './components/BookingFilters';
import BookingDetailsModal from './components/BookingDetailsModal';
import ReviewModal from './components/ReviewModal';
import AccountSettings from './components/AccountSettings';

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

  // Mock bookings data
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
    { id: 'upcoming', label: 'Upcoming Bookings', icon: 'Calendar', count: upcomingBookings?.length },
    { id: 'history', label: 'Booking History', icon: 'Clock', count: bookingHistory?.length },
    { id: 'settings', label: 'Account Settings', icon: 'Settings', count: null }
  ];

  // Filter bookings based on current filters
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
      // Mock cancellation logic
      console.log('Cancelling booking:', booking?.id);
      // In real app, this would update the booking status
    }
  };

  const handleRebook = (booking) => {
    // Navigate to venue details page with pre-filled data
    window.location.href = `/venue-details-booking?venue=${booking?.venue?.name}&sport=${booking?.sport}`;
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    console.log('Submitting review:', reviewData);
    // Mock review submission
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAddToCalendar = (booking) => {
    // Generate calendar event
    const startDate = new Date(`${booking.date}T${booking.startTime}`);
    const endDate = new Date(`${booking.date}T${booking.endTime}`);
    
    const event = {
      title: `${booking?.sport} at ${booking?.venue?.name}`,
      start: startDate?.toISOString(),
      end: endDate?.toISOString(),
      description: `Court: ${booking?.court}\nLocation: ${booking?.venue?.location}\nBooking ID: ${booking?.id}`
    };
    
    // Create calendar URL (Google Calendar example)
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event?.title)}&dates=${startDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z/${endDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z&details=${encodeURIComponent(event?.description)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleUpdateProfile = async (profileData) => {
    console.log('Updating profile:', profileData);
    // Mock profile update
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleUpdatePreferences = async (preferences) => {
    console.log('Updating preferences:', preferences);
    // Mock preferences update
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleExportBookings = () => {
    // Mock export functionality
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
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-text-secondary mt-1">Manage your bookings and account settings</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleExportBookings}
                iconName="Download"
                className="hidden md:flex"
              >
                Export Data
              </Button>
              <Button
                onClick={() => window.location.href = '/venue-search-listings'}
                iconName="Plus"
              >
                New Booking
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStatsCard
            title="Total Bookings"
            value={quickStats?.totalBookings}
            icon="Calendar"
            color="primary"
            trend={null}
            trendValue={null}
          />
          <QuickStatsCard
            title="Upcoming"
            value={quickStats?.upcomingBookings}
            icon="Clock"
            trend="up"
            trendValue="+2 this week"
            color="success"
          />
          <QuickStatsCard
            title="Favorite Venues"
            value={quickStats?.favoriteVenues}
            icon="Heart"
            color="accent"
            trend={null}
            trendValue={null}
          />
          <QuickStatsCard
            title="Total Spent"
            value={`${quickStats?.totalSpent?.toFixed(2)}`}
            icon="DollarSign"
            color="warning"
            trend={null}
            trendValue={null}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg shadow-subtle p-6">
              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-smooth ${
                      activeTab === tab?.id
                        ? 'bg-primary text-white' :'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={tab?.icon} size={20} />
                      <span className="font-medium">{tab?.label}</span>
                    </div>
                    {tab?.count !== null && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === tab?.id
                          ? 'bg-white/20 text-white' :'bg-muted text-text-secondary'
                      }`}>
                        {tab?.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
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
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming bookings</h3>
                      <p className="text-text-secondary mb-6">
                        {filters?.search || filters?.status || filters?.sport || filters?.dateFrom || filters?.dateTo
                          ? 'No bookings match your current filters.' :'Book your next sports session to get started!'
                        }
                      </p>
                      <Button
                        onClick={() => window.location.href = '/venue-search-listings'}
                        iconName="Plus"
                      >
                        Find Venues
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
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
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No booking history</h3>
                      <p className="text-text-secondary mb-6">
                        {filters?.search || filters?.status || filters?.sport || filters?.dateFrom || filters?.dateTo
                          ? 'No bookings match your current filters.' :'Your completed bookings will appear here.'
                        }
                      </p>
                      <Button
                        onClick={handleClearFilters}
                        variant="outline"
                        iconName="RotateCcw"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <AccountSettings
                user={user}
                onUpdateProfile={handleUpdateProfile}
                onUpdatePreferences={handleUpdatePreferences}
              />
            )}
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