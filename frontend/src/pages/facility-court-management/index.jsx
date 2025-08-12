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

        {facilities.length > 1 && (
          <div className="bg-white rounded-xl border-2 border-border p-6 mb-8 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Icon name="Building2" size={20} className="text-emerald-600" />
              </div>
              <div>
                <label className="block text-lg font-bold text-foreground">
                  Select Facility
                </label>
                <p className="text-sm text-text-secondary">
                  Choose from {facilities.length} facilities to manage
                </p>
              </div>
            </div>

            <div className="relative">
              <Icon
                name="ChevronDown"
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"
              />
              <select
                value={selectedFacilityIndex}
                onChange={(e) => handleFacilitySelect(e.target.value)}
                className="w-full max-w-lg px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/30 appearance-none cursor-pointer font-medium"
              >
                {facilities.map((facility, index) => (
                  <option key={facility.id} value={index} className="py-2">
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Enhanced Facility Overview Card */}
        {selectedFacility && (
          <div className="bg-white rounded-xl border-2 border-border p-8 mb-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-success/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Main Facility Info */}
                <div className="flex items-start space-x-6 flex-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-inner">
                    <Icon name="Building" size={36} className="text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">
                        {selectedFacility.name}
                      </h2>
                      <div className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/20">
                        Active
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Icon
                        name="MapPin"
                        size={16}
                        className="text-text-secondary"
                      />
                      <p className="text-text-secondary">
                        {selectedFacility.address}
                      </p>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Icon
                            name="Grid3x3"
                            size={18}
                            className="text-blue-600"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-700">
                            {courts.length}
                          </p>
                          <p className="text-xs font-medium text-blue-600">
                            {courts.length === 1 ? "Court" : "Courts"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                          <Icon
                            name="Star"
                            size={18}
                            className="text-amber-600"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-amber-700">
                            {selectedFacility.averageRating || "0.0"}
                          </p>
                          <p className="text-xs font-medium text-amber-600">
                            Rating
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <Icon
                            name="Users"
                            size={18}
                            className="text-purple-600"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-purple-700">
                            {selectedFacility.totalBookings || 0}
                          </p>
                          <p className="text-xs font-medium text-purple-600">
                            Bookings
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Section */}
                <div className="lg:text-right">
                  <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border-2 border-success/20 min-w-[200px]">
                    <div className="flex items-center justify-center lg:justify-end gap-2 mb-2">
                      <Icon
                        name="TrendingUp"
                        size={20}
                        className="text-success"
                      />
                      <span className="text-sm font-semibold text-success">
                        Monthly Revenue
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-success mb-1">
                      ₹{" "}
                      {(selectedFacility.monthlyRevenue || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center lg:justify-end gap-1">
                      <Icon name="ArrowUp" size={14} className="text-success" />
                      <span className="text-sm text-success font-medium">
                        +12% from last month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-card rounded-xl border border-border mb-8">
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
