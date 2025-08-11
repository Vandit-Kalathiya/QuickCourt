
// components/CreateFacilityForm.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateFacilityForm = ({ onSubmit, onCancel, apiEndpoint = 'http://localhost:7000/owner/facilities' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    sports: [],
    amenities: [],
    active: true // Added to match backend
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null); // Single photo to match backend MultipartFile
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableAmenities = [
    'Parking',
    'Changing Rooms',
    'Showers',
    'Equipment Rental',
    'Cafeteria',
    'First Aid',
    'Air Conditioning',
    'WiFi',
    'Lockers',
    'Lighting',
    'Sound System',
    'Seating Area'
  ];

  const availableSports = [
    'FOOTBALL',
    'BASKETBALL', 
    'TENNIS',
    'BADMINTON',
    'VOLLEYBALL',
    'CRICKET',
    'SWIMMING'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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

  // Updated photo upload to handle single file (MultipartFile)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]; // Only take the first file
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select a valid image file (JPG, PNG, GIF)'
        }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image size must be less than 10MB'
        }));
        return;
      }
      
      setSelectedPhoto(file);
      
      // Clear photo error if exists
      if (errors.photo) {
        setErrors(prev => ({
          ...prev,
          photo: ''
        }));
      }
    }
  };

  const handlePhotoRemove = () => {
    setSelectedPhoto(null);
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

    if (formData.sports.length === 0) {
      newErrors.sports = 'Please select at least one sport';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updated submit function to work with backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData to handle multipart/form-data
      const formDataToSend = new FormData();
      
      // Append form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('active', formData.active);
      
      // Append sports as individual entries (Spring Boot can handle List<String> this way)
      formData.sports.forEach(sport => {
        formDataToSend.append('sports', sport);
      });
      
      // Append amenities as individual entries
      formData.amenities.forEach(amenity => {
        formDataToSend.append('amenities', amenity);
      });
      
      // Append photo if selected
      if (selectedPhoto) {
        formDataToSend.append('photo', selectedPhoto);
      }

      // Make API call
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formDataToSend,
        headers: {
       'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`,  // <-- add this
    // Do NOT set Content-Type if sending FormData, browser sets it automatically
  },
        // Don't set Content-Type header - let browser set it for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Call parent component's onSubmit with the response
      onSubmit(result);
      
    } catch (error) {
      console.error('Error creating facility:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to create facility. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get sport icon
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
            <Button variant="outline" onClick={onCancel} iconName="X">
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Global Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={20} className="text-red-500 mr-2" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

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
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    checked={formData.sports.includes(sport)}
                    onChange={() => handleSportsToggle(sport)}
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

          {/* Amenities */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Available Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-background transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span className="text-sm text-foreground">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Single Photo Upload */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Facility Photo</h2>
            
            {!selectedPhoto ? (
              <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-background/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="Upload" size={24} className="text-text-secondary mb-2" />
                    <p className="text-sm text-text-secondary">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-text-secondary">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="mb-6">
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(selectedPhoto)}
                    alt="Selected facility photo"
                    className="w-48 h-32 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={handlePhotoRemove}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
                <p className="text-sm text-text-secondary mt-2">{selectedPhoto.name}</p>
                <p className="text-xs text-text-secondary">
                  Size: {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
            
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          </div>

          {/* Active Status */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Status</h2>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
              />
              <div>
                <span className="text-sm font-medium text-foreground">Active Facility</span>
                <p className="text-xs text-text-secondary">
                  Active facilities are visible to users and available for booking
                </p>
              </div>
            </label>
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
              {isSubmitting ? 'Creating...' : 'Create Facility'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFacilityForm;

// // components/CreateFacilityForm.jsx
// import React, { useState } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';

// const CreateFacilityForm = ({ onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     address: '',
//     phone: '',
//     email: '',
//     coordinates: {
//       lat: '',
//       lng: ''
//     },
//     sports: [], // Added sports array
//     amenities: [],
//     photos: []
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const availableAmenities = [
//     'Parking',
//     'Changing Rooms',
//     'Showers',
//     'Equipment Rental',
//     'Cafeteria',
//     'First Aid',
//     'Air Conditioning',
//     'WiFi',
//     'Lockers',
//     'Lighting',
//     'Sound System',
//     'Seating Area'
//   ];

//   // Added available sports
//   const availableSports = [
//     'FOOTBALL',
//     'BASKETBALL', 
//     'TENNIS',
//     'BADMINTON',
//     'VOLLEYBALL',
//     'CRICKET',
//     'SWIMMING'
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const handleCoordinateChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       coordinates: {
//         ...prev.coordinates,
//         [field]: value
//       }
//     }));
//   };

//   // Added sports toggle handler
//   const handleSportsToggle = (sport) => {
//     setFormData(prev => ({
//       ...prev,
//       sports: prev.sports.includes(sport)
//         ? prev.sports.filter(s => s !== sport)
//         : [...prev.sports, sport]
//     }));
//   };

//   const handleAmenityToggle = (amenity) => {
//     setFormData(prev => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity]
//     }));
//   };

//   const handlePhotoUpload = (e) => {
//     const files = Array.from(e.target.files);
    
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const newPhoto = {
//           id: Date.now() + Math.random(),
//           url: event.target.result,
//           name: file.name,
//           file: file
//         };
        
//         setFormData(prev => ({
//           ...prev,
//           photos: [...prev.photos, newPhoto]
//         }));
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handlePhotoRemove = (photoId) => {
//     setFormData(prev => ({
//       ...prev,
//       photos: prev.photos.filter(photo => photo.id !== photoId)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Facility name is required';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'Description is required';
//     }

//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Added sports validation
//     if (formData.sports.length === 0) {
//       newErrors.sports = 'Please select at least one sport';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       onSubmit(formData);
//     } catch (error) {
//       console.error('Error creating facility:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Helper function to get sport icon
//   const getSportIcon = (sport) => {
//     const sportIcons = {
//       'FOOTBALL': 'Circle',
//       'BASKETBALL': 'Circle',
//       'TENNIS': 'Circle',
//       'BADMINTON': 'Zap',
//       'VOLLEYBALL': 'Circle',
//       'CRICKET': 'Target',
//       'SWIMMING': 'Waves'
//     };
//     return sportIcons[sport] || 'Circle';
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-card border-b border-border">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">Create New Facility</h1>
//               <p className="text-text-secondary mt-1">
//                 Set up your sports facility with all the necessary details
//               </p>
//             </div>
//             <Button variant="outline" onClick={onCancel} iconName="X">
//               Cancel
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="bg-card rounded-lg border border-border p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Facility Name *
//                 </label>
//                 <input
//                   type="text"
//                   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
//                     errors.name ? 'border-red-500' : 'border-border'
//                   }`}
//                   placeholder="Enter facility name"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                 />
//                 {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   rows={4}
//                   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
//                     errors.description ? 'border-red-500' : 'border-border'
//                   }`}
//                   placeholder="Describe your facility, amenities, and what makes it special..."
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                 />
//                 {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Address *
//                 </label>
//                 <input
//                   type="text"
//                   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
//                     errors.address ? 'border-red-500' : 'border-border'
//                   }`}
//                   placeholder="Enter complete address"
//                   value={formData.address}
//                   onChange={(e) => handleInputChange('address', e.target.value)}
//                 />
//                 {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
//                     errors.phone ? 'border-red-500' : 'border-border'
//                   }`}
//                   placeholder="+1 (555) 123-4567"
//                   value={formData.phone}
//                   onChange={(e) => handleInputChange('phone', e.target.value)}
//                 />
//                 {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   type="email"
//                   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
//                     errors.email ? 'border-red-500' : 'border-border'
//                   }`}
//                   placeholder="contact@facility.com"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                 />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//               </div>
//             </div>
//           </div>

//           {/* Sports Selection - NEW SECTION */}
//           <div className="bg-card rounded-lg border border-border p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-6">Available Sports *</h2>
//             <p className="text-text-secondary text-sm mb-4">
//               Select the sports available at your facility
//             </p>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {availableSports.map((sport) => (
//                 <label
//                   key={sport}
//                   className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
//                     formData.sports.includes(sport)
//                       ? 'border-primary bg-primary/5 shadow-sm'
//                       : 'border-border hover:border-border/80'
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
//                     checked={formData.sports.includes(sport)}
//                     onChange={() => handleSportsToggle(sport)}
//                   />
//                   <div className="flex items-center space-x-2">
//                     <Icon 
//                       name={getSportIcon(sport)} 
//                       size={16} 
//                       className={`${
//                         formData.sports.includes(sport) ? 'text-primary' : 'text-text-secondary'
//                       }`}
//                     />
//                     <span className={`text-sm font-medium ${
//                       formData.sports.includes(sport) ? 'text-primary' : 'text-foreground'
//                     }`}>
//                       {sport.charAt(0) + sport.slice(1).toLowerCase()}
//                     </span>
//                   </div>
//                 </label>
//               ))}
//             </div>
            
//             {errors.sports && <p className="text-red-500 text-sm mt-3">{errors.sports}</p>}
            
//             {formData.sports.length > 0 && (
//               <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
//                 <p className="text-sm text-primary font-medium">
//                   Selected Sports ({formData.sports.length}): {formData.sports.map(s => s.charAt(0) + s.slice(1).toLowerCase()).join(', ')}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Location */}
//           <div className="bg-card rounded-lg border border-border p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-6">
//               Location Coordinates (Optional)
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Latitude
//                 </label>
//                 <input
//                   type="number"
//                   step="any"
//                   className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="40.7589"
//                   value={formData.coordinates.lat}
//                   onChange={(e) => handleCoordinateChange('lat', e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Longitude
//                 </label>
//                 <input
//                   type="number"
//                   step="any"
//                   className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                   placeholder="-73.9851"
//                   value={formData.coordinates.lng}
//                   onChange={(e) => handleCoordinateChange('lng', e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <p className="text-text-secondary text-sm mt-2">
//               You can get coordinates from Google Maps by right-clicking on your location
//             </p>
//           </div>

//           {/* Amenities */}
//           <div className="bg-card rounded-lg border border-border p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-6">Available Amenities</h2>
            
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {availableAmenities.map((amenity) => (
//                 <label
//                   key={amenity}
//                   className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-background transition-colors"
//                 >
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
//                     checked={formData.amenities.includes(amenity)}
//                     onChange={() => handleAmenityToggle(amenity)}
//                   />
//                   <span className="text-sm text-foreground">{amenity}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Photos */}
//           <div className="bg-card rounded-lg border border-border p-6">
//             <h2 className="text-lg font-semibold text-foreground mb-6">Facility Photos</h2>
            
//             <div className="mb-6">
//               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-background/50 transition-colors">
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <Icon name="Upload" size={24} className="text-text-secondary mb-2" />
//                   <p className="text-sm text-text-secondary">
//                     <span className="font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-text-secondary">PNG, JPG, GIF up to 10MB</p>
//                 </div>
//                 <input
//                   type="file"
//                   className="hidden"
//                   multiple
//                   accept="image/*"
//                   onChange={handlePhotoUpload}
//                 />
//               </label>
//             </div>

//             {formData.photos.length > 0 && (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {formData.photos.map((photo) => (
//                   <div key={photo.id} className="relative group">
//                     <img
//                       src={photo.url}
//                       alt={photo.name}
//                       className="w-full h-24 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => handlePhotoRemove(photo.id)}
//                       className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Icon name="X" size={12} />
//                     </button>
//                     <p className="text-xs text-text-secondary mt-1 truncate">{photo.name}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex items-center justify-end space-x-4 pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               iconName={isSubmitting ? "Loader" : "Check"}
//             >
//               {isSubmitting ? 'Creating...' : 'Create Facility'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateFacilityForm;
