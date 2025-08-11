import axios from "axios";
import { createContext, useContext } from "react";
import toast from "react-hot-toast";

const CourtContext = createContext({});

export const useCourt = () => {
  const context = useContext(CourtContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const CourtProvider = ({ children }) => {
  const API_BASE_URL =
    import.meta.env.REACT_APP_API_URL || "http://localhost:7000";

  // Helper function to handle API errors
  const handleApiError = async (response) => {
    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    }
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    "Content-Type": "application/json",
  });

  const createCourt = async (courtData) => {
    try {
      const response = await axios.post(`http://localhost:7000/owner/facilities/${courtData.facilityId}/courts`, courtData, {
        headers: getHeaders(),
      });
      toast.success("Court Created Successfully")
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const value = { createCourt };
  return (
    <CourtContext.Provider value={value}>{children}</CourtContext.Provider>
  );
};

export default CourtContext;
