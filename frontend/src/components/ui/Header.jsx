import { useAuth } from "context/AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Enhanced Icon Component with better styling
const Icon = ({ name, size = 16, color = "currentColor", className = "" }) => {
  const icons = {
    Zap: "⚡",
    Search: "🔍",
    Calendar: "📅",
    BarChart3: "📊",
    Settings: "⚙️",
    Shield: "🛡️",
    Bell: "🔔",
    X: "✖",
    User: "👤",
    Building: "🏢",
    CheckCircle: "✔",
    Clock: "🕒",
    MapPin: "📍",
    CreditCard: "💳",
    HelpCircle: "❓",
    LogOut: "🚪",
    Menu: "☰",
    ChevronDown: "▼",
    Star: "⭐",
    Sparkles: "✨",
    Home: "🏠",
  };
  return (
    <span
      className={`inline-flex items-center justify-center transition-all duration-200 ${className}`}
      style={{ fontSize: size, color }}
      role="img"
      aria-label={name}
    >
      {icons[name] || name}
    </span>
  );
};

// Enhanced Button Component
const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl focus:ring-blue-500",
    ghost:
      "bg-transparent hover:bg-white/10 backdrop-blur-sm text-gray-700 hover:text-blue-600",
    icon: "bg-transparent hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl text-gray-600 hover:text-blue-600 shadow-sm hover:shadow-md",
    premium:
      "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-2xl",
  };

  const sizes = {
    default: "px-6 py-2.5 text-sm rounded-xl",
    sm: "px-4 py-2 text-xs rounded-lg",
    icon: "p-3 rounded-xl",
    lg: "px-8 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Enhanced Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border-0 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
    {...props}
  />
);

