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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Protected route component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  const isAuthenticated = user;

  if (!isAuthenticated) {
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

// Public route component (redirects to dashboard if already logged in)
const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  const isAuthenticated = user;

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return <Outlet />;
};

// Public layout for routes that should be accessible regardless of auth status
const PublicLayout = () => {
  return <Outlet />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin-dashboard"
              element={<AdminPlatformManagement />}
            />
            <Route
              path="/user-dashboard"
              element={<UserDashboardBookingManagement />}
            />
            <Route
              path="/venue-search-listings"
              element={<VenueSearchListings />}
            />
            <Route
              path="/facility-owner-dashboard"
              element={<FacilityOwnerDashboard />}
            />
            <Route
              path="/facility-court-management"
              element={<FacilityCourtManagement />}
            />
            <Route
              path="/venue-details-booking"
              element={<VenueDetailsBooking />}
            />
            <Route
              path="/admin-platform-management"
              element={<AdminPlatformManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
