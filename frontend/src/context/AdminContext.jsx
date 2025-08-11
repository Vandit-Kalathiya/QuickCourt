// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_FACILITY_REQUESTS':
      return {
        ...state,
        facilityRequests: action.payload,
        loading: false
      };
    case 'UPDATE_FACILITY_REQUEST':
      return {
        ...state,
        facilityRequests: state.facilityRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        )
      };
    case 'REMOVE_FACILITY_REQUEST':
      return {
        ...state,
        facilityRequests: state.facilityRequests.filter(request => 
          request.id !== action.payload
        )
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        dashboardData: action.payload,
        loading: false
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
  facilityRequests: [],
  users: [],
  dashboardData: null,
  loading: false,
  error: null
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const { isAuthenticated, isAdmin } = useAuth();

  // Get facility requests - corresponds to AdminController.getFacilityRequests()
  const getFacilityRequests = async (page = 0, size = 10) => {
    if (!isAuthenticated || !isAdmin()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await adminService.getFacilityRequests(page, size);
      
      dispatch({ type: 'SET_FACILITY_REQUESTS', payload: response.content });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch facility requests';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Approve facility - corresponds to AdminController.approveFacility()
  const approveFacility = async (facilityId) => {
    if (!isAuthenticated || !isAdmin()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await adminService.approveFacility(facilityId);
      
      // Update the facility request status in state
      dispatch({
        type: 'UPDATE_FACILITY_REQUEST',
        payload: { id: facilityId, status: 'APPROVED' }
      });
      
      toast.success('Facility approved successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to approve facility';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Reject facility - corresponds to AdminController.rejectFacility()
  const rejectFacility = async (facilityId, reason) => {
    if (!isAuthenticated || !isAdmin()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await adminService.rejectFacility(facilityId, reason);
      
      // Update the facility request status in state
      dispatch({
        type: 'UPDATE_FACILITY_REQUEST',
        payload: { id: facilityId, status: 'REJECTED', rejectionReason: reason }
      });
      
      toast.success('Facility rejected successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reject facility';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get all users - corresponds to AdminController.getAllUsers()
  const getAllUsers = async (page = 0, size = 10) => {
    if (!isAuthenticated || !isAdmin()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await adminService.getAllUsers(page, size);
      
      dispatch({ type: 'SET_USERS', payload: response.content });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Ban user - corresponds to AdminController.banUser()
  const banUser = async (userId) => {
    if (!isAuthenticated || !isAdmin()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await adminService.banUser(userId);
      
      // Update user status in state
      dispatch({
        type: 'UPDATE_USER',
        payload: { id: userId, banned: true }
      });
      
      toast.success('User banned successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to ban user';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Unban user - corresponds to AdminController.unbanUser()
  const unbanUser = async (userId) => {
    if (!isAuthenticated || !isAdmin()) {
      throw new Error('Unauthorized');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await adminService.unbanUser(userId);
      
      // Update user status in state
      dispatch({
        type: 'UPDATE_USER',
        payload: { id: userId, banned: false }
      });
      
      toast.success('User unbanned successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to unban user';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get admin dashboard - corresponds to AdminController.getAdminDashboard()
  const getAdminDashboard = async () => {
    if (!isAuthenticated || !isAdmin()) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const dashboardData = await adminService.getAdminDashboard();
      
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
    getFacilityRequests,
    approveFacility,
    rejectFacility,
    getAllUsers,
    banUser,
    unbanUser,
    getAdminDashboard,
    clearError
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};