const Header = () => {
  const { userProfile, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      message: "Tennis Court A booking confirmed for today at 3 PM",
      time: "2 min ago",
      unread: true,
      icon: "CheckCircle",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      id: 2,
      type: "reminder",
      title: "Upcoming Booking",
      message: "Don't forget your booking tomorrow at 3 PM",
      time: "1 hour ago",
      unread: true,
      icon: "Clock",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      id: 3,
      type: "update",
      title: "New Facility",
      message: "Elite Sports Complex added near you",
      time: "3 hours ago",
      unread: false,
      icon: "Sparkles",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  const roleConfig = {
    USER: {
      label: "Sports Enthusiast",
      icon: "User",
      gradient: "from-blue-500 to-cyan-500",
      navigation: [
        {
          label: "Find Venues",
          path: "/listings",
          icon: "Search",
          description: "Discover amazing sports facilities",
        },
        {
          label: "My Bookings",
          path: "/my-bookings",
          icon: "Calendar",
          badge: "3",
          description: "Manage your reservations",
        },
      ],
      showSearch: true,
    },
    OWNER: {
      label: "Facility Owner",
      icon: "Building",
      gradient: "from-purple-500 to-pink-500",
      navigation: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: "BarChart3",
          description: "View analytics & insights",
        },
        {
          label: "Manage Courts",
          path: "/facility-court-management",
          icon: "Settings",
          description: "Configure your facilities",
        },
      ],
      showSearch: false,
    },
    ADMIN: {
      label: "Administrator",
      icon: "Shield",
      gradient: "from-red-500 to-orange-500",
      navigation: [
        {
          label: "Platform Management",
          path: "/dashboard",
          icon: "Shield",
          badge: "12",
          description: "Oversee platform operations",
        },
      ],
      showSearch: true,
    },
  };

  const currentRole = userProfile?.role || "USER";
  const currentRoleConfig = roleConfig[currentRole] || roleConfig.USER;
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-dropdown"))
        setIsNotificationOpen(false);
      if (!event.target.closest(".profile-dropdown"))
        setIsProfileMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/venue-search-listings?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === "booking") navigate("/dashboard");
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

  const markAllAsRead = () => console.log("Mark all as read");

  if (loading || !user || !userProfile) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-xl shadow-gray-200/20"
            : "bg-white/95 backdrop-blur-md border-b border-gray-200/30"
        }`}
        role="banner"
      >
        {/* Gradient overlay for extra visual appeal */}
        <div className="absolute inset-0 pointer-events-none" />

        <div className="relative h-[4.5rem] px-6 lg:px-8 flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-4 group focus:outline-none"
              aria-label="Go to homepage"
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${currentRoleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon name="Zap" size={24} color="white" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-cyan-600 transition-all duration-300">
                  QuickCourt
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                    {currentRoleConfig.label}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentRoleConfig.gradient} animate-pulse`}
                  />
                </div>
              </div>
            </button>
          </div>

          {/* Enhanced Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-1"
            role="navigation"
          >
            {currentRoleConfig.navigation.map((item, index) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group relative flex items-center space-x-3 px-6 py-3 text-gray-700 hover:text-blue-600 rounded-2xl transition-all duration-300 hover:bg-white/80 hover:backdrop-blur-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                aria-label={item.label}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <Icon
                    name={item.icon}
                    size={20}
                    className="group-hover:scale-125 transition-all duration-300 group-hover:rotate-12"
                  />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{item.label}</span>
                  <span className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                    {item.description}
                  </span>
                </div>

                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </button>
            ))}
          </nav>

          {/* Enhanced Search Bar */}
          {currentRoleConfig.showSearch && (
            <div className="hidden md:flex relative">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <Input
                    type="search"
                    placeholder="Search venues, sports, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-96 pl-14 pr-12 py-4 bg-gray-50/80 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:shadow-xl placeholder:text-gray-400"
                    aria-label="Search venues"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icon
                      name="Search"
                      size={20}
                      className="text-gray-400 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-300"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 hover:scale-110 transition-all duration-200"
                      aria-label="Clear search"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}

                  {/* Search suggestions indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
                </div>
              </form>
            </div>
          )}

          {/* Enhanced Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Enhanced Role Badge */}
            <div className="hidden lg:flex items-center space-x-3 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentRoleConfig.gradient} animate-pulse`}
              />
              <Icon
                name={currentRoleConfig.icon}
                size={18}
                className="text-blue-500"
              />
              <span className="text-sm font-semibold text-gray-800">
                {currentRoleConfig.label}
              </span>
            </div>

            {/* Enhanced Notifications */}
            <div className="notification-dropdown relative">
              <Button
                variant="icon"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                  isNotificationOpen
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner"
                    : ""
                }`}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={isNotificationOpen}
              >
                <Icon
                  name="Bell"
                  size={22}
                  className={`${
                    isNotificationOpen
                      ? "text-blue-600 scale-110"
                      : "text-gray-600"
                  } transition-all duration-300`}
                />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center">
                    <span className="relative z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                      {unreadCount}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-75" />
                  </div>
                )}
              </Button>

              {isNotificationOpen && (
                <div
                  className="absolute right-0 top-full mt-4 w-96 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl z-[1001] animate-scale-in overflow-hidden"
                  role="menu"
                >
                  {/* Enhanced Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center space-x-3">
                        <Icon name="Bell" size={20} className="text-blue-500" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            {unreadCount}
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:bg-blue-50 hover:scale-105"
                          aria-label="Mark all notifications as read"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-5 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group border-b border-gray-100/50 ${
                            notification.unread
                              ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-l-4 border-blue-500"
                              : ""
                          }`}
                          role="menuitem"
                          tabIndex={0}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`p-3 rounded-2xl ${notification.bgColor} group-hover:scale-110 transition-all duration-300 shadow-sm`}
                            >
                              <Icon
                                name={notification.icon}
                                size={18}
                                className={notification.color}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <p
                                  className={`font-semibold text-sm ${
                                    notification.unread
                                      ? "text-gray-900"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center space-x-1">
                                <Icon name="Clock" size={12} />
                                <span>{notification.time}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Icon
                            name="Bell"
                            size={32}
                            className="text-gray-400"
                          />
                        </div>
                        <p className="text-gray-600 font-medium">
                          No notifications
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          You're all caught up!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Footer */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-blue-600 hover:bg-blue-100 hover:scale-105 font-semibold"
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
                variant="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105 ${
                  isProfileMenuOpen
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner scale-105"
                    : ""
                }`}
                aria-label="Profile menu"
                aria-expanded={isProfileMenuOpen}
              >
                <div className="relative">
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-2xl object-cover shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${currentRoleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon name="User" size={18} color="white" />
                    </div>
                  )}
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-md" />
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                </div>
              </Button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-4 w-72 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl z-[1001] animate-scale-in overflow-hidden"
                  role="menu"
                >
                  {/* Enhanced Profile Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200/50">
                    <div className="flex items-center space-x-4">
                      {userProfile?.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          className="w-14 h-14 rounded-2xl object-cover shadow-lg"
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${currentRoleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon name="User" size={24} color="white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">
                          {userProfile?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userProfile?.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                          <span className="text-xs text-gray-500 font-medium">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Menu Items */}
                  <div className="p-3">
                    {[
                      {
                        path: "/profile",
                        label: "My Profile",
                        icon: "User",
                        description: "Manage your account",
                      },
                      {
                        path: "/settings",
                        label: "Settings",
                        icon: "Settings",
                        description: "Customize preferences",
                      },
                      {
                        path: "/billing",
                        label: "Billing",
                        icon: "CreditCard",
                        description: "Payment & plans",
                      },
                      {
                        path: "/help",
                        label: "Help & Support",
                        icon: "HelpCircle",
                        description: "Get assistance",
                      },
                    ].map((item, index) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center space-x-4 px-4 py-3.5 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:scale-[1.02]"
                        role="menuitem"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                          <Icon
                            name={item.icon}
                            size={16}
                            className="group-hover:text-blue-600 transition-colors duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{item.label}</p>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}

                    <div className="border-t border-gray-200/50 my-3" />

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-4 px-4 py-3.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 w-full text-left group focus:outline-none focus:ring-2 focus:ring-red-500/30 hover:scale-[1.02]"
                      role="menuitem"
                    >
                      <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200 group-hover:scale-110 transition-all duration-300">
                        <Icon
                          name="LogOut"
                          size={16}
                          className="text-red-600"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Sign Out</p>
                        <p className="text-xs text-red-400">
                          See you next time!
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <Button
              variant="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Icon
                name={isMobileMenuOpen ? "X" : "Menu"}
                size={22}
                className={`transition-all duration-500 ${
                  isMobileMenuOpen ? "rotate-180 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[40] lg:hidden animate-in fade-in duration-500"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl border-l border-gray-200/50 z-[50] lg:hidden animate-in slide-in-from-right duration-500 shadow-2xl"
            role="menu"
          >
            <div className="flex flex-col h-full">
              {/* Enhanced Mobile Header */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${currentRoleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon name="Zap" size={18} color="white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-lg">
                      Menu
                    </span>
                    <p className="text-xs text-gray-500">
                      {currentRoleConfig.label}
                    </p>
                  </div>
                </div>
                <Button
                  variant="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:bg-red-100 hover:scale-105"
                  aria-label="Close menu"
                >
                  <Icon name="X" size={20} className="text-red-500" />
                </Button>
              </div>

              {/* Enhanced Mobile Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Mobile Search */}
                {currentRoleConfig.showSearch && (
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-900 mb-3"
                      htmlFor="mobile-search"
                    >
                      🔍 Search Venues
                    </label>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Input
                        id="mobile-search"
                        type="search"
                        placeholder="Search venues, sports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 bg-gray-50/80 rounded-2xl"
                        aria-label="Search venues"
                      />
                      <Icon
                        name="Search"
                        size={18}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </form>
                  </div>
                )}

                {/* Mobile Role Display */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    👤 Current Role
                  </label>
                  <div
                    className={`flex items-center space-x-4 px-5 py-4 bg-gradient-to-r ${currentRoleConfig.gradient} bg-opacity-10 rounded-2xl border border-gray-200/50`}
                  >
                    <Icon
                      name={currentRoleConfig.icon}
                      size={22}
                      className="text-blue-600"
                    />
                    <span className="font-semibold text-gray-900">
                      {currentRoleConfig.label}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentRoleConfig.gradient} animate-pulse ml-auto`}
                    />
                  </div>
                </div>

                {/* Enhanced Mobile Navigation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    🧭 Navigation
                  </label>
                  <nav className="space-y-2">
                    {currentRoleConfig.navigation.map((item, index) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between px-5 py-4 text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:scale-[1.02]"
                        role="menuitem"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                            <Icon
                              name={item.icon}
                              size={20}
                              className="group-hover:text-blue-600 transition-colors duration-300"
                            />
                          </div>
                          <div>
                            <span className="font-semibold">{item.label}</span>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Enhanced Mobile Account Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    ⚙️ Account
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        path: "/profile",
                        label: "Profile",
                        icon: "User",
                        description: "Manage account",
                      },
                      {
                        path: "/settings",
                        label: "Settings",
                        icon: "Settings",
                        description: "Preferences",
                      },
                    ].map((item, index) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-4 px-5 py-4 text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-300 group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:scale-[1.02]"
                        role="menuitem"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                          <Icon
                            name={item.icon}
                            size={20}
                            className="group-hover:text-blue-600 transition-colors duration-300"
                          />
                        </div>
                        <div>
                          <span className="font-semibold">{item.label}</span>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}

                    {/* Enhanced Logout Button */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-4 px-5 py-4 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 w-full text-left group focus:outline-none focus:ring-2 focus:ring-red-500/30 hover:scale-[1.02]"
                      role="menuitem"
                    >
                      <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200 group-hover:scale-110 transition-all duration-300">
                        <Icon
                          name="LogOut"
                          size={20}
                          className="text-red-600"
                        />
                      </div>
                      <div>
                        <span className="font-semibold">Sign Out</span>
                        <p className="text-xs text-red-400">Until next time!</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;
