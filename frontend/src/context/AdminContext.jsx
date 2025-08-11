// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const AdminContext = createContext({});

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // const { user, userProfile } = useAuth();

  // Get facility requests - corresponds to AdminController.getFacilityRequests()
  const getFacilityRequests = async () => {
    const res = await axios.get(
      `http://localhost:7000/admin/facility-requests`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );

    console.log(res.data);
    return res.data;
  };

  useEffect(() => {
    const res = getFacilityRequests()
    console.log(res);
    console.log("Hello");
    
  }, []);

  const value = {
    getFacilityRequests,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;
