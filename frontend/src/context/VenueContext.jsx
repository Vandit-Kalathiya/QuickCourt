// src/contexts/VenueContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VenueContext = createContext();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:7000",
  timeout: 10000,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const VenueProvider = ({ children }) => {
  const [venues, setVenues] = useState([]);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [venueReviews, setVenueReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Get all approved facilities
  const getFacilities = async (sports = [], name = "", page = 0, size = 12) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size,
        ...(name && { name }),
        ...(sports.length > 0 && { sports: sports.join(",") }),
      };

      const response = await api.get("/venues", { params });

      setVenues(response.content || []);
      setPagination({
        page: response.number,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        hasNext: !response.last,
        hasPrevious: response.number > 0,
      });

      return response;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get facility by ID
  const getFacilityById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const venue = await api.get(`/facilities/${id}`);

      setCurrentVenue(venue);
      return venue;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get facility reviews
  const getFacilityReviews = async (id, page = 0, size = 10) => {
    try {
      setError(null);

      const response = await api.get(`/facilities/${id}/reviews`, {
        params: { page, size },
      });

      if (page === 0) {
        setVenueReviews(response.content || []);
      } else {
        setVenueReviews((prev) => [...prev, ...(response.content || [])]);
      }

      return response;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    }
  };

  // Add a new review
  const addFacilityReview = async (facilityId, reviewData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(
        `/facilities/${facilityId}/reviews`,
        reviewData
      );

      // Add the new review to the beginning of the list
      setVenueReviews((prev) => [response, ...prev]);

      toast.success("Review added successfully!");
      return response;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load more venues for pagination
  const loadMoreVenues = async (sports = [], name = "") => {
    if (!pagination.hasNext) return;

    try {
      setLoading(true);

      const params = {
        page: pagination.page + 1,
        size: pagination.size,
        ...(name && { name }),
        ...(sports.length > 0 && { sports: sports.join(",") }),
      };

      const response = await api.get("/facilities", { params });

      setVenues((prev) => [...prev, ...(response.content || [])]);
      setPagination({
        page: response.number,
        size: response.size,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        hasNext: !response.last,
        hasPrevious: response.number > 0,
      });

      return response;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Search venues
  const searchVenues = async (sports = [], name = "") => {
    return await getFacilities(sports, name, 0, pagination.size);
  };

  // Clear current venue
  const clearCurrentVenue = () => {
    setCurrentVenue(null);
    setVenueReviews([]);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Reset venues list
  const resetVenues = () => {
    setVenues([]);
    setPagination({
      page: 0,
      size: 12,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      hasPrevious: false,
    });
  };

  const value = {
    // State
    venues,
    currentVenue,
    venueReviews,
    loading,
    error,
    pagination,

    // Actions
    getFacilities,
    getFacilityById,
    getFacilityReviews,
    addFacilityReview,
    loadMoreVenues,
    searchVenues,
    clearCurrentVenue,
    clearError,
    resetVenues,
  };

  return (
    <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
  );
};

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error("useVenue must be used within a VenueProvider");
  }
  return context;
};
