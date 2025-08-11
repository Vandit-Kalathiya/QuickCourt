import React, { useEffect, useState } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import FacilityInfoTab from "./components/FacilityInfoTab";
import CourtManagementTab from "./components/CourtManagementTab";
import AvailabilityTab from "./components/AvailabilityTab";
import PricingTab from "./components/PricingTab";
import CreateFacilityForm from "./components/CreateFacilityForm";
import { useOwner } from "context/OwnerContext";

const FacilityCourtManagement = () => {
  const [activeTab, setActiveTab] = useState("facility");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(0);

  const { createFacility, getOwnerFacilities, loading, getFacilityCourts } =
    useOwner();
  const [facilities, setFacilities] = useState([]);
  const [courts, setCourts] = useState([]);
  const [availability, setAvailability] = useState({});
  const [pricingRules, setPricingRules] = useState([]);

  // Get currently selected facility
  const selectedFacility = facilities[selectedFacilityIndex];

  // Initial facilities fetch
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesData = await getOwnerFacilities();
        setFacilities(facilitiesData || []);

        // Reset selectedFacilityIndex if it's out of bounds
        if (facilitiesData && facilitiesData.length > 0) {
          const validIndex =
            selectedFacilityIndex >= facilitiesData.length
              ? 0
              : selectedFacilityIndex;
          setSelectedFacilityIndex(validIndex);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
        setFacilities([]);
      }
    };

    fetchFacilities();
  }, [getOwnerFacilities]); // Remove selectedFacilityIndex from dependencies

  // Fetch courts when facility changes
  useEffect(() => {
    const getCourseList = async () => {
      if (!selectedFacility) return;

      try {
        console.log("Fetching courts for facility:", selectedFacility.id);
        const response = await getFacilityCourts(selectedFacility.id); // Use facility ID, not index
        setCourts(response || []);
      } catch (error) {
        console.error("Error fetching courts:", error);
        setCourts([]);
      }
    };

    getCourseList();
  }, [selectedFacility, getFacilityCourts]); // Depend on selectedFacility object

  // Initialize facility data when facility changes
  useEffect(() => {
    if (selectedFacility) {
      initializeFacilityData(selectedFacility);
    }
  }, [selectedFacility]);

  const initializeFacilityData = (facility) => {
    // Mock availability data
    setAvailability({
      "1-2025-01-11-09:00": "booked",
      "1-2025-01-11-10:00": "booked",
      "1-2025-01-11-18:00": "blocked",
      "1-2025-01-11-19:00": "blocked",
      "2-2025-01-11-15:00": "booked",
      "2-2025-01-11-16:00": "booked",
      "3-2025-01-11-20:00": "maintenance",
    });

    // Mock pricing rules
    setPricingRules([
      {
        id: 1,
        facilityId: facility.id,
        courtId: 1,
        name: "Evening Peak Hours",
        type: "peak_hours",
        conditions: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          timeStart: "18:00",
          timeEnd: "22:00",
        },
        adjustment: { type: "percentage", value: 25 },
        active: true,
        createdAt: "2025-01-01T00:00:00Z",
      },
    ]);
  };

  const tabs = [
    { id: "facility", label: "Facility Info", icon: "Building" },
    { id: "courts", label: "Court Management", icon: "Grid3x3" },
    { id: "availability", label: "Availability", icon: "Calendar" },
    { id: "pricing", label: "Pricing Rules", icon: "DollarSign" },
  ];

  const handleFacilityCreate = async (newFacilityData) => {
    try {
      console.log(newFacilityData);
      const createdFacility = await createFacility(newFacilityData);

      // Add the new facility to the list
      setFacilities((prev) => [...prev, createdFacility]);

      // Select the newly created facility (use the new length as index)
      setSelectedFacilityIndex(facilities.length);

      setShowCreateForm(false);
      console.log("New facility created:", createdFacility);
    } catch (error) {
      console.error("Error creating facility:", error);
    }
  };

  const handleFacilityUpdate = (updatedData) => {
    setFacilities((prev) =>
      prev.map((facility, index) =>
        index === selectedFacilityIndex
          ? { ...facility, ...updatedData }
          : facility
      )
    );
    console.log("Facility updated:", updatedData);
  };

  const handleFacilitySelect = (index) => {
    const newIndex = parseInt(index);
    if (newIndex >= 0 && newIndex < facilities.length) {
      setSelectedFacilityIndex(newIndex);
      setActiveTab("facility"); // Reset to facility tab when switching
    }
  };

  const handleCourtUpdate = (updatedCourt) => {
    setCourts((prev) =>
      prev.map((court) => (court.id === updatedCourt.id ? updatedCourt : court))
    );
  };

  const handleCourtAdd = (newCourt) => {
    if (!selectedFacility) return;

    setCourts((prev) => [
      ...prev,
      { ...newCourt, facilityId: selectedFacility.id },
    ]);
  };

  const handleCourtDelete = (courtId) => {
    setCourts((prev) => prev.filter((court) => court.id !== courtId));
  };

  const handleAvailabilityUpdate = (updates) => {
    setAvailability((prev) => ({ ...prev, ...updates }));
  };

  const handlePricingUpdate = (updatedRules) => {
    setPricingRules(updatedRules);
  };

  const renderTabContent = () => {
    if (!selectedFacility) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon
              name="AlertCircle"
              size={48}
              className="text-text-secondary mx-auto mb-4"
            />
            <p className="text-text-secondary">No facility selected</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "facility":
        return (
          <FacilityInfoTab
            facility={selectedFacility}
            onUpdate={handleFacilityUpdate}
          />
        );
      case "courts":
        return (
          <CourtManagementTab
            courts={courts}
            facilityId={selectedFacility.id}
            onCourtUpdate={handleCourtUpdate}
            onCourtAdd={handleCourtAdd}
            onCourtDelete={handleCourtDelete}
          />
        );
      case "availability":
        return (
          <AvailabilityTab
            courts={courts}
            availability={availability}
            facilityId={selectedFacility.id}
            onAvailabilityUpdate={handleAvailabilityUpdate}
          />
        );
      case "pricing":
        return (
          <PricingTab
            courts={courts}
            pricingRules={pricingRules}
            facilityId={selectedFacility.id}
            onPricingUpdate={handlePricingUpdate}
          />
        );
      default:
        return null;
    }
  };

  // Debug logging
  console.log({
    facilities,
    selectedFacilityIndex,
    selectedFacility,
    courts: courts.length,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (!facilities || facilities.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <a
                href="/dashboard"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                Dashboard
              </a>
              <Icon
                name="ChevronRight"
                size={16}
                className="text-text-secondary"
              />
              <span className="text-foreground font-medium">
                Facility Management
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="Building" size={48} className="text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Facility Management
            </h1>

            <p className="text-text-secondary text-lg max-w-md mb-8">
              Get started by creating your first facility. You can add courts,
              set availability, and manage pricing all in one place.
            </p>

            <Button
              size="lg"
              iconName="Plus"
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-3"
            >
              Create New Facility
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Building" size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Facility Info
                </h3>
                <p className="text-text-secondary text-sm">
                  Manage your facility details, photos, and amenities
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Grid3x3" size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Court Management
                </h3>
                <p className="text-text-secondary text-sm">
                  Add and configure courts with pricing and schedules
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="Calendar" size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Availability & Pricing
                </h3>
                <p className="text-text-secondary text-sm">
                  Set availability and dynamic pricing rules
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <CreateFacilityForm
          isOpen={showCreateForm}
          onSubmit={handleFacilityCreate}
          onCancel={() => setShowCreateForm(false)}
          setShowCreateForm={() => setShowCreateForm}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <a
              href="/dashboard"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Dashboard
            </a>
            <Icon
              name="ChevronRight"
              size={16}
              className="text-text-secondary"
            />
            <span className="text-foreground font-medium">
              Facility Management
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Facility Management
              </h1>
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
              <Button iconName="Plus" onClick={() => setShowCreateForm(true)}>
                Add Facility
              </Button>
            </div>
          </div>
        </div>

        {/* Facility Selector */}
        {facilities.length > 1 && (
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Facility ({facilities.length} facilities)
            </label>
            <select
              value={selectedFacilityIndex}
              onChange={(e) => handleFacilitySelect(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {facilities.map((facility, index) => (
                <option key={facility.id} value={index}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Facility Overview Card */}
        {selectedFacility && (
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Building" size={32} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedFacility.name}
                  </h2>
                  <p className="text-text-secondary mt-1">
                    {selectedFacility.address}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Icon
                        name="Grid3x3"
                        size={16}
                        className="text-text-secondary"
                      />
                      <span className="text-sm text-text-secondary">
                        {courts.length} Courts
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon
                        name="Star"
                        size={16}
                        className="text-text-secondary"
                      />
                      <span className="text-sm text-text-secondary">
                        {selectedFacility.averageRating || 0} Rating
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon
                        name="Users"
                        size={16}
                        className="text-text-secondary"
                      />
                      <span className="text-sm text-text-secondary">
                        {selectedFacility.totalBookings || 0} Bookings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">
                  ₹ {selectedFacility.monthlyRevenue || 0}
                </div>
                <div className="text-sm text-text-secondary">
                  Monthly Revenue
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-card rounded-lg border border-border mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Modal */}
      <CreateFacilityForm
        isOpen={showCreateForm}
        onSubmit={handleFacilityCreate}
        onCancel={() => setShowCreateForm(false)}
        setShowCreateForm={() => setShowCreateForm(false)}
      />
    </div>
  );
};

export default FacilityCourtManagement;
