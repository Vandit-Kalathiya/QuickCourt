import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, type: 'booking', message: 'Booking confirmed for Tennis Court A', time: '2 min ago', unread: true },
    { id: 2, type: 'reminder', message: 'Upcoming booking tomorrow at 3 PM', time: '1 hour ago', unread: true },
    { id: 3, type: 'update', message: 'New facility added near you', time: '3 hours ago', unread: false }
  ]);

  const roleOptions = [
    { value: 'user', label: 'Sports Enthusiast' },
    { value: 'owner', label: 'Facility Owner' },
    { value: 'admin', label: 'Administrator' }
  ];

  const navigationItems = {
    user: [
      { label: 'Find Venues', path: '/venue-search-listings', icon: 'Search' },
      { label: 'My Bookings', path: '/user-dashboard', icon: 'Calendar' }
    ],
    owner: [
      { label: 'Dashboard', path: '/facility-owner-dashboard', icon: 'BarChart3' },
      { label: 'Manage Courts', path: '/facility-court-management', icon: 'Settings' }
    ],
    admin: [
      { label: 'Platform Management', path: '/admin-platform-management', icon: 'Shield' }
    ]
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.notification-dropdown')) {
        setIsNotificationOpen(false);
      }
      if (!event?.target?.closest('.profile-dropdown')) {
        setIsProfileMenuOpen(false);
      }
      if (!event?.target?.closest('.search-container')) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      window.location.href = `/venue-search-listings?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read and navigate based on type
    if (notification?.type === 'booking') {
      window.location.href = '/user-dashboard-booking-management';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-nav">
      <div className="nav-height nav-padding flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">SportBooker</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.[currentRole]?.map((item) => (
            <a
              key={item?.path}
              href={item?.path}
              className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-smooth"
            >
              <Icon name={item?.icon} size={18} />
              <span className="font-medium">{item?.label}</span>
            </a>
          ))}
        </nav>

        {/* Search Bar (Desktop) */}
        {(currentRole === 'user' || currentRole === 'admin') && (
          <div className="hidden md:flex search-container relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-64 pl-10"
              />
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              />
            </form>
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Role Indicator (Desktop) */}
          <div className="hidden md:block">
            <Select
              options={roleOptions}
              value={currentRole}
              onChange={handleRoleChange}
              className="min-w-[140px]"
            />
          </div>

          {/* Notifications */}
          <div className="notification-dropdown relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-medium z-dropdown animate-fade-in">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted transition-smooth ${
                        notification?.unread ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification?.unread ? 'bg-accent' : 'bg-muted'}`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{notification?.message}</p>
                          <p className="text-xs text-text-secondary mt-1">{notification?.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="profile-dropdown relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="rounded-full"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
            </Button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-medium z-dropdown animate-fade-in">
                <div className="p-2">
                  <a href="/profile" className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth">
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </a>
                  <a href="/settings" className="flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </a>
                  <div className="border-t border-border my-1" />
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-smooth w-full text-left">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-nav bg-background z-mobile-nav md:hidden animate-slide-in">
          <div className="p-4 space-y-6">
            {/* Mobile Search */}
            {(currentRole === 'user' || currentRole === 'admin') && (
              <form onSubmit={handleSearchSubmit}>
                <Input
                  type="search"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full"
                />
              </form>
            )}

            {/* Mobile Role Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Role</label>
              <Select
                options={roleOptions}
                value={currentRole}
                onChange={handleRoleChange}
                className="w-full"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationItems?.[currentRole]?.map((item) => (
                <a
                  key={item?.path}
                  href={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-smooth"
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.label}</span>
                </a>
              ))}
            </nav>

            {/* Mobile Profile Actions */}
            <div className="border-t border-border pt-4 space-y-2">
              <a
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="User" size={20} />
                <span>Profile</span>
              </a>
              <a
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="Settings" size={20} />
                <span>Settings</span>
              </a>
              <button className="flex items-center space-x-3 px-4 py-3 text-error hover:bg-muted rounded-lg transition-smooth w-full text-left">
                <Icon name="LogOut" size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;