// src/contexts/VenueContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { venueService } from '../services/venueService';
import { toast } from 'react-toastify';

const VenueContext = createContext();

const venueReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_VENUES':
      return {
        ...state,
        venues: action.payload,
        loading: false
      };
    case 'SET_CURRENT_VENUE':
      return {
        ...state,
        currentVenue: action.payload,
        loading: false
      };
    case 'SET_VENUE_REVIEWS':
      return {
        ...state,
        venueReviews: action.payload
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        venueReviews: [action.payload, ...state.venueReviews]
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'CLEAR_CURRENT_VENUE':
      return {
        ...state,
        currentVenue: null,
        venueReviews: []
      };
    default:
      return state;
  }
};

const initialState = {
  venues: [],
  currentVenue: null,
  venueReviews: [],
  filters: {
    sports: [],
    name: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  pagination: {
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  },
  loading: false,
  error: null
};

export const VenueProvider = ({ children }) => {
  const [state, dispatch] = useReducer(venueReducer, initialState);

  // Fetch venues - corresponds to VenueController.getFacilities()
  const fetchVenues = async (page = 0, size = 12, filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await venueService.getVenues(page, size, filters);
      
      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: !response.last,
          hasPrevious: response.number > 0
        }
      });

      dispatch({ type: 'SET_VENUES', payload: response.content });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch venues';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Get venue by ID - corresponds to VenueController.getFacility()
  const getVenueById = async (venueId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const venue = await venueService.getVenueById(venueId);
      
      dispatch({ type: 'SET_CURRENT_VENUE', payload: venue });
      return venue;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch venue details';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Get venue reviews - corresponds to VenueController.getFacilityReviews()
  const getVenueReviews = async (venueId, page = 0, size = 10) => {
    try {
      const response = await venueService.getVenueReviews(venueId, page, size);
      
      if (page === 0) {
        dispatch({ type: 'SET_VENUE_REVIEWS', payload: response.content });
      } else {
        dispatch({ 
          type: 'SET_VENUE_REVIEWS', 
          payload: [...state.venueReviews, ...response.content] 
        });
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch reviews';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Set filters
  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  // Clear current venue
  const clearCurrentVenue = () => {
    dispatch({ type: 'CLEAR_CURRENT_VENUE' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Search venues with filters
  const searchVenues = async (searchFilters = {}) => {
    const mergedFilters = { ...state.filters, ...searchFilters };
    dispatch({ type: 'SET_FILTERS', payload: mergedFilters });
    await fetchVenues(0, state.pagination.size, mergedFilters);
  };

  // Load more venues (pagination)
  const loadMoreVenues = async () => {
    if (state.pagination.hasNext) {
      const response = await venueService.getVenues(
        state.pagination.page + 1, 
        state.pagination.size, 
        state.filters
      );
      
      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          page: response.number,
          size: response.size,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          hasNext: !response.last,
          hasPrevious: response.number > 0
        }
      });

      dispatch({ 
        type: 'SET_VENUES', 
        payload: [...state.venues, ...response.content] 
      });
    }
  };

  const value = {
    ...state,
    fetchVenues,
    getVenueById,
    getVenueReviews,
    setFilters,
    clearCurrentVenue,
    clearError,
    searchVenues,
    loadMoreVenues
  };

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  );
};

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};