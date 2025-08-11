import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import Input from "./Input";
import { useAuth } from "context/AuthContext";

const Header = () => {
  const { userProfile, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Mock notifications - in real app, this would come from context/API
  const [notifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      message: "Tennis Court A booking confirmed for today at 3 PM",
      time: "2 min ago",
      unread: true,
      icon: "CheckCircle",
      color: "text-success",
    },
    {
      id: 2,
      type: "reminder",
      title: "Upcoming Booking",
      message: "Don't forget your booking tomorrow at 3 PM",
      time: "1 hour ago",
      unread: true,
      icon: "Clock",
      color: "text-warning",
    },
    {
      id: 3,
      type: "update",
      title: "New Facility",
      message: "Elite Sports Complex added near you",
      time: "3 hours ago",
      unread: false,
      icon: "MapPin",
      color: "text-info",
    },
  ]);

  // Role configuration
  const roleConfig = {
    USER: {
      label: "Sports Enthusiast",
      icon: "User",
      navigation: [
        {
          label: "Find Venues",
          path: "/venue-search-listings",
          icon: "Search",
        },
        {
          label: "My Bookings",
          path: "/dashboard",
          icon: "Calendar",
          badge: "3",
        },
      ],
      showSearch: true,
    },
    OWNER: {
      label: "Facility Owner",
      icon: "Building",
      navigation: [
        { label: "Dashboard", path: "/dashboard", icon: "BarChart3" },
        {
          label: "Manage Courts",
          path: "/facility-court-management",
          icon: "Settings",
        },
      ],
      showSearch: false,
    },
    ADMIN: {
      label: "Administrator",
      icon: "Shield",
      navigation: [
        {
          label: "Platform Management",
          path: "/dashboard",
          icon: "Shield",
          badge: "12",
        },
      ],
      showSearch: true,
    },
  };

  // Get current role configuration
  const currentRole = userProfile?.role || "USER";
  const currentRoleConfig = roleConfig[currentRole] || roleConfig.USER;
  const unreadCount = notifications?.filter((n) => n?.unread)?.length;

  // Handle scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest(".notification-dropdown")) {
        setIsNotificationOpen(false);
      }
      if (!event?.target?.closest(".profile-dropdown")) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/venue-search-listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification?.type === "booking") {
      navigate("/dashboard");
    }
    setIsNotificationOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const markAllAsRead = () => {
    // Implementation for marking all notifications as read
    console.log("Mark all as read");
  };

  // Don't render header if still loading auth state
  if (loading) {
    return null;
  }

  // Don't render header if user is not authenticated
  if (!user || !userProfile) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-nav transition-all duration-300 ${
          isScrolled
            ? "bg-surface/95 backdrop-blur-lg border-b border-border/50 shadow-sm"
            : "bg-surface border-b border-border"
        }`}
      >
        <div className="nav-height nav-padding flex items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-300 group-hover:scale-105">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  SportBooker
                </span>
                <span className="text-xs text-text-secondary font-medium">
                  {currentRoleConfig.label}
                </span>
              </div>
            </button>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {currentRoleConfig.navigation?.map((item) => (
              <button
                key={item?.path}
                onClick={() => navigate(item.path)}
                className="relative flex items-center space-x-2 px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-200 group"
              >
                <Icon
                  name={item?.icon}
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">{item?.label}</span>
                {item?.badge && (
                  <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    {item?.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10" />
              </button>
            ))}
          </nav>

          {/* Enhanced Search Bar */}
          {currentRoleConfig.showSearch && (
            <div className="hidden md:flex search-container relative">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="relative overflow-hidden rounded-lg">
                  <Input
                    type="search"
                    placeholder="Search venues, sports, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-80 pl-12 pr-4 py-2.5 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors duration-200"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Enhanced Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Role Indicator (Read-only) */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-muted/30 rounded-lg">
              <Icon
                name={currentRoleConfig.icon}
                size={16}
                className="text-primary"
              />
              <span className="text-sm font-medium text-foreground">
                {currentRoleConfig.label}
              </span>
            </div>

            {/* Enhanced Notifications */}
            <div className="notification-dropdown relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative hover:bg-muted/50 transition-all duration-200 ${
                  isNotificationOpen ? "bg-muted/50 shadow-inner" : ""
                }`}
              >
                <Icon
                  name="Bell"
                  size={20}
                  className={isNotificationOpen ? "text-primary" : ""}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Enhanced Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-popover border border-border rounded-xl shadow-xl z-dropdown animate-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20 rounded-t-xl">
                    <h3 className="font-semibold text-foreground flex items-center space-x-2">
                      <Icon name="Bell" size={18} />
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:bg-primary/10"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications?.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={notification?.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 group ${
                            notification?.unread
                              ? "bg-accent/5 border-l-2 border-l-accent"
                              : ""
                          } ${
                            index !== notifications.length - 1
                              ? "border-b border-border/50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                notification?.unread
                                  ? "bg-accent/10"
                                  : "bg-muted/50"
                              } group-hover:scale-110 transition-transform duration-200`}
                            >
                              <Icon
                                name={notification?.icon}
                                size={16}
                                className={
                                  notification?.color || "text-text-secondary"
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p
                                  className={`font-medium text-sm ${
                                    notification?.unread
                                      ? "text-foreground"
                                      : "text-text-secondary"
                                  }`}
                                >
                                  {notification?.title}
                                </p>
                                {notification?.unread && (
                                  <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-text-secondary leading-relaxed">
                                {notification?.message}
                              </p>
                              <p className="text-xs text-text-secondary/70 mt-2 flex items-center space-x-1">
                                <Icon name="Clock" size={12} />
                                <span>{notification?.time}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Icon
                          name="Bell"
                          size={32}
                          className="text-text-secondary mx-auto mb-2"
                        />
                        <p className="text-text-secondary">No notifications</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-border bg-muted/20 rounded-b-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-primary hover:bg-primary/10"
                      onClick={() => {
                        navigate("/notifications");
                        setIsNotificationOpen(false);
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Profile Menu */}
            <div className="profile-dropdown relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`rounded-full hover:bg-muted/50 transition-all duration-200 ${
                  isProfileMenuOpen ? "bg-muted/50 shadow-inner" : ""
                }`}
              >
                <div className="relative">
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                      <Icon name="User" size={16} color="white" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                </div>
              </Button>

              {/* Enhanced Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-popover border border-border rounded-xl shadow-xl z-dropdown animate-in slide-in-from-top-2 duration-200">
                  {/* Profile Header */}
                  <div className="p-4 border-b border-border bg-muted/20 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                      {userProfile?.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <Icon name="User" size={18} color="white" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">
                          {userProfile?.name || "User"}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {userProfile?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                    >
                      <Icon
                        name="User"
                        size={16}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                    >
                      <Icon
                        name="Settings"
                        size={16}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/billing");
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                    >
                      <Icon
                        name="CreditCard"
                        size={16}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Billing</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/help");
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                    >
                      <Icon
                        name="HelpCircle"
                        size={16}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Help & Support</span>
                    </button>

                    <div className="border-t border-border my-2" />

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-error hover:bg-error/10 rounded-lg transition-all duration-200 w-full text-left group"
                    >
                      <Icon
                        name="LogOut"
                        size={16}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:bg-muted/50 transition-all duration-200"
            >
              <Icon
                name={isMobileMenuOpen ? "X" : "Menu"}
                size={20}
                className={`transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-background border-l border-border z-50 lg:hidden animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={16} color="white" />
                  </div>
                  <span className="font-semibold text-foreground">Menu</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:bg-muted/50"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Mobile Search */}
                {currentRoleConfig.showSearch && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Search Venues
                    </label>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Input
                        type="search"
                        placeholder="Search venues, sports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e?.target?.value)}
                        className="w-full pl-10 bg-muted/30"
                      />
                      <Icon
                        name="Search"
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                      />
                    </form>
                  </div>
                )}

                {/* Mobile Role Display */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Role
                  </label>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-muted/30 rounded-lg">
                    <Icon
                      name={currentRoleConfig.icon}
                      size={20}
                      className="text-primary"
                    />
                    <span className="font-medium text-foreground">
                      {currentRoleConfig.label}
                    </span>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Navigation
                  </label>
                  <nav className="space-y-1">
                    {currentRoleConfig.navigation?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            name={item?.icon}
                            size={20}
                            className="group-hover:scale-110 transition-transform duration-200"
                          />
                          <span className="font-medium">{item?.label}</span>
                        </div>
                        {item?.badge && (
                          <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold">
                            {item?.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Mobile Profile Actions */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Account
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                    >
                      <Icon
                        name="User"
                        size={20}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group w-full text-left"
                    >
                      <Icon
                        name="Settings"
                        size={20}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-all duration-200 w-full text-left group"
                    >
                      <Icon
                        name="LogOut"
                        size={20}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
