import React from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import KPICard from './components/KPICard';
import BookingChart from './components/BookingChart';
import RecentBookingsTable from './components/RecentBookingsTable';
import PeakHoursChart from './components/PeakHoursChart';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';
import BookingCalendar from './components/BookingCalendar';

const FacilityOwnerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-nav">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-text-secondary hover:text-primary transition-smooth">
                Dashboard
              </a>
              <Icon name="ChevronRight" size={16} className="text-text-secondary" />
              <span className="text-foreground font-medium">Owner Portal</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, Alex!</h1>
                <p className="text-text-secondary mt-2">
                  Here's what's happening with your sports facility today.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Calendar" size={16} />
                <span>Today: {new Date()?.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Bookings"
              value="156"
              change="+12%"
              changeType="positive"
              icon="Calendar"
              color="primary"
            />
            <KPICard
              title="Active Courts"
              value="8"
              change="+2"
              changeType="positive"
              icon="MapPin"
              color="success"
            />
            <KPICard
              title="Monthly Earnings"
              value="$12,480"
              change="+18%"
              changeType="positive"
              icon="DollarSign"
              color="accent"
            />
            <KPICard
              title="Booking Rate"
              value="87%"
              change="+5%"
              changeType="positive"
              icon="TrendingUp"
              color="warning"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BookingChart />
            <PeakHoursChart />
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Recent Bookings - Takes 2 columns */}
            <div className="xl:col-span-2">
              <RecentBookingsTable />
            </div>
            
            {/* Quick Actions & Notifications */}
            <div className="space-y-6">
              <QuickActions />
              <NotificationCenter />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="mb-8">
            <BookingCalendar />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} />
                </div>
                <Icon name="TrendingUp" size={16} className="text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">342</h3>
                <p className="text-text-secondary text-sm">Total Customers</p>
                <p className="text-success text-xs mt-1">+23 this month</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning/10 text-warning rounded-lg flex items-center justify-center">
                  <Icon name="Star" size={24} />
                </div>
                <Icon name="TrendingUp" size={16} className="text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">4.8</h3>
                <p className="text-text-secondary text-sm">Average Rating</p>
                <p className="text-success text-xs mt-1">+0.2 this month</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success/10 text-success rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} />
                </div>
                <Icon name="Minus" size={16} className="text-text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">2.4h</h3>
                <p className="text-text-secondary text-sm">Avg Session</p>
                <p className="text-text-secondary text-xs mt-1">No change</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                  <Icon name="Repeat" size={24} />
                </div>
                <Icon name="TrendingUp" size={16} className="text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">68%</h3>
                <p className="text-text-secondary text-sm">Return Rate</p>
                <p className="text-success text-xs mt-1">+8% this month</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilityOwnerDashboard;