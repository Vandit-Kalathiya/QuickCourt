import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FacilityInfoTab from './components/FacilityInfoTab';
import CourtManagementTab from './components/CourtManagementTab';
import AvailabilityTab from './components/AvailabilityTab';
import PricingTab from './components/PricingTab';

const FacilityCourtManagement = () => {
  const [activeTab, setActiveTab] = useState('facility');

  // Mock facility data
  const [facility] = useState({
    id: 1,
    name: "Elite Sports Complex",
    description: `Premier sports facility offering world-class courts and amenities for athletes of all levels.\n\nOur state-of-the-art complex features professional-grade surfaces, modern lighting systems, and comprehensive support facilities to ensure the best possible sporting experience.`,
    address: "123 Sports Avenue, Downtown District, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "info@elitesportscomplex.com",
    coordinates: {
      lat: 40.7589,
      lng: -73.9851
    },
    amenities: [
      'Parking', 'Changing Rooms', 'Showers', 'Equipment Rental',
      'Cafeteria', 'First Aid', 'Air Conditioning', 'WiFi', 'Lockers'
    ],
    photos: [
      { id: 1, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', name: 'Main Court' },
      { id: 2, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', name: 'Tennis Courts' },
      { id: 3, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', name: 'Basketball Court' },
      { id: 4, url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', name: 'Facilities' }
    ]
  });

  // Mock courts data
  const [courts, setCourts] = useState([
    {
      id: 1,
      name: "Tennis Court A",
      sportType: "tennis",
      hourlyRate: 45.00,
      operatingHours: { start: "06:00", end: "22:00" },
      status: "active",
      description: "Professional tennis court with synthetic grass surface"
    },
    {
      id: 2,
      name: "Basketball Court 1",
      sportType: "basketball",
      hourlyRate: 35.00,
      operatingHours: { start: "07:00", end: "23:00" },
      status: "active",
      description: "Indoor basketball court with wooden flooring"
    },
    {
      id: 3,
      name: "Badminton Court B",
      sportType: "badminton",
      hourlyRate: 25.00,
      operatingHours: { start: "06:00", end: "21:00" },
      status: "active",
      description: "Air-conditioned badminton court with professional lighting"
    },
    {
      id: 4,
      name: "Squash Court 1",
      sportType: "squash",
      hourlyRate: 30.00,
      operatingHours: { start: "08:00", end: "22:00" },
      status: "maintenance",
      description: "Glass-walled squash court with climate control"
    }
  ]);

  // Mock availability data
  const [availability, setAvailability] = useState({
    '1-2025-01-11-09:00': 'booked',
    '1-2025-01-11-10:00': 'booked',
    '1-2025-01-11-18:00': 'blocked',
    '1-2025-01-11-19:00': 'blocked',
    '2-2025-01-11-15:00': 'booked',
    '2-2025-01-11-16:00': 'booked',
    '3-2025-01-11-20:00': 'maintenance',
    '4-2025-01-11-14:00': 'maintenance',
    '4-2025-01-11-15:00': 'maintenance'
  });

  // Mock pricing rules
  const [pricingRules, setPricingRules] = useState([
    {
      id: 1,
      courtId: 1,
      name: "Evening Peak Hours",
      type: "peak_hours",
      conditions: {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        timeStart: "18:00",
        timeEnd: "22:00"
      },
      adjustment: { type: "percentage", value: 25 },
      active: true,
      createdAt: "2025-01-01T00:00:00Z"
    },
    {
      id: 2,
      courtId: 1,
      name: "Weekend Premium",
      type: "weekend",
      conditions: {
        days: ['saturday', 'sunday'],
        timeStart: "08:00",
        timeEnd: "20:00"
      },
      adjustment: { type: "percentage", value: 15 },
      active: true,
      createdAt: "2025-01-01T00:00:00Z"
    },
    {
      id: 3,
      courtId: 2,
      name: "Prime Time Basketball",
      type: "peak_hours",
      conditions: {
        days: ['friday', 'saturday', 'sunday'],
        timeStart: "19:00",
        timeEnd: "23:00"
      },
      adjustment: { type: "fixed", value: 10 },
      active: true,
      createdAt: "2025-01-01T00:00:00Z"
    }
  ]);

  const tabs = [
    { id: 'facility', label: 'Facility Info', icon: 'Building' },
    { id: 'courts', label: 'Court Management', icon: 'Grid3x3' },
    { id: 'availability', label: 'Availability', icon: 'Calendar' },
    { id: 'pricing', label: 'Pricing Rules', icon: 'DollarSign' }
  ];

  const handleFacilityUpdate = (updatedData) => {
    console.log('Facility updated:', updatedData);
    // In real app, this would update the facility data
  };

  const handleCourtUpdate = (updatedCourt) => {
    setCourts(prev => prev?.map(court => 
      court?.id === updatedCourt?.id ? updatedCourt : court
    ));
  };

  const handleCourtAdd = (newCourt) => {
    setCourts(prev => [...prev, newCourt]);
  };

  const handleCourtDelete = (courtId) => {
    setCourts(prev => prev?.filter(court => court?.id !== courtId));
  };

  const handleAvailabilityUpdate = (updates) => {
    setAvailability(prev => ({ ...prev, ...updates }));
  };

  const handlePricingUpdate = (updatedRules) => {
    setPricingRules(updatedRules);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facility':
        return (
          <FacilityInfoTab
            facility={facility}
            onUpdate={handleFacilityUpdate}
          />
        );
      case 'courts':
        return (
          <CourtManagementTab
            courts={courts}
            onCourtUpdate={handleCourtUpdate}
            onCourtAdd={handleCourtAdd}
            onCourtDelete={handleCourtDelete}
          />
        );
      case 'availability':
        return (
          <AvailabilityTab
            courts={courts}
            availability={availability}
            onAvailabilityUpdate={handleAvailabilityUpdate}
          />
        );
      case 'pricing':
        return (
          <PricingTab
            courts={courts}
            pricingRules={pricingRules}
            onPricingUpdate={handlePricingUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/facility-owner-dashboard" className="text-text-secondary hover:text-primary transition-colors">
              Dashboard
            </a>
            <Icon name="ChevronRight" size={16} className="text-text-secondary" />
            <span className="text-foreground font-medium">Facility Management</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Facility Management</h1>
              <p className="text-text-secondary mt-2">
                Manage your facility details, courts, availability, and pricing
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Download">
                Export Data
              </Button>
              <Button variant="outline" iconName="Settings">
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Facility Overview Card */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Building" size={32} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{facility?.name}</h2>
                <p className="text-text-secondary mt-1">{facility?.address}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Grid3x3" size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">{courts?.length} Courts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Star" size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">4.8 Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">1,247 Bookings</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">$12,450</div>
              <div className="text-sm text-text-secondary">Monthly Revenue</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card rounded-lg border border-border mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCourtManagement;