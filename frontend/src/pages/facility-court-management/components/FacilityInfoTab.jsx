import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import { useAuth } from "context/AuthContext";

const FacilityInfoTab = ({ facility, onUpdate }) => {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: facility?.name || "",
    description: facility?.description || "",
    address: facility?.address || "",
    phone: facility?.phone || "",
    email: facility?.email || userProfile?.email || "",
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
    { name: "Parking", icon: "Car" },
    { name: "Changing Rooms", icon: "Users" },
    { name: "Showers", icon: "Droplets" },
    { name: "Equipment Rental", icon: "Package" },
    { name: "Cafeteria", icon: "Coffee" },
    { name: "First Aid", icon: "Heart" },
    { name: "Air Conditioning", icon: "Wind" },
    { name: "WiFi", icon: "Wifi" },
    { name: "Lockers", icon: "Lock" },
    { name: "Lighting", icon: "Lightbulb" },
    { name: "Sound System", icon: "Volume2" },
    { name: "Seating Area", icon: "Armchair" },
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
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
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
      file: file,
    }));
    setPhotos((prev) => [...(prev || []), ...newPhotos]);

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

  if (!facility) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary text-lg">Loading facility information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-slide-in">
          <Icon name="CheckCircle" size={20} />
          <span className="font-medium">Facility information updated successfully!</span>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon name="Building" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Facility Information
                </h1>
                <p className="text-text-secondary text-lg">
                  Manage your venue details and showcase your facility
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20">
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-sm font-medium text-success">
                  {facility?.name ? "Active" : "Incomplete"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="MapPin" size={14} />
                <span className="text-sm">{facility?.address || "No address"}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Calendar" size={14} />
                <span className="text-sm">Last updated: Today</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="hover:bg-error/10 hover:text-error hover:border-error/30 transition-all duration-200"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  iconName="Save" 
                  iconPosition="left"
                  className="bg-success hover:bg-success/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left"
                className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Edit Information
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Basic Information */}
        <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Basic Details</h3>
          </div>
          
          <div className="space-y-6">
            <Input
              label="Facility Name"
              type="text"
              value={formData?.name || ""}
              onChange={(e) => handleInputChange("name", e?.target?.value)}
              disabled={!isEditing}
              required
              placeholder="Enter facility name"
              className="transition-all duration-200 focus:shadow-md"
            />

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Description
              </label>
              <textarea
                value={formData?.description || ""}
                onChange={(e) => handleInputChange("description", e?.target?.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:bg-muted disabled:text-text-secondary resize-none hover:border-primary/30"
                placeholder="Describe your facility, its features, and what makes it special..."
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
              className="transition-all duration-200 focus:shadow-md"
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
                className="transition-all duration-200 focus:shadow-md"
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
                className="transition-all duration-200 focus:shadow-md"
              />
            </div>

            {/* Enhanced Owner Info */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Facility Owner
                  </p>
                  <p className="text-sm text-emerald-600">
                    {userProfile?.name || "Unknown"}
                    {userProfile?.email && (
                      <span className="ml-2">({userProfile.email})</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Location & Map */}
        <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Icon name="MapPin" size={20} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Location</h3>
          </div>
          
          <div className="space-y-6">
            {facility?.latitude && facility?.longitude ? (
              <div className="h-56 bg-muted rounded-2xl overflow-hidden border-2 border-border shadow-inner">
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
              <div className="h-56 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MapPin" size={32} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Location not set
                  </p>
                  <p className="text-xs text-gray-400">
                    Add coordinates to show map
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
                className="bg-gray-50"
              />
              <Input
                label="Longitude"
                type="number"
                value={facility?.longitude || ""}
                disabled
                step="any"
                placeholder="0.0000"
                className="bg-gray-50"
              />
            </div>

            {isEditing && (
              <Button
                variant="outline"
                iconName="MapPin"
                iconPosition="left"
                fullWidth
                className="border-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              >
                Update Location
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Amenities */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Icon name="Star" size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Amenities</h3>
            <p className="text-text-secondary text-sm">
              {formData?.amenities?.length || 0} of {availableAmenities.length} selected
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availableAmenities?.map((amenity) => (
            <div
              key={amenity.name}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                (formData?.amenities || []).includes(amenity.name)
                  ? "bg-primary/5 border-primary/30 shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              } ${isEditing ? "cursor-pointer hover:scale-105" : ""}`}
              onClick={() => isEditing && handleAmenityChange(amenity.name, !(formData?.amenities || []).includes(amenity.name))}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  (formData?.amenities || []).includes(amenity.name)
                    ? "bg-primary/10"
                    : "bg-gray-200"
                }`}>
                  <Icon 
                    name={amenity.icon} 
                    size={16} 
                    className={(formData?.amenities || []).includes(amenity.name) ? "text-primary" : "text-gray-500"} 
                  />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    (formData?.amenities || []).includes(amenity.name) ? "text-primary" : "text-gray-700"
                  }`}>
                    {amenity.name}
                  </p>
                  {isEditing && (
                    <input
                      type="checkbox"
                      checked={(formData?.amenities || []).includes(amenity.name)}
                      onChange={(e) => handleAmenityChange(amenity.name, e?.target?.checked)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Photo Gallery */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Icon name="Camera" size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Photo Gallery</h3>
              <p className="text-text-secondary text-sm">
                {(photos || []).length} photos uploaded
              </p>
            </div>
          </div>
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
                className="border-2 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200"
              >
                Add Photos
              </Button>
            </div>
          )}
        </div>

        {(photos || []).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {(photos || []).map((photo, index) => (
              <div
                key={photo?.id}
                className="relative group aspect-square bg-muted rounded-2xl overflow-hidden cursor-move shadow-sm hover:shadow-lg transition-all duration-200 border-2 border-border"
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Image
                  src={"http://localhost:7000" + photo}
                  alt={`Facility photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handlePhotoDelete(photo?.id)}
                      className="bg-error hover:bg-error/90 text-white rounded-full shadow-lg"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {index + 1}
                </div>
              </div>
            ))}

            {isEditing && (
              <div
                className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                    <Icon name="Plus" size={24} className="text-gray-400 group-hover:text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-primary">Add Photo</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center bg-gray-50/50">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Image" size={40} className="text-gray-400" />
            </div>
            <h4 className="font-bold text-foreground mb-3 text-lg">
              No photos yet
            </h4>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Showcase your facility with high-quality photos. Great images help attract more customers and bookings.
            </p>
            {isEditing && (
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => document.getElementById("photo-upload")?.click()}
                className="border-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
              >
                Add First Photo
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FacilityInfoTab;
