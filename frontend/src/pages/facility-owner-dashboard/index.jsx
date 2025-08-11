import React from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import KPICard from "./components/KPICard";
import BookingChart from "./components/BookingChart";
import RecentBookingsTable from "./components/RecentBookingsTable";
import PeakHoursChart from "./components/PeakHoursChart";
import QuickActions from "./components/QuickActions";
import NotificationCenter from "./components/NotificationCenter";
import BookingCalendar from "./components/BookingCalendar";
import { useAuth } from "context/AuthContext";

const FacilityOwnerDashboard = () => {
  const {userProfile} = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* <Header /> */}
      <main className="">

        {/* Breadcrumb - Enhanced */}
        <div className="bg-gradient-to-r from-muted/60 to-muted/40 border-b border-border/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center space-x-3 text-sm">
              <a
                href="/"
                className="text-text-secondary hover:text-primary transition-all duration-200 hover:underline"
              >
                Dashboard
              </a>
              <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
              <span className="text-foreground font-semibold">
                Owner Portal
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section - Enhanced */}
          <div className="mb-10">
            <div className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-2xl p-8 border border-border/50 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-6 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-success uppercase tracking-wide">
                      Live Dashboard
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                    Welcome back, <span className="text-primary">{userProfile.name}</span>!
                  </h1>
                  <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
                    Here's what's happening with your sports facility today.
                    Your business is performing great!
                  </p>
                </div>
                <div className="bg-card/50 backdrop-blur-sm rounded-xl px-6 py-4 border border-border/50 shadow-sm">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon
                        name="Calendar"
                        size={16}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs font-medium">
                        Today
                      </p>
                      <p className="text-foreground font-semibold">
                        {new Date()?.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
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
          <div className="bg-card mb-5 rounded-xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300">
            <QuickActions />
          </div>
          {/* Charts Section - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-card rounded-xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300">
              <BookingChart />
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300">
              <PeakHoursChart />
            </div>
          </div>

          {/* Main Dashboard Content - Enhanced */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
            {/* Recent Bookings - Takes 2 columns */}
            <div className="xl:col-span-2">
              <div className="bg-card rounded-xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300">
                <RecentBookingsTable />
              </div>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300">
                <NotificationCenter />
              </div>
            </div>
          </div>

          {/* Calendar Section - Enhanced */}
          <div className="mb-10">
            <div className="bg-card rounded-xl border border-border/50 shadow-subtle hover:shadow-medium transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-4 border-b border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Calendar" size={16} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Booking Calendar
                  </h2>
                </div>
              </div>
              <BookingCalendar />
            </div>
          </div>

          {/* Additional Stats - Enhanced */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={16} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Performance Metrics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border/50 rounded-xl p-6 shadow-subtle hover:shadow-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <Icon name="Users" size={24} />
                  </div>
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon
                      name="TrendingUp"
                      size={14}
                      className="text-success"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    342
                  </h3>
                  <p className="text-text-secondary text-sm font-medium mb-1">
                    Total Customers
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <p className="text-success text-xs font-semibold">
                      +23 this month
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card via-card to-warning/5 border border-border/50 rounded-xl p-6 shadow-subtle hover:shadow-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <Icon name="Star" size={24} />
                  </div>
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon
                      name="TrendingUp"
                      size={14}
                      className="text-success"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    4.8
                  </h3>
                  <p className="text-text-secondary text-sm font-medium mb-1">
                    Average Rating
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <p className="text-success text-xs font-semibold">
                      +0.2 this month
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card via-card to-success/5 border border-border/50 rounded-xl p-6 shadow-subtle hover:shadow-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <Icon name="Clock" size={24} />
                  </div>
                  <div className="w-6 h-6 bg-muted/50 rounded-full flex items-center justify-center">
                    <Icon
                      name="Minus"
                      size={14}
                      className="text-text-secondary"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    2.4h
                  </h3>
                  <p className="text-text-secondary text-sm font-medium mb-1">
                    Avg Session
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-text-secondary rounded-full"></div>
                    <p className="text-text-secondary text-xs font-semibold">
                      No change
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card via-card to-accent/5 border border-border/50 rounded-xl p-6 shadow-subtle hover:shadow-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <Icon name="Repeat" size={24} />
                  </div>
                  <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon
                      name="TrendingUp"
                      size={14}
                      className="text-success"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    68%
                  </h3>
                  <p className="text-text-secondary text-sm font-medium mb-1">
                    Return Rate
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <p className="text-success text-xs font-semibold">
                      +8% this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilityOwnerDashboard;
