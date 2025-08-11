// context/BookingContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Base API URL
  const API_BASE_URL = 'http://localhost:7000';

  // Create axios instance with default config
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for global error handling
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('jwtToken');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
  );

  // Enhanced error handling
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || `Error: ${error.response.status}`;
      toast.error(message);
      throw new Error(message);
    } else if (error.request) {
      // Network error
      const message = 'Network error. Please check your connection.';
      toast.error(message);
      throw new Error(message);
    } else {
      // Other error
      const message = error.message || 'An unexpected error occurred';
      toast.error(message);
      throw new Error(message);
    }
  };

  // Create a new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      const response = await api.post('/bookings', bookingData);
      
      // Add the new booking to the local state
      setBookings(prev => [response.data, ...prev]);
      
      toast.success('Booking created successfully!');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user bookings with pagination
  const getUserBookings = async (page = 0, size = 10, sort = 'bookingDate,desc') => {
    setLoading(true);
    try {
      const response = await api.get('/bookings', {
        params: {
          page,
          size,
          sort,
        },
      });

      const result = response.data;
      console.log(result)
      
      // Update state with paginated data
      setBookings(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
      setCurrentPage(result.number || 0);
      
      return result;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      
      // Update local state to reflect cancellation
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'CANCELLED' }
            : booking
        )
      );
      
      const message = response.data || 'Booking cancelled successfully!';
      toast.success(message);
      return message;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = async (bookingId) => {
    setLoading(true);
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update booking (additional utility method)
  const updateBooking = async (bookingId, updateData) => {
    setLoading(true);
    try {
      const response = await api.put(`/bookings/${bookingId}`, updateData);
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, ...response.data }
            : booking
        )
      );
      
      toast.success('Booking updated successfully!');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings (refetch current page)
  const refreshBookings = async () => {
    try {
      await getUserBookings(currentPage);
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    }
  };

  // Filter bookings by status
  const filterBookingsByStatus = (status) => {
    if (status === 'all') {
      return bookings;
    }
    return bookings.filter(booking => 
      booking.status?.toLowerCase() === status.toLowerCase()
    );
  };

  // Get booking statistics
  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
    };
    return stats;
  };

  // Search bookings
  const searchBookings = async (searchTerm, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/search', {
        params: {
          q: searchTerm,
          page,
          size,
        },
      });

      const result = response.data;
      setBookings(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
      setCurrentPage(result.number || 0);
      
      return result;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get bookings by date range
  const getBookingsByDateRange = async (startDate, endDate, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/date-range', {
        params: {
          startDate,
          endDate,
          page,
          size,
        },
      });

      const result = response.data;
      setBookings(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
      setCurrentPage(result.number || 0);
      
      return result;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear bookings state
  const clearBookings = () => {
    setBookings([]);
    setTotalPages(0);
    setTotalElements(0);
    setCurrentPage(0);
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= today && booking.status !== 'CANCELLED';
    });
  };

  // Get past bookings
  const getPastBookings = () => {
    const today = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate < today;
    });
  };

  const contextValue = {
    // State
    loading,
    bookings,
    totalPages,
    totalElements,
    currentPage,
    
    // Actions
    createBooking,
    getUserBookings,
    cancelBooking,
    getBookingById,
    updateBooking,
    refreshBookings,
    clearBookings,
    searchBookings,
    getBookingsByDateRange,
    
    // Utilities
    filterBookingsByStatus,
    getBookingStats,
    getUpcomingBookings,
    getPastBookings,
    
    // State setters (for manual state management if needed)
    setBookings,
    setLoading,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
