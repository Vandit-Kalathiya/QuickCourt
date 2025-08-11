// components/CreateFacilityForm.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateFacilityForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    coordinates: {
      lat: '',
      lng: ''
    },
    sports: [],
    amenities: [],
    photos: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const availableAmenities = [
    'Parking', 'Changing Rooms', 'Showers', 'Equipment Rental',
    'Cafeteria', 'First Aid', 'Air Conditioning', 'WiFi', 
    'Lockers', 'Lighting', 'Sound System', 'Seating Area'
  ];

  const availableSports = [
    'FOOTBALL', 'BASKETBALL', 'TENNIS', 'BADMINTON',
    'VOLLEYBALL', 'CRICKET', 'SWIMMING'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCoordinateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));
  };

  const handleSportsToggle = (sport) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Enhanced photo upload handler with file validation
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    // Process valid files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: event.target.result, // For preview
          name: file.name,
          file: file, // Store the actual file for upload
          size: file.size,
          type: file.type
        };
        
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = '';
  };

  const handlePhotoRemove = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Facility name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.sports.length === 0) {
      newErrors.sports = 'Please select at least one sport';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updated handleSubmit with multipart form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for multipart request
      const multipartFormData = new FormData();
      
      // Add text fields
      multipartFormData.append('name', formData.name);
      multipartFormData.append('description', formData.description);
      multipartFormData.append('address', formData.address);
      multipartFormData.append('phone', formData.phone);
      multipartFormData.append('email', formData.email);
      
      // Add coordinates if provided
      if (formData.coordinates.lat) {
        multipartFormData.append('lat', formData.coordinates.lat);
      }
      if (formData.coordinates.lng) {
        multipartFormData.append('lng', formData.coordinates.lng);
      }
      
      // Add sports array
      formData.sports.forEach(sport => {
        multipartFormData.append('sports', sport);
      });
      
      // Add amenities array
      formData.amenities.forEach(amenity => {
        multipartFormData.append('amenities', amenity);
      });
      
      // Add photo files
      formData.photos.forEach(photo => {
        if (photo.file) {
          multipartFormData.append('photos', photo.file);
        }
      });

      console.log(formData)

      // Submit the multipart form data
      const response = await fetch('http://localhost:7000/owner/facilities', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
        body: multipartFormData
      });

      if (response.ok) {
        const result = await response.json();
        navigate("/facility-court-management");
        toast.success('Facility created successfully!');
        // onSubmit(result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create facility');
      }
    } catch (error) {
      console.error('Error creating facility:', error);
      alert('Failed to create facility. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      'FOOTBALL': 'Circle',
      'BASKETBALL': 'Circle',
      'TENNIS': 'Circle',
      'BADMINTON': 'Zap',
      'VOLLEYBALL': 'Circle',
      'CRICKET': 'Target',
      'SWIMMING': 'Waves'
    };
    return sportIcons[sport] || 'Circle';
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Facility</h1>
              <p className="text-text-secondary mt-1">
                Set up your sports facility with all the necessary details
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onCancel} 
              iconName="X"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Facility Name *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter facility name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.description ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Describe your facility, amenities, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.address ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="contact@facility.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Sports Selection */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Available Sports *</h2>
            <p className="text-text-secondary text-sm mb-4">
              Select the sports available at your facility
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableSports.map((sport) => (
                <label
                  key={sport}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    formData.sports.includes(sport)
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-border/80'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      size={16} 
                      className={`${
                        formData.sports.includes(sport) ? 'text-primary' : 'text-text-secondary'
                      }`}
                    />
                    <span className={`text-sm font-medium ${
                      formData.sports.includes(sport) ? 'text-primary' : 'text-foreground'
                    }`}>
                      {sport.charAt(0) + sport.slice(1).toLowerCase()}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            
            {errors.sports && <p className="text-red-500 text-sm mt-3">{errors.sports}</p>}
            
            {formData.sports.length > 0 && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Selected Sports ({formData.sports.length}): {formData.sports.map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Location Coordinates (Optional)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="40.7589"
                  value={formData.coordinates.lat}
                  onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="-73.9851"
                  value={formData.coordinates.lng}
                  onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <p className="text-text-secondary text-sm mt-2">
              You can get coordinates from Google Maps by right-clicking on your location
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Available Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-background transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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

          {/* Photos Section */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Facility Photos</h2>
            <p className="text-text-secondary text-sm mb-4">
              Upload high-quality images of your facility (Max: 10MB per image)
            </p>
            
            <div className="mb-6">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-background/50 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Icon name="Upload" size={24} className="text-text-secondary mb-2" />
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-text-secondary">PNG, JPG, GIF up to 10MB each</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isSubmitting}
                />
              </label>
            </div>

            {formData.photos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground">
                    Uploaded Photos ({formData.photos.length})
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Total size: {formatFileSize(formData.photos.reduce((acc, photo) => acc + photo.size, 0))}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border border-border">
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {!isSubmitting && (
                        <button
                          type="button"
                          onClick={() => handlePhotoRemove(photo.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      )}
                      
                      {/* Photo info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs truncate font-medium">{photo.name}</p>
                        <p className="text-xs text-gray-300">{formatFileSize(photo.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              iconName={isSubmitting ? "Loader" : "Check"}
            >
              {isSubmitting ? 'Creating Facility...' : 'Create Facility'}
            </Button>
          </div>
          
          {/* Progress indicator */}
          {isSubmitting && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Loader" size={16} className="text-primary animate-spin" />
                <span className="text-sm text-primary font-medium">
                  Creating your facility...
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateFacilityForm;
