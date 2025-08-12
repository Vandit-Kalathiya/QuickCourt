// src/contexts/OwnerContext.jsx
import React, { createContext, useContext, useReducer } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const OwnerContext = createContext();

const ownerReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_OWNER_FACILITIES":
      return {
        ...state,
        facilities: action.payload,
        loading: false,
      };
    case "ADD_FACILITY":
      return {
        ...state,
        facilities: [action.payload, ...state.facilities],
      };
    case "UPDATE_FACILITY":
      return {
        ...state,
        facilities: state.facilities.map((facility) =>
          facility.id === action.payload.id ? action.payload : facility
        ),
      };
    case "SET_FACILITY_COURTS":
      return {
        ...state,
        facilityCourts: action.payload,
      };
    case "ADD_COURT":
      return {
        ...state,
        facilityCourts: [...state.facilityCourts, action.payload],
      };
    case "UPDATE_COURT":
      return {
        ...state,
        facilityCourts: state.facilityCourts.map((court) =>
          court.id === action.payload.id ? action.payload : court
        ),
      };
    case "SET_DASHBOARD_DATA":
      return {
        ...state,
        dashboardData: action.payload,
        loading: false,
      };
    case "SET_OWNER_BOOKINGS":
      return {
        ...state,
        ownerBookings: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
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
  error: null,
};

