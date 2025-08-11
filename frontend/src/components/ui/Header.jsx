import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock Icon Component
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
  };
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size, color }}
      role="img"
      aria-label={name}
    >
      {icons[name] || name}
    </span>
  );
};

// Mock Button Component
const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-transparent hover:bg-gray-100",
    icon: "bg-transparent hover:bg-gray-100 rounded-full",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    icon: "p-2",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Mock Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 ${className}`}
    {...props}
  />
);

// Mock AuthContext
const useAuth = () => ({
  userProfile: {
    role: "USER",
    name: "John Doe",
    email: "john@example.com",
    avatar: null,
  },
  user: { uid: "123" },
  logout: async () => console.log("Logged out"),
  loading: false,
});

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
      color: "text-green-500",
    },
    {
      id: 2,
      type: "reminder",
      title: "Upcoming Booking",
      message: "Don't forget your booking tomorrow at 3 PM",
      time: "1 hour ago",
      unread: true,
      icon: "Clock",
      color: "text-yellow-500",
    },
    {
      id: 3,
      type: "update",
      title: "New Facility",
      message: "Elite Sports Complex added near you",
      time: "3 hours ago",
      unread: false,
      icon: "MapPin",
      color: "text-blue-500",
    },
  ];

  const roleConfig = {
    USER: {
      label: "Sports Enthusiast",
      icon: "User",
      navigation: [
        { label: "Find Venues", path: "/listings", icon: "Search" },
        {
          label: "My Bookings",
          path: "/my-bookings",
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
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm"
            : "bg-white border-b border-gray-200"
        }`}
        role="banner"
      >
        <div className="h-[4.5rem] px-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 group focus:outline-none"
              aria-label="Go to homepage"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                  <Icon name="Zap" size={22} color="white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  SportBooker
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {currentRoleConfig.label}
                </span>
              </div>
            </button>
          </div>

          <nav
            className="hidden lg:flex items-center space-x-2"
            role="navigation"
          >
            {currentRoleConfig.navigation.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={item.label}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {item.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-blue-500/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10" />
              </button>
            ))}
          </nav>

          {currentRoleConfig.showSearch && (
            <div className="hidden md:flex relative">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="relative overflow-hidden rounded-lg">
                  <Input
                    type="search"
                    placeholder="Search venues, sports, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 pl-12 pr-10 py-2.5 bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    aria-label="Search venues"
                  />
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors duration-200"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      aria-label="Clear search"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <Icon
                name={currentRoleConfig.icon}
                size={16}
                className="text-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">
                {currentRoleConfig.label}
              </span>
            </div>

            <div className="notification-dropdown relative">
              <Button
                variant="icon"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative hover:bg-gray-100 ${
                  isNotificationOpen ? "bg-gray-100 shadow-inner" : ""
                }`}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={isNotificationOpen}
              >
                <Icon
                  name="Bell"
                  size={20}
                  className={
                    isNotificationOpen ? "text-blue-600" : "text-gray-600"
                  }
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {isNotificationOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-[1001] animate-scale-in"
                  role="menu"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-gray-900 flex items-center space-x{MoO}2">
                      <Icon name="Bell" size={18} />
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:bg-blue-50"
                        aria-label="Mark all notifications as read"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 group ${
                            notification.unread
                              ? "bg-blue-50/50 border-l-2 border-blue-500"
                              : ""
                          } ${
                            index !== notifications.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                          role="menuitem"
                          tabIndex={0}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleNotificationClick(notification)
                          }
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                notification.unread
                                  ? "bg-blue-50"
                                  : "bg-gray-50"
                              } group-hover:scale-110 transition-transform duration-200`}
                            >
                              <Icon
                                name={notification.icon}
                                size={16}
                                className={notification.color}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p
                                  className={`font-medium text-sm ${
                                    notification.unread
                                      ? "text-gray-900"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                                <Icon name="Clock" size={12} />
                                <span>{notification.time}</span>
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
                          className="text-gray-400 mx-auto mb-2"
                        />
                        <p className="text-gray-600">No notifications</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        navigate("/notifications");
                        setIsNotificationOpen(false);
                      }}
                      aria-label="View all notifications"
                    >
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-dropdown relative">
              <Button
                variant="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`rounded-full hover:bg-gray-100 ${
                  isProfileMenuOpen ? "bg-gray-100 shadow-inner" : ""
                }`}
                aria-label="Profile menu"
                aria-expanded={isProfileMenuOpen}
              >
                <div className="relative">
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <Icon name="User" size={16} color="white" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </Button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[1001] animate-scale-in"
                  role="menu"
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                      {userProfile?.avatar ? (
                        <img
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Icon name="User" size={18} color="white" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {userProfile?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userProfile?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {[
                      { path: "/profile", label: "My Profile", icon: "User" },
                      {
                        path: "/settings",
                        label: "Settings",
                        icon: "Settings",
                      },
                      {
                        path: "/billing",
                        label: "Billing",
                        icon: "CreditCard",
                      },
                      {
                        path: "/help",
                        label: "Help & Support",
                        icon: "HelpCircle",
                      },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        role="menuitem"
                        tabIndex={0}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          navigate(item.path) &&
                          setIsProfileMenuOpen(false)
                        }
                      >
                        <Icon
                          name={item.icon}
                          size={16}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-200 my-2" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full text-left group focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      role="menuitem"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleLogout() &&
                        setIsProfileMenuOpen(false)
                      }
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

            <Button
              variant="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white border-l border-gray-200 z-[50] lg:hidden animate-in slide-in-from-right duration-300"
            role="menu"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={16} color="white" />
                  </div>
                  <span className="font-semibold text-gray-900">Menu</span>
                </div>
                <Button
                  variant="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {currentRoleConfig.showSearch && (
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-900 mb-2"
                      htmlFor="mobile-search"
                    >
                      Search Venues
                    </label>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Input
                        id="mobile-search"
                        type="search"
                        placeholder="Search venues, sports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 bg-gray-50"
                        aria-label="Search venues"
                      />
                      <Icon
                        name="Search"
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </form>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Current Role
                  </label>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Icon
                      name={currentRoleConfig.icon}
                      size={20}
                      className="text-blue-500"
                    />
                    <span className="font-medium text-gray-900">
                      {currentRoleConfig.label}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Navigation
                  </label>
                  <nav className="space-y-1">
                    {currentRoleConfig.navigation.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        role="menuitem"
                        tabIndex={0}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          navigate(item.path) &&
                          setIsMobileMenuOpen(false)
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            name={item.icon}
                            size={20}
                            className="group-hover:scale-110 transition-transform duration-200"
                          />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Account
                  </label>
                  <div className="space-y-1">
                    {[
                      { path: "/profile", label: "Profile", icon: "User" },
                      {
                        path: "/settings",
                        label: "Settings",
                        icon: "Settings",
                      },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        role="menuitem"
                        tabIndex={0}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          navigate(item.path) &&
                          setIsMobileMenuOpen(false)
                        }
                      >
                        <Icon
                          name={item.icon}
                          size={20}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full text-left group focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      role="menuitem"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleLogout() &&
                        setIsMobileMenuOpen(false)
                      }
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
