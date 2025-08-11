// src/contexts/ReviewContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { reviewService } from '../services/reviewService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const ReviewContext = createContext();

const reviewReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_USER_REVIEWS':
      return {
        ...state,
        userReviews: action.payload,
        loading: false
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        userReviews: [action.payload, ...state.userReviews]
      };
    case 'UPDATE_REVIEW':
      return {
        ...state,
        userReviews: state.userReviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        )
      };
    case 'REMOVE_REVIEW':
      return {
        ...state,
        userReviews: state.userReviews.filter(review => review.id !== action.payload)
      };
    case 'SET_CURRENT_REVIEW':
      return {
        ...state,
        currentReview: action.payload
      };
    case 'CLEAR_CURRENT_REVIEW':
      return {
        ...state,
        currentReview: null
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
    default:
      return state;
  }
};

const initialState = {
  userReviews: [],
  currentReview: null,
  loading: false,
  error: null
};

export const ReviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Add review - corresponds to ReviewController.addReview()
  const addReview = async (reviewData) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newReview = await reviewService.addReview(reviewData);
      
      dispatch({ type: 'ADD_REVIEW', payload: newReview });
      toast.success('Review added successfully!');
      
      return newReview;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add review';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update review - corresponds to ReviewController.updateReview()
  const updateReview = async (reviewId, reviewData) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedReview = await reviewService.updateReview(reviewId, reviewData);
      
      dispatch({ type: 'UPDATE_REVIEW', payload: updatedReview });
      toast.success('Review updated successfully!');
      
      return updatedReview;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update review';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete review - corresponds to ReviewController.deleteReview()
  const deleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await reviewService.deleteReview(reviewId);
      
      dispatch({ type: 'REMOVE_REVIEW', payload: reviewId });
      toast.success('Review deleted successfully!');
      
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete review';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get user reviews
  const getUserReviews = async () => {
    if (!isAuthenticated) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const reviews = await reviewService.getUserReviews();
      
      dispatch({ type: 'SET_USER_REVIEWS', payload: reviews });
      return reviews;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user reviews';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Set current review
  const setCurrentReview = (review) => {
    dispatch({ type: 'SET_CURRENT_REVIEW', payload: review });
  };

  // Clear current review
  const clearCurrentReview = () => {
    dispatch({ type: 'CLEAR_CURRENT_REVIEW' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    addReview,
    updateReview,
    deleteReview,
    getUserReviews,
    setCurrentReview,
    clearCurrentReview,
    clearError
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};