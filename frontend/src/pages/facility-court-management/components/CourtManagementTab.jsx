import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import AddNewCourt from "pages/facility-owner-dashboard/components/AddNewCourt";
import { useCourt } from "context/CourtContext";
import { useOwner } from "context/OwnerContext";

const CourtManagementTab = ({
  courts,
  onCourtUpdate,
  onCourtAdd,
  onCourtDelete,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const courtsPerPage = 3;

  const { createCourt, fetchCourts } = useCourt();

  // Filter courts based on search and filters
  const filteredCourts = courts?.filter((court) => {
    const matchesSearch =
      court?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court?.sportType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport =
      filterSport === "all" || court?.sportType === filterSport;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && court?.active) ||
      (filterStatus === "inactive" && !court?.active);

    return matchesSearch && matchesSport && matchesStatus;
  });

  const uniqueSports = [...new Set(courts?.map((court) => court?.sportType))];

  // Pagination logic
  const totalPages = Math.ceil(filteredCourts?.length / courtsPerPage);
  const getPaginatedCourts = () => {
    const startIndex = (currentPage - 1) * courtsPerPage;
    const endIndex = startIndex + courtsPerPage;
    return filteredCourts?.slice(startIndex, endIndex);
  };

  const paginatedCourts = getPaginatedCourts();

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [formData, setFormData] = useState({
    name: "",
    facilityId: "",
    sportType: "",
    pricePerHour: "",
    openingTime: "06:00",
    closingTime: "22:00",
    active: true,
  });

  const handleAddCourt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const courtData = {
        name: formData.name,
        facilityId: formData.facilityId,
        sportType: formData.sportType,
        pricePerHour: parseFloat(formData.pricePerHour),
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        active: formData.active,
      };

      const response = await createCourt(courtData);
      console.log(response);

      // Reset form data
      setFormData({
        name: "",
        facilityId: "",
        sportType: "",
        pricePerHour: "",
        openingTime: "06:00",
        closingTime: "22:00",
        active: true,
      });

      setShowAddModal(false);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Auto-refresh the courts list
      if (onCourtAdd) {
        await onCourtAdd(); // Call parent refresh function if provided
      } else if (fetchCourts) {
        await fetchCourts(); // Fallback to context refresh
      }

      // Reset to first page after adding a court
      setCurrentPage(1);

      // Force a small delay to ensure smooth UI update
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error("Error adding court:", error);
      setIsLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCourt = (court) => {
    setEditingCourt({ ...court });
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      await onCourtUpdate(editingCourt);
      setEditingCourt(null);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Reset to first page after editing
      setCurrentPage(1);

      // Small delay for smooth UI update
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error("Error updating court:", error);
      setIsLoading(false);
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this court? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        await onCourtDelete(courtId);

        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);

        // Adjust page if necessary
        if (paginatedCourts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        setTimeout(() => setIsLoading(false), 300);
      } catch (error) {
        console.error("Error deleting court:", error);
        setIsLoading(false);
      }
    }
  };

  const getSportIcon = (sportType) => {
    const icons = {
      tennis: "Zap",
      basketball: "Circle",
      badminton: "Zap",
      squash: "Square",
      volleyball: "Circle",
      football: "Circle",
      cricket: "Circle",
    };
    return icons?.[sportType] || "Activity";
  };

  const getSportColor = (sportType) => {
    const colors = {
      tennis: "bg-green-500/10 text-green-600 border-green-200",
      basketball: "bg-orange-500/10 text-orange-600 border-orange-200",
      badminton: "bg-blue-500/10 text-blue-600 border-blue-200",
      squash: "bg-purple-500/10 text-purple-600 border-purple-200",
      volleyball: "bg-red-500/10 text-red-600 border-red-200",
      football: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      cricket: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    };
    return (
      colors?.[sportType] || "bg-primary/10 text-primary border-primary/20"
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSport("all");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-xl ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-xl ${
              currentPage === index + 1
                  ? "bg-gradient-to-r from-primary to-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-xl ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-foreground font-medium">
                Updating courts...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <Icon name="CheckCircle" size={20} />
          <span>Court updated successfully!</span>
        </div>
      )}

      {/* Enhanced Header with Stats and Animation */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 rounded-2xl p-8 border border-primary/20 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-4xl font-bold mb-3 bg-clip-text text-blue-800">
                Court Management
              </h2>
              <p className="text-text-secondary text-lg">
                Manage your courts, pricing, and availability with ease
              </p>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    {courts?.filter((c) => c.active)?.length || 0}
                  </p>
                  <p className="text-sm text-text-secondary">Active Courts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-error/5 rounded-lg border border-error/20">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="XCircle" size={20} className="text-error" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-error">
                    {courts?.filter((c) => !c.active)?.length || 0}
                  </p>
                  <p className="text-sm text-text-secondary">Inactive Courts</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Activity" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {uniqueSports?.length || 0}
                  </p>
                  <p className="text-sm text-text-secondary">Sport Types</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowAddModal(true)}
              iconName="Plus"
              iconPosition="left"
              className="hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Add New Court
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search with enhanced styling */}
          <div className="flex-1 relative group">
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Search courts by name or sport..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/30"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Enhanced Filters */}
          <div className="flex gap-3">
            <select
              value={filterSport}
              onChange={(e) => {
                setFilterSport(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/30 min-w-[140px]"
            >
              <option value="all">All Sports</option>
              {uniqueSports?.map((sport) => (
                <option key={sport} value={sport} className="capitalize">
                  {sport}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/30 min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {(searchTerm ||
              filterSport !== "all" ||
              filterStatus !== "all") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                iconName="X"
                iconPosition="left"
                className="hover:bg-error hover:text-white hover:border-error transition-colors"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Courts Grid */}
      {paginatedCourts?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Calendar" size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {searchTerm || filterSport !== "all" || filterStatus !== "all"
              ? "No courts match your filters"
              : "No courts found"}
          </h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            {searchTerm || filterSport !== "all" || filterStatus !== "all"
              ? "Try adjusting your search criteria or clear the filters to see all courts"
              : "Get started by adding your first court to begin managing your sports facility"}
          </p>
          <div className="flex justify-center gap-3">
            {searchTerm || filterSport !== "all" || filterStatus !== "all" ? (
              <Button
                onClick={clearFilters}
                iconName="RefreshCw"
                iconPosition="left"
                variant="outline"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={() => setShowAddModal(true)}
                iconName="Plus"
                iconPosition="left"
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                Add Your First Court
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedCourts?.map((court, index) => (
              <div
                key={court?.id}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Court Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${getSportColor(
                        court?.sportType
                      )} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon name={getSportIcon(court?.sportType)} size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-xl group-hover:text-primary transition-colors mb-1">
                        {court?.name}
                      </h3>
                      <p className="text-sm text-text-secondary capitalize flex items-center gap-2">
                        <Icon name="Zap" size={14} />
                        {court?.sportType}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Status Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                      court?.active
                        ? "bg-success/15 text-success border border-success/20"
                        : "bg-error/15 text-error border border-error/20"
                    }`}
                  >
                    {court?.active ? "Active" : "Inactive"}
                  </div>
                </div>

                {/* Enhanced Court Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-background/50 to-background/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon
                          name="DollarSign"
                          size={16}
                          className="text-primary"
                        />
                      </div>
                      <span className="text-sm font-medium text-text-secondary">
                        Hourly Rate
                      </span>
                    </div>
                    <span className="font-bold text-foreground text-xl">
                      ₹{court?.pricePerHour}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-background/50 to-background/30 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Clock" size={16} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-text-secondary">
                        Operating Hours
                      </span>
                    </div>
                    <span className="text-sm text-foreground font-semibold">
                      {court?.openingTime} - {court?.closingTime}
                    </span>
                  </div>

                  {court?.description && (
                    <div className="p-4 bg-gradient-to-r from-background/50 to-background/30 rounded-xl border border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                          <Icon
                            name="FileText"
                            size={16}
                            className="text-primary"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-text-secondary block mb-2">
                            Description
                          </span>
                          <p className="text-sm text-foreground leading-relaxed">
                            {court?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCourt(court)}
                    className="flex-1 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 group/btn"
                  >
                    <Icon
                      name="Edit"
                      size={14}
                      className="mr-2 group-hover/btn:rotate-12 transition-transform"
                    />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCourt(court?.id)}
                    className="flex-1 hover:bg-error hover:text-white hover:border-error transition-all duration-200 text-error border-error/30 group/btn"
                  >
                    <Icon
                      name="Trash2"
                      size={14}
                      className="mr-2 group-hover/btn:animate-pulse"
                    />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}

      {/* Add Court Modal */}
      <AddNewCourt
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCourt}
        formData={formData}
        onFormChange={handleFormChange}
        isSubmitting={isSubmitting}
        showFacilitySelect={false}
      />

      {/* Enhanced Edit Court Modal */}
      {editingCourt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border p-8 w-full max-w-lg shadow-2xl transform animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  Edit Court
                </h3>
                <p className="text-text-secondary">Update court information</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingCourt(null)}
                className="hover:bg-error/10 hover:text-error"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Court Name
                </label>
                <input
                  type="text"
                  value={editingCourt.name}
                  onChange={(e) =>
                    setEditingCourt({ ...editingCourt, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter court name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  value={editingCourt.pricePerHour}
                  onChange={(e) =>
                    setEditingCourt({
                      ...editingCourt,
                      pricePerHour: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter hourly rate"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setEditingCourt(null)}
                className="flex-1 hover:bg-error/10 hover:text-error hover:border-error/30"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

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

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CourtManagementTab;
