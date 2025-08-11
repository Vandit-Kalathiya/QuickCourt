import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserDashboardBookingManagement from "./pages/user-dashboard-booking-management";
import VenueSearchListings from "./pages/venue-search-listings";
import FacilityOwnerDashboard from "./pages/facility-owner-dashboard";
import FacilityCourtManagement from "./pages/facility-court-management";
import VenueDetailsBooking from "./pages/venue-details-booking";
import AdminPlatformManagement from "./pages/admin-platform-management";
import AuthPage from "pages/auth/AuthPage";
import Homepage from "pages/landingPage/HomePage";
import { useAuth } from "context/AuthContext";
import Header from "components/ui/Header";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Protected route component
const ProtectedRoute = () => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !userProfile) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
};

// Auth route component (only redirects from /auth page if already logged in)
const AuthRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Only redirect to dashboard if user is on the auth page and already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthPage />;
};

// Public layout for routes that should be accessible regardless of auth status
const PublicLayout = () => {
  return <Outlet />;
};

// Single dashboard component that renders based on role
const Dashboard = () => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !userProfile) {
    return <Navigate to="/auth" replace />;
  }

  // Render appropriate dashboard based on user role
  switch (userProfile.role) {
    case "USER":
      return <UserDashboardBookingManagement />;
    case "ADMIN":
      return <AdminPlatformManagement />;
    case "OWNER":
      return <FacilityOwnerDashboard />;
    default:
      return <NotFound />; // Default fallback
  }
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/listings"
              element={<VenueSearchListings />}
            />
            <Route
              path="/venue-booking"
              element={<VenueDetailsBooking />}
            />
          </Route>

          {/* Auth route (redirects to dashboard if already logged in) */}
          <Route path="/auth" element={<AuthRoute />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Single dashboard route that renders based on user role */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Other protected routes */}
          </Route>
          <Route
            path="/facility-court-management"
            element={<FacilityCourtManagement />}
          />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
