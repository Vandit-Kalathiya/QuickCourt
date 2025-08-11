import { useAuth } from "context/AuthContext";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const {
    signIn,
    signUp,
    sendEmailOTP,
    verifyOtp,
    loading: authLoading,
    error: authError,
  } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState(["", "", "", ""]);
  const [formData, setFormData] = useState({
    userType: "user",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const navigate = useNavigate();

  // Display auth errors using toast
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Email verification check for signup
    if (!isLogin && !isEmailVerified) {
      newErrors.email = "Please verify your email first";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Signup specific validations
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Reset email verification if email changes
    if (name === "email") {
      setIsEmailVerified(false);
      setIsEmailOtpSent(false);
      setEmailOtp(["", "", "", ""]);
    }
  };

  // Handle email verification request
  const handleEmailVerifyRequest = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    setIsEmailLoading(true);
    try {
      // Call your email verification API here

      const response = await sendEmailOTP(formData.email);
      if (!response.success) {
        throw new Error("Failed to send OTP");
      }
      setIsEmailOtpSent(true);
      toast.success(`OTP sent to ${formData.email}`);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Handle email OTP input
  const handleEmailOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...emailOtp];
      newOtp[index] = value;
      setEmailOtp(newOtp);

      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`email-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle email OTP verification
  const handleEmailOtpVerification = async () => {
    const otpValue = emailOtp.join("");
    if (otpValue.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsEmailLoading(true);
    try {
      // Call your email OTP verification API here
      //   const response = await fetch(
      //     `${
      //       import.meta.env.REACT_APP_API_URL || "http://localhost:7000"
      //     }/api/auth/verify-email-otp`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         email: formData.email,
      //         otp: otpValue,
      //       }),
      //     }
      //   );

      const response = await verifyOtp(formData.email, otpValue);

      if (!response.success) {
        throw new Error("Invalid OTP");
      }

      setIsEmailVerified(true);
      setIsEmailOtpSent(false);
      setEmailOtp(["", "", "", ""]);
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Handle OTP input (for final signup)
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        // Login using AuthContext
        console.log(formData);
        const loginRes = await signIn(formData.email, formData.password);
        console.log("Login response:", loginRes);
        navigate("/dashboard");
        toast.success("Login successful!");
      } else {
        const signUpData = {
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          role: formData.userType, // Keep userType as is
          // Add any other fields your API expects
        };

        console.log(signUpData);

        // Signup using AuthContext
        await signUp(signUpData);
        toast.success("Signup successful!");
        // Handle successful signup (redirect, etc.)
      }
    } catch (error) {
      // Error is already handled in AuthContext and displayed via toast
      console.error("Authentication error:", error);
    }
  };

  // Handle final OTP verification (if still needed for your flow)
  const handleOtpVerification = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Call your final OTP verification API if needed
      // This might not be necessary if your signup flow is complete after signUp()

      setShowOtpModal(false);
      toast.success("Account verification complete!");
      setIsLogin(true);
      resetForm();
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      userType: "user",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setOtp(["", "", "", ""]);
    setEmailOtp(["", "", "", ""]);
    setErrors({});
    setIsEmailVerified(false);
    setIsEmailOtpSent(false);
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Determine if we should show loading state
  const isFormLoading = authLoading || isLoading;

  return (
    <div className="h-screen flex font-sans overflow-hidden">
      <div className="flex w-full mx-auto bg-white rounded-2xl overflow-hidden">
        {/* Left side - Image section */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
            }}
          ></div>
          <div className="relative z-10 bg-gray-600/80 backdrop-blur-sm p-8 rounded-xl text-center text-white max-w-sm">
            <h2 className="text-3xl font-bold mb-3">Welcome to SportHub</h2>
            <p className="text-lg opacity-90">
              {isLogin
                ? "Sign in to continue your journey"
                : "Join our community today"}
            </p>
          </div>
        </div>

        {/* Right side - Form section */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-lg">
            {/* Form header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-600 text-base">
                {isLogin ? "Sign in to your account" : "Sign up to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 animate-fade-in">
              {/* User Type Selection - Only for Signup */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Sign up as
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all duration-300 text-center hover:scale-105 ${
                        formData.userType === "user"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "userType", value: "user" },
                        })
                      }
                    >
                      <div className="text-lg mb-1">🏃‍♂️</div>
                      <div className="font-medium text-sm">User</div>
                    </div>
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all duration-300 text-center hover:scale-105 ${
                        formData.userType === "owner"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "userType", value: "owner" },
                        })
                      }
                    >
                      <div className="text-lg mb-1">🏢</div>
                      <div className="font-medium text-sm">Facility Owner</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Name - Only for Signup */}
              {!isLogin && (
                <div className="space-y-1">
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email with Verify Button */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700"
                >
                  Email {!isLogin && <span className="text-red-500">*</span>}
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isEmailVerified}
                    className={`flex-1 px-3 py-2 text-sm border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : isEmailVerified
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 focus:border-blue-500"
                    } ${isEmailVerified ? "cursor-not-allowed" : ""}`}
                    placeholder="Enter your email"
                  />
                  {!isLogin && (
                    <button
                      type="button"
                      onClick={handleEmailVerifyRequest}
                      disabled={isEmailLoading || isEmailVerified}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                        isEmailVerified
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
                      } disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]`}
                    >
                      {isEmailLoading ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      ) : isEmailVerified ? (
                        "✓"
                      ) : (
                        "Verify"
                      )}
                    </button>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}

                {/* Email OTP Input - Show when OTP is sent */}
                {!isLogin && isEmailOtpSent && !isEmailVerified && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 mb-2">
                      Enter 4-digit code sent to your email:
                    </p>
                    <div className="flex gap-2 mb-2">
                      {emailOtp.map((digit, index) => (
                        <input
                          key={index}
                          id={`email-otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) =>
                            handleEmailOtpChange(index, e.target.value)
                          }
                          className="w-8 h-8 border-2 border-blue-200 rounded text-center text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={handleEmailOtpVerification}
                        disabled={isEmailLoading}
                        className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-all duration-300 disabled:opacity-70 flex items-center justify-center min-w-[50px]"
                      >
                        {isEmailLoading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleEmailVerifyRequest}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 text-sm border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password - Only for Signup */}
              {!isLogin && (
                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 text-sm border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isFormLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-h-[42px] text-sm mt-4"
              >
                {isFormLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  className="ml-1 text-blue-600 font-semibold hover:text-purple-600 transition-colors duration-200 underline text-sm"
                  onClick={toggleMode}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final OTP Modal for Signup Completion */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Complete Signup
              </h2>
              <p className="text-gray-600 text-sm">
                Enter the final verification code
              </p>
            </div>

            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 border-2 border-gray-200 rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              ))}
            </div>

            <div className="space-y-2">
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-h-[40px] text-sm"
                onClick={handleOtpVerification}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  "Complete Signup"
                )}
              </button>
              <button
                className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                onClick={() => toast.success("OTP resent!")}
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