export const OwnerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ownerReducer, initialState);
  const { user, isOwner, isAuthenticated } = useAuth();

  // Create facility - corresponds to OwnerController.createFacility()
  const createFacility = async (facilityData, photos) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const formData = new FormData();
      Object.keys(facilityData).forEach(key => {
        if (facilityData[key] !== null && facilityData[key] !== undefined) {
          formData.append(key, facilityData[key]);
        }
      });
      
      if (photos) {
        formData.append('photo', photos);
      }

      const response = await axios.post(
        `http://localhost:7000/owner/facilities`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({ type: "ADD_FACILITY", payload: response.data });
      toast.success(
        "Facility created successfully! Waiting for admin approval."
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create facility";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Update facility - corresponds to OwnerController.updateFacility()
  const updateFacility = async (facilityId, facilityData, photos) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const formData = new FormData();
      Object.keys(facilityData).forEach(key => {
        if (facilityData[key] !== null && facilityData[key] !== undefined) {
          formData.append(key, facilityData[key]);
        }
      });
      
      if (photos) {
        formData.append('photo', photos);
      }

      const response = await axios.put(
        `http://localhost:7000/owner/facilities/${facilityId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch({ type: "UPDATE_FACILITY", payload: response.data });
      toast.success("Facility updated successfully!");

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update facility";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Get owner facilities - corresponds to OwnerController.getOwnerFacilities()
  const getOwnerFacilities = async () => {
    const res = await axios.get(`http://localhost:7000/owner/facilities`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    console.log(res.data);
    return res.data;
  };

  // Create court - corresponds to OwnerController.createCourt()
  const createCourt = async (facilityId, courtData) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.post(
        `http://localhost:7000/owner/facilities/${facilityId}/courts`,
        courtData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({ type: "ADD_COURT", payload: response.data });
      toast.success("Court added successfully!");

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create court";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Update court - corresponds to OwnerController.updateCourt()
  const updateCourt = async (courtId, courtData) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.put(
        `http://localhost:7000/owner/courts/${courtId}`,
        courtData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({ type: "UPDATE_COURT", payload: response.data });
      toast.success("Court updated successfully!");

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update court";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Get facility courts - corresponds to OwnerController.getFacilityCourts()
  const getFacilityCourts = async (facilityId) => {
    const res = await axios.get(`http://localhost:7000/owner/facilities/${facilityId}/courts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    console.log(res.data);
    return res.data;
  };

  // Block time slot - corresponds to OwnerController.blockTimeSlot()
  const blockTimeSlot = async (courtId, date, startTime, endTime) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.post(
        `http://localhost:7000/owner/courts/${courtId}/block`,
        null,
        {
          params: { date, startTime, endTime },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Block error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to block time slot";
      throw new Error(errorMessage);
    }
  };

  // Unblock time slot - corresponds to OwnerController.unblockTimeSlot()
  const unblockTimeSlot = async (courtId, date, startTime, endTime) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.post(
        `http://localhost:7000/owner/courts/${courtId}/unblock`,
        null,
        {
          params: { date, startTime, endTime },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Unblock error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to unblock time slot";
      throw new Error(errorMessage);
    }
  };

  // Get owner dashboard - corresponds to OwnerController.getOwnerDashboard()
  const getOwnerDashboard = async () => {
    if (!user || !isOwner()) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await axios.get(
        `http://localhost:7000/owner/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      dispatch({ type: "SET_DASHBOARD_DATA", payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch dashboard data";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const getApprovedFacilities = async () => {
    const res = await axios.get(
      `http://localhost:7000/owner/approved-facilities`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    console.log(res.data);
    return res.data;
  };

  // Get available slots for a court on a specific date
  const getAvailableSlots = async (courtId, date) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/courts/${courtId}/available-slots`,
        {
          params: { date },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available slots:", error);
      throw error;
    }
  };

  // Get blocked slots for a court on a specific date
  const getBlockedSlots = async (courtId, date) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/courts/${courtId}/blocked-slots`,
        {
          params: { date },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching blocked slots:", error);
      return []; // Return empty array if endpoint doesn't exist yet
    }
  };

  // Get all slots (available + blocked) for a court on a specific date
  const getAllSlots = async (courtId, date) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/courts/${courtId}/all-slots`,
        {
          params: { date },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all slots:", error.response?.data || error.message);
      return { available: [], blocked: [] };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Pricing Rules Functions
  const createPricingRule = async (ruleData) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.post(
        `http://localhost:7000/owner/pricing-rules`,
        ruleData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Pricing rule created successfully!");
      return response.data;
    } catch (error) {
      console.error('Create pricing rule error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to create pricing rule";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePricingRule = async (ruleId, ruleData) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.put(
        `http://localhost:7000/owner/pricing-rules/${ruleId}`,
        ruleData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Pricing rule updated successfully!");
      return response.data;
    } catch (error) {
      console.error('Update pricing rule error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to update pricing rule";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePricingRule = async (ruleId) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.delete(
        `http://localhost:7000/owner/pricing-rules/${ruleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      toast.success("Pricing rule deleted successfully!");
      return response.data;
    } catch (error) {
      console.error('Delete pricing rule error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to delete pricing rule";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const togglePricingRule = async (ruleId) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.post(
        `http://localhost:7000/owner/pricing-rules/${ruleId}/toggle`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      toast.success("Pricing rule status updated successfully!");
      return response.data;
    } catch (error) {
      console.error('Toggle pricing rule error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to toggle pricing rule";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getFacilityPricingRules = async (facilityId) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.get(
        `http://localhost:7000/owner/pricing-rules/facility/${facilityId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get facility pricing rules error:', error.response?.data || error.message);
      return [];
    }
  };

  const getCourtPricingRules = async (courtId) => {
    if (!user || !isOwner()) {
      throw new Error("Unauthorized");
    }

    try {
      const response = await axios.get(
        `http://localhost:7000/owner/pricing-rules/court/${courtId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Get court pricing rules error:', error.response?.data || error.message);
      return [];
    }
  };

  const calculatePrice = async (courtId, date, time, durationHours) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/owner/pricing-rules/calculate-price`,
        {
          params: { courtId, date, time, durationHours },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Calculate price error:', error.response?.data || error.message);
      return null;
    }
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
    getAvailableSlots,
    getBlockedSlots,
    getAllSlots,
    getApprovedFacilities,
    getOwnerDashboard,
    clearError,
    // Pricing Rules
    createPricingRule,
    updatePricingRule,
    deletePricingRule,
    togglePricingRule,
    getFacilityPricingRules,
    getCourtPricingRules,
    calculatePrice,
  };

  return (
    <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
};
