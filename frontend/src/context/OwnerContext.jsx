// src/contexts/OwnerContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const OwnerContext = createContext();

const ownerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_OWNER_FACILITIES':
      return {
        ...state,
        facilities: action.payload,
        loading: false
      };
    case 'ADD_FACILITY':
      return {
        ...state,
        facilities: [action.payload, ...state.facilities]
      };
    case 'UPDATE_FACILITY':
      return {
        ...state,
        facilities: state.facilities.map(facility =>
          facility.id === action.payload.id ? action.payload : facility
        )
      };
    case 'SET_FACILITY_COURTS':
      return {
        ...state,
        facilityCourts: action.payload
      };
    case 'ADD_COURT':
      return {
        ...state,
        facilityCourts: [...state.facilityCourts, action.payload]
      };
    case 'UPDATE_COURT':
      return {
        ...state,
        facilityCourts: state.facilityCourts.map(court =>
          court.id === action.payload.id ? action.payload : court
        )
      };
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        dashboardData: action.payload,
        loading: false
      };
    case 'SET_OWNER_BOOKINGS':
      return {
        ...state,
        ownerBookings: action.payload
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
  facilities: [],
  facilityCourts: [],
  ownerBookings: [],
  dashboardData: null,
  loading: false,
  error: null
};

export const OwnerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ownerReducer, initialState);
  const { user, isOwner } = useAuth();

  // Create facility - corresponds to OwnerController.createFacility()
  const createFacility = async (facilityData, photos) => {
    if (!user || !isOwner()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newFacility = await ownerService.createFacility(facilityData);
      
      dispatch({ type: 'ADD_FACILITY', payload: newFacility });
      toast.success('Facility created successfully! Waiting for admin approval.');
      
      return newFacility;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create facility';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update facility - corresponds to OwnerController.updateFacility()
  const updateFacility = async (facilityId, facilityData, photos) => {
    if (!isAuthenticated || !isOwner()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedFacility = await ownerService.updateFacility(facilityId, facilityData, photos);
      
      dispatch({ type: 'UPDATE_FACILITY', payload: updatedFacility });
      toast.success('Facility updated successfully!');
      
      return updatedFacility;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update facility';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get owner facilities - corresponds to OwnerController.getOwnerFacilities()
  const getOwnerFacilities = async () => {
    const res = await axios.get(`http://localhost:7000/owner/facilities`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
      }
    });

    console.log(res.data);
    return res.data;
  };

  // Create court - corresponds to OwnerController.createCourt()
  const createCourt = async (facilityId, courtData) => {
    if (!isAuthenticated || !isOwner()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newCourt = await ownerService.createCourt(facilityId, courtData);
      
      dispatch({ type: 'ADD_COURT', payload: newCourt });
      toast.success('Court added successfully!');
      
      return newCourt;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create court';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update court - corresponds to OwnerController.updateCourt()
  const updateCourt = async (courtId, courtData) => {
    if (!isAuthenticated || !isOwner()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updatedCourt = await ownerService.updateCourt(courtId, courtData);
      
      dispatch({ type: 'UPDATE_COURT', payload: updatedCourt });
      toast.success('Court updated successfully!');
      
      return updatedCourt;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update court';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get facility courts - corresponds to OwnerController.getFacilityCourts()
  const getFacilityCourts = async (facilityId) => {
    if (!isAuthenticated || !isOwner()) return;

    try {
      const courts = await ownerService.getFacilityCourts(facilityId);
      
      dispatch({ type: 'SET_FACILITY_COURTS', payload: courts });
      return courts;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch courts';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Block time slot - corresponds to OwnerController.blockTimeSlot()
  const blockTimeSlot = async (courtId, date, startTime, endTime) => {
    if (!isAuthenticated || !isOwner()) {
      throw new Error('Unauthorized');
    }

    try {
      await ownerService.blockTimeSlot(courtId, date, startTime, endTime);
      toast.success('Time slot blocked successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to block time slot';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Unblock time slot - corresponds to OwnerController.unblockTimeSlot()
  const unblockTimeSlot = async (courtId, date) => {
    if (!isAuthenticated || !isOwner()) {
      throw new Error('Unauthorized');
    }

    try {
      await ownerService.unblockTimeSlot(courtId, date);
      toast.success('Time slot unblocked successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unblock time slot';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Get owner dashboard - corresponds to OwnerController.getOwnerDashboard()
  const getOwnerDashboard = async () => {
    if (!isAuthenticated || !isOwner()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const dashboardData = await ownerService.getOwnerDashboard();
      
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
      return dashboardData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    createFacility,
    updateFacility,
    getOwnerFacilities,
    createCourt,
    updateCourt,
    getFacilityCourts,
    blockTimeSlot,
    unblockTimeSlot,
    getOwnerDashboard,
    clearError
  };

  return (
    <OwnerContext.Provider value={value}>
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
};