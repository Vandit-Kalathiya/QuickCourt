import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      throw new Error(errorMessage);
    }
    return response;
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    "Content-Type": "application/json",
  });

  // Get current user profile from token
  const getCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/current`, {
        headers: getHeaders(),
      });

      await handleApiError(response);

      // Since /current returns user profile data, we'll parse it
      const data = await response.json();

      return {
        mobileNumber: data.mobileNumber,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      };
    } catch (err) {
      throw new Error("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token && isMounted) {
        try {
          setLoading(true);
          const userData = await getCurrentUser(token);

          // Set basic user data - you may need to adjust this based on your JWT payload
          setUser(userData ? true : false);
          setUserProfile(userData);
          setError(null);
        } catch (err) {
          setError(err.message || "Failed to load user session");
          localStorage.removeItem("jwtToken");
          setUser(null);
          setUserProfile(null);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (identifier, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ identifier, password }),
      });

      await handleApiError(response);

      const data = await response.json();

      console.log(data);

      // Expecting JwtResponse with token field
      if (!data.jwtToken) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("jwtToken", data.jwtToken);

      const userData = await getCurrentUser(data.jwtToken);

      setUser(userData ? true : false);
      setUserProfile(userData);

      return data;
    } catch (error) {
      setError(error.message || "Failed to sign in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (signUpData) => {
    try {
      setError(null);
      setLoading(true);

      console.log(signUpData);

      const response = await fetch(`${API_BASE_URL}/api/auth/s/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(signUpData),
      });

      await handleApiError(response);

      const data = await response.json();

      console.log(data);

      const loginRes = await signIn(signUpData.email, signUpData.password);
      console.log(loginRes);

      if (!loginRes.jwtToken) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("jwtToken", loginRes.jwtToken);

      const userData = await getCurrentUser(loginRes.jwtToken);
      console.log(userData);

      setUser(true);
      setUserProfile(userData);

      return userData;
    } catch (error) {
      setError(error.message || "Failed to sign up");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      localStorage.removeItem("jwtToken");
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      setError(error.message || "Failed to sign out");
      throw error;
    }
  };

  const sendEmailOTP = async (email) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
        }),
      });
      console.log("res : ", response);
      await handleApiError(response);
      console.log("response : ", response);
      const message = await response.text();
      return { success: true, message };
    } catch (error) {
      setError(error.message || "Failed to send Email OTP");
      throw error;
    }
  };
  const verifyOtp = async (identifier, otp) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier,
          otp: otp,
        }),
      });

      await handleApiError(response);

      const result = await response.json(); // Parse JSON
      console.log("Backend JSON response:", result); // ✅ This will show your { success, message, data }

      const isValid = result.success === true;

      return {
        success: isValid,
        message:
          result.message ||
          (isValid ? "OTP verified successfully" : "Invalid OTP"),
      };
    } catch (error) {
      setError(error.message || "Failed to verify OTP");
      throw error;
    }
  };

  // const verifyOtp = async (identifier, otp) => {
  //   try {
  //     setError(null);

  //     const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: {
  //         email: identifier,
  //         otp: otp,
  //       },
  //     });

  //     await handleApiError(response);
  //     const result = await response.text();

  //     // Check if verification was successful
  //     const isValid = result.success === "true";
  //     return {
  //       success: isValid,
  //       message: isValid ? "OTP verified successfully" : result,
  //     };
  //   } catch (error) {
  //     setError(error.message || "Failed to verify OTP");
  //     throw error;
  //   }
  // };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    sendEmailOTP,
    verifyOtp,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
