// components/AddNewCourt.jsx
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { Checkbox } from "components/ui/Checkbox";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { useOwner } from "context/OwnerContext";
import React, { useEffect, useState } from "react";

function AddNewCourt({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  isSubmitting = false,
  showFacilitySelect = true, 
}) {
  const sportTypes = [
    { value: "tennis", label: "Tennis" },
    { value: "basketball", label: "Basketball" },
    { value: "badminton", label: "Badminton" },
    { value: "squash", label: "Squash" },
    { value: "volleyball", label: "Volleyball" },
    { value: "football", label: "Football" },
    { value: "cricket", label: "Cricket" },
    { value: "other", label: "Other" },
  ];
  const { getOwnerFacilities } = useOwner();

  const [facilities, setFacilities] = useState([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);

  const handleInputChange = (field, value) => {
    if (onFormChange) {
      onFormChange(field, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  // Fetch facilities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
    }
  }, [isOpen]);

  const fetchFacilities = async () => {
    setIsLoadingFacilities(true);
    try {
      const response = await getOwnerFacilities();
      console.log("Facilities response:", response);

      const facilityOptions =
        response?.map((facility) => ({
          value: facility.id,
          label: facility.name,
        })) || [];

      setFacilities(facilityOptions);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setFacilities([]);
    } finally {
      setIsLoadingFacilities(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed mt-12 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border/50 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-2 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Add New Court
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              className="hover:bg-muted/50 rounded-lg"
            />
          </div>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Facility Selection - Only show if facilities are provided */}
          <div className="relative">
            <Select
              label="Select Facility *"
              options={facilities}
              value={formData.facilityId}
              onChange={(value) => handleInputChange("facilityId", value)}
              placeholder={
                isLoadingFacilities
                  ? "Loading facilities..."
                  : facilities.length === 0
                  ? "No facilities found"
                  : "Choose a facility"
              }
              required
              disabled={isLoadingFacilities}
            />
            {isLoadingFacilities && (
              <div className="absolute right-3 top-9 text-text-secondary">
                <Icon name="Loader" size={16} className="animate-spin" />
              </div>
            )}
            {facilities.length === 0 && !isLoadingFacilities && (
              <p className="text-xs text-warning mt-1">
                No facilities found. Please create a facility first.
              </p>
            )}
          </div>

          {/* Court Name */}
          <Input
            label="Court Name *"
            placeholder="e.g., Tennis Court A"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            className="transition-all focus:shadow-sm"
          />

          {/* Sport Type */}
          <Select
            label="Sport Type *"
            options={sportTypes}
            value={formData.sportType || ""}
            onChange={(value) => handleInputChange("sportType", value)}
            placeholder="Select sport type"
            required
          />

          {/* Price Per Hour */}
          <Input
            label="Price Per Hour ($) *"
            type="number"
            placeholder="e.g., 25.00"
            value={formData.pricePerHour || formData.hourlyRate || ""}
            onChange={(e) => {
              // Support both field names for compatibility
              handleInputChange("pricePerHour", e.target.value);
              handleInputChange("hourlyRate", e.target.value);
            }}
            min="0"
            step="0.01"
            required
            className="transition-all focus:shadow-sm"
          />

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Opening Time *
              </label>
              <input
                type="time"
                value={
                  formData.openingTime ||
                  formData.operatingHours?.start ||
                  "06:00"
                }
                onChange={(e) => {
                  handleInputChange("openingTime", e.target.value);
                  // Also update operatingHours for compatibility
                  if (formData.operatingHours) {
                    handleInputChange("operatingHours", {
                      ...formData.operatingHours,
                      start: e.target.value,
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Closing Time *
              </label>
              <input
                type="time"
                value={
                  formData.closingTime ||
                  formData.operatingHours?.end ||
                  "22:00"
                }
                onChange={(e) => {
                  handleInputChange("closingTime", e.target.value);
                  // Also update operatingHours for compatibility
                  if (formData.operatingHours) {
                    handleInputChange("operatingHours", {
                      ...formData.operatingHours,
                      end: e.target.value,
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-muted/20 to-transparent p-1 rounded-lg">
            <Checkbox
              label="Active"
              description="Court is available for bookings"
              checked={formData.active}
              onChange={(e) => handleInputChange("active", e.target.checked)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.name ||
                (!showFacilitySelect || formData.facilityId) === false ||
                !formData.sportType ||
                !(formData.pricePerHour || formData.hourlyRate) ||
                isLoadingFacilities
              }
              loading={isSubmitting}
              iconName="Plus"
              className="bg-primary hover:bg-primary/90"
            >
              Add Court
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewCourt;
