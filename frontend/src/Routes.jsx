import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserDashboardBookingManagement from './pages/user-dashboard-booking-management';
import VenueSearchListings from './pages/venue-search-listings';
import FacilityOwnerDashboard from './pages/facility-owner-dashboard';
import FacilityCourtManagement from './pages/facility-court-management';
import VenueDetailsBooking from './pages/venue-details-booking';
import AdminPlatformManagement from './pages/admin-platform-management';
import AuthPage from "pages/auth/AuthPage";
import Homepage from "pages/landingPage/HomePage";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/admin-dashboard" element={<AdminPlatformManagement />} />
        <Route path="/user-dashboard-booking-management" element={<UserDashboardBookingManagement />} />
        <Route path="/venue-search-listings" element={<VenueSearchListings />} />
        <Route path="/facility-owner-dashboard" element={<FacilityOwnerDashboard />} />
        <Route path="/facility-court-management" element={<FacilityCourtManagement />} />
        <Route path="/venue-details-booking" element={<VenueDetailsBooking />} />
        <Route path="/admin-platform-management" element={<AdminPlatformManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
