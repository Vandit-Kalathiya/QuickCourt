import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import { useAuth } from "context/AuthContext";

const FacilityInfoTab = ({ facility, onUpdate }) => {
  const { userProfile } = useAuth(); // Use userProfile instead of getCurrentUser
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: facility?.name || "",
    description: facility?.description || "",
    address: facility?.address || "",
    phone: facility?.phone || "",
    email: facility?.email || userProfile?.email || "", // Use facility email first, fallback to user email
    amenities: facility?.amenities || [],
  });
  const [photos, setPhotos] = useState(facility?.photos || []);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Update form data when facility or userProfile changes
  useEffect(() => {
    if (facility || userProfile) {
      setFormData({
        name: facility?.name || "",
        description: facility?.description || "",
        address: facility?.address || "",
        phone: facility?.phone || "",
        email: facility?.email || userProfile?.email || "",
        amenities: facility?.amenities || [],
      });
      setPhotos(facility?.photos || []);
    }
  }, [facility, userProfile]);

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmenityChange = (amenity, checked) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...(prev?.amenities || []), amenity]
        : (prev?.amenities || []).filter((a) => a !== amenity),
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original facility data
    setFormData({
      name: facility?.name || "",
      description: facility?.description || "",
      address: facility?.address || "",
      phone: facility?.phone || "",
      email: facility?.email || userProfile?.email || "",
      amenities: facility?.amenities || [],
    });
    setPhotos(facility?.photos || []);
    setIsEditing(false);
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event?.target?.files || []);
    const newPhotos = files?.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      name: file?.name,
      file: file, // Store the file for actual upload
    }));
    setPhotos((prev) => [...(prev || []), ...newPhotos]);

    // Clear the input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handlePhotoDelete = (photoId) => {
    setPhotos((prev) => (prev || []).filter((photo) => photo?.id !== photoId));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newPhotos = [...(photos || [])];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);

    setPhotos(newPhotos);
    setDraggedIndex(null);
  };

  // Show loading state if no facility data
  if (!facility) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading facility information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Facility Information
          </h2>
          <p className="text-text-secondary mt-1">
            Manage your venue details and settings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} iconName="Save" iconPosition="left">
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Information
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Basic Details
          </h3>
          <div className="space-y-4">
            <Input
              label="Facility Name"
              type="text"
              value={formData?.name || ""}
              onChange={(e) => handleInputChange("name", e?.target?.value)}
              disabled={!isEditing}
              required
              placeholder="Enter facility name"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData?.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e?.target?.value)
                }
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-text-secondary resize-none"
                placeholder="Describe your facility..."
              />
            </div>

            <Input
              label="Address"
              type="text"
              value={formData?.address || ""}
              onChange={(e) => handleInputChange("address", e?.target?.value)}
              disabled={!isEditing}
              required
              placeholder="Enter complete address"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone || ""}
                onChange={(e) => handleInputChange("phone", e?.target?.value)}
                disabled={!isEditing}
                required
                placeholder="+1 (555) 123-4567"
              />

              <Input
                label="Contact Email"
                type="email"
                value={formData?.email || ""}
                onChange={(e) => handleInputChange("email", e?.target?.value)}
                disabled={!isEditing}
                required
                placeholder="facility@example.com"
                helperText="This email will be used for booking notifications"
              />
            </div>

            {/* Display current user info */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Owner:</strong> {userProfile?.name || "Unknown"}
                {userProfile?.email && (
                  <span className="ml-2">({userProfile.email})</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Location
          </h3>
          <div className="space-y-4">
            {facility?.latitude && facility?.longitude ? (
              <div className="h-48 bg-muted rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title={facility?.name || "Facility Location"}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${facility.latitude},${facility.longitude}&z=15&output=embed`}
                  className="border-0"
                />
              </div>
            ) : (
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon
                    name="MapPin"
                    size={32}
                    className="text-text-secondary mx-auto mb-2"
                  />
                  <p className="text-sm text-text-secondary">
                    Location not set
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                value={facility?.latitude || ""}
                disabled
                step="any"
                placeholder="0.0000"
              />
              <Input
                label="Longitude"
                type="number"
                value={facility?.longitude || ""}
                disabled
                step="any"
                placeholder="0.0000"
              />
            </div>

            {isEditing && (
              <Button
                variant="outline"
                iconName="MapPin"
                iconPosition="left"
                fullWidth
              >
                Update Location
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableAmenities?.map((amenity) => (
            <Checkbox
              key={amenity}
              label={amenity}
              checked={(formData?.amenities || []).includes(amenity)}
              onChange={(e) => handleAmenityChange(amenity, e?.target?.checked)}
              disabled={!isEditing}
            />
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Photo Gallery
          </h3>
          {isEditing && (
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                Add Photos
              </Button>
            </div>
          )}
        </div>

        {(photos || []).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(photos || []).map((photo, index) => (
              <div
                key={photo?.id}
                className="relative group aspect-square bg-muted rounded-lg overflow-hidden cursor-move"
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Image
                  src={"http://localhost:7000" + photo}
                  alt={`Facility photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handlePhotoDelete(photo?.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}

            {isEditing && (
              <div
                className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <div className="text-center">
                  <Icon
                    name="Plus"
                    size={24}
                    className="text-text-secondary mx-auto mb-2"
                  />
                  <p className="text-sm text-text-secondary">Add Photo</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Icon
              name="Image"
              size={48}
              className="text-text-secondary mx-auto mb-4"
            />
            <h4 className="font-semibold text-foreground mb-2">
              No photos yet
            </h4>
            <p className="text-text-secondary mb-4">
              Add photos to showcase your facility to potential customers
            </p>
            {isEditing && (
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                Add First Photo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityInfoTab;
