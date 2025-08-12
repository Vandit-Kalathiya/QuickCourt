// components/CreateFacilityForm.jsx
import toast from "react-hot-toast";
import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import LocationSelector from "./LocationSelector";

const CreateFacilityForm = ({
  isOpen,
  setShowCreateForm,
  onCancel,
  apiEndpoint = "http://localhost:7000/owner/facilities",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    ownerEmail: "", // Added ownerEmail field
    ownerPhone: "", // Added phone number field
    sports: [],
    amenities: [],
    active: true,
    latitude: null,
    longitude: null,
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this handler function
  const handleLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));

    // Clear location error if it exists
    if (errors.location) {
      setErrors((prev) => ({
        ...prev,
        location: "",
      }));
    }
  };

  const availableAmenities = [
    "Parking",
    "Changing Rooms",
    "Showers",
    "Equipment Rental",
    "Cafeteria",
    "First Aid",
    "Air Conditioning",
    "WiFi",
    "Lockers",
    "Lighting",
    "Sound System",
    "Seating Area",
  ];

  const availableSports = [
    "FOOTBALL",
    "BASKETBALL",
    "TENNIS",
    "BADMINTON",
    "VOLLEYBALL",
    "CRICKET",
    "SWIMMING",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSportsToggle = (sport) => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Please select a valid image file (JPG, PNG, GIF)",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          photo: "Image size must be less than 10MB",
        }));
        return;
      }

      setSelectedPhoto(file);

      if (errors.photo) {
        setErrors((prev) => ({
          ...prev,
          photo: "",
        }));
      }
    }
  };

  const handlePhotoRemove = () => {
    setSelectedPhoto(null);
  };

  // ownerEmail validation function
  const validateownerEmail = (ownerEmail) => {
    const ownerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return ownerEmailRegex.test(ownerEmail);
  };

  // Phone number validation function
  const validateownerPhone = (phone) => {
    // Allow various phone number formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Facility name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // ownerEmail validation
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = "ownerEmail is required";
    } else if (!validateownerEmail(formData.ownerEmail)) {
      newErrors.ownerEmail = "Please enter a valid ownerEmail address";
    }

    // Phone number validation
    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = "Phone number is required";
    } else if (!validateownerPhone(formData.ownerPhone)) {
      newErrors.ownerPhone = "Please enter a valid phone number";
    }

    if (formData.sports.length === 0) {
      newErrors.sports = "Please select at least one sport";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Please select a location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear all form fields
  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      ownerEmail: "", // Clear ownerEmail
      ownerPhone: "", // Clear phone number
      sports: [],
      amenities: [],
      active: true,
      latitude: null,
      longitude: null,
    });
    setSelectedPhoto(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("ownerEmail", formData.ownerEmail); // Add ownerEmail to form data
      formDataToSend.append("ownerPhone", formData.ownerPhone); // Add phone number to form data
      formDataToSend.append("active", formData.active);
      formDataToSend.append("latitude", formData.latitude.toString());
      formDataToSend.append("longitude", formData.longitude.toString());

      formData.sports.forEach((sport) => {
        formDataToSend.append("sports", sport);
      });

      formData.amenities.forEach((amenity) => {
        formDataToSend.append("amenities", amenity);
      });

      if (selectedPhoto) {
        formDataToSend.append("photo", selectedPhoto);
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Facility created:", result);

      toast.success("Facility created successfully");
      setShowCreateForm(false);
      // Clear form and close modal
      clearForm();
    } catch (error) {
      console.error("Error creating facility:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to create facility. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    onCancel();
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      FOOTBALL: "Circle",
      BASKETBALL: "Circle",
      TENNIS: "Circle",
      BADMINTON: "Zap",
      VOLLEYBALL: "Circle",
      CRICKET: "Target",
      SWIMMING: "Waves",
    };
    return sportIcons[sport] || "Circle";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed mt-[4.5rem] inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border/50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Building" size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Create New Facility
                </h1>
                <p className="text-text-secondary text-sm">
                  Set up your sports facility with all the necessary details
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="hover:bg-muted/50 rounded-lg"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Global Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Icon
                    name="AlertCircle"
                    size={20}
                    className="text-red-500 mr-2"
                  />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-muted/20 rounded-lg border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Info" size={18} className="mr-2 text-primary" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facility Name - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.name ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter facility name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* ownerEmail */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="ownerEmail"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.ownerEmail ? "border-red-500" : "border-border"
                      }`}
                      placeholder="Enter ownerEmail address"
                      value={formData.ownerEmail}
                      onChange={(e) =>
                        handleInputChange("ownerEmail", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                    <Icon
                      name="Mail"
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    />
                  </div>
                  {errors.ownerEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerEmail}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.ownerPhone ? "border-red-500" : "border-border"
                      }`}
                      placeholder="Enter phone number"
                      value={formData.ownerPhone}
                      onChange={(e) =>
                        handleInputChange("ownerPhone", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                    <Icon
                      name="Phone"
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    />
                  </div>
                  {errors.ownerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerPhone}
                    </p>
                  )}
                </div>

                {/* Description - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                      errors.description ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Describe your facility, amenities, and what makes it special..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        errors.address ? "border-red-500" : "border-border"
                      }`}
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                    <Icon
                      name="MapPin"
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className="bg-muted/20 rounded-lg border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="MapPin" size={18} className="mr-2 text-primary" />
                Location *
              </h2>

              <LocationSelector
                onLocationChange={handleLocationChange}
                initialLocation={
                  formData.latitude && formData.longitude
                    ? [formData.latitude, formData.longitude]
                    : null
                }
              />

              {errors.location && (
                <p className="text-red-500 text-sm mt-2">{errors.location}</p>
              )}
            </div>

            {/* Sports Selection */}
            <div className="bg-muted/20 rounded-lg border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Activity" size={18} className="mr-2 text-primary" />
                Available Sports *
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSports.map((sport) => (
                  <label
                    key={sport}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      formData.sports.includes(sport)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-border/80"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      checked={formData.sports.includes(sport)}
                      onChange={() => handleSportsToggle(sport)}
                      disabled={isSubmitting}
                    />
                    <div className="flex items-center space-x-2">
                      <Icon
                        name={getSportIcon(sport)}
                        size={14}
                        className={`${
                          formData.sports.includes(sport)
                            ? "text-primary"
                            : "text-text-secondary"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          formData.sports.includes(sport)
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {sport.charAt(0) + sport.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {errors.sports && (
                <p className="text-red-500 text-sm mt-3">{errors.sports}</p>
              )}

              {formData.sports.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    Selected Sports ({formData.sports.length}):{" "}
                    {formData.sports
                      .map((s) => s.charAt(0) + s.slice(1).toLowerCase())
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-muted/20 rounded-lg border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Star" size={18} className="mr-2 text-primary" />
                Available Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center space-x-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-background transition-colors ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-muted/20 rounded-lg border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Camera" size={18} className="mr-2 text-primary" />
                Facility Photo
              </h2>

              {!selectedPhoto ? (
                <div className="mb-4">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-background/50 transition-colors ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-2 pb-3">
                      <Icon
                        name="Upload"
                        size={20}
                        className="text-text-secondary mb-1"
                      />
                      <p className="text-sm text-text-secondary">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-text-secondary">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(selectedPhoto)}
                      alt="Selected facility photo"
                      className="w-32 h-24 object-cover rounded-lg border border-border"
                    />
                    {!isSubmitting && (
                      <button
                        type="button"
                        onClick={handlePhotoRemove}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Icon name="X" size={10} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-2">
                    {selectedPhoto.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Size: {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="bg-muted/20 rounded-lg border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="Settings" size={18} className="mr-2 text-primary" />
                Status
              </h2>

              <label
                className={`flex items-center space-x-3 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={formData.active}
                  onChange={(e) =>
                    handleInputChange("active", e.target.checked)
                  }
                  disabled={isSubmitting}
                />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Active Facility
                  </span>
                  <p className="text-xs text-text-secondary">
                    Active facilities are visible to users and available for
                    booking
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                iconName={isSubmitting ? "Loader" : "Check"}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Creating..." : "Create Facility"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFacilityForm;
