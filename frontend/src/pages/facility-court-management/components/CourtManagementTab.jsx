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
  const [formData, setFormData] = useState({
    name: "",
    facilityId: "",
    sportType: "",
    pricePerHour: "",
    openingTime: "06:00",
    closingTime: "22:00",
    active: true,
  });

  const { createCourt } = useCourt();

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCourt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      console.log(courtData);

      const response = await createCourt(courtData);
      console.log(response);
      setFormData("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding court:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCourt = (court) => {
    setEditingCourt({ ...court });
  };

  const handleSaveEdit = () => {
    onCourtUpdate(editingCourt);
    setEditingCourt(null);
  };

  const handleDeleteCourt = (courtId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this court? This action cannot be undone."
      )
    ) {
      onCourtDelete(courtId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Court Management
          </h2>
          <p className="text-text-secondary mt-1">
            Manage your courts and pricing
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add New Court
        </Button>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courts?.map((court) => (
          <div
            key={court?.id}
            className="bg-card rounded-lg border border-border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon
                    name={getSportIcon(court?.sportType)}
                    size={20}
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {court?.name}
                  </h3>
                  <p className="text-sm text-text-secondary capitalize">
                    {court?.sportType}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCourt(court)}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCourt(court?.id)}
                  className="text-error hover:text-error"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Hourly Rate</span>
                <span className="font-semibold text-foreground">
                  ₹{court?.pricePerHour}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Operating Hours
                </span>
                <span className="text-sm text-foreground">
                  {court?.openingTime} - {court?.closingTime}
                </span>
              </div>

              {/* <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    court?.active === "true"
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {court?.active}
                </span>
              </div> */}

              {court?.description && (
                <p className="text-sm text-text-secondary mt-3 pt-3 border-t border-border">
                  {court?.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Shared Add Court Modal */}
      <AddNewCourt
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCourt}
        formData={formData}
        onFormChange={handleFormChange}
        isSubmitting={isSubmitting}
        showFacilitySelect={false} // Don't show facility selection
      />

      {/* Edit Court Modal - Keep existing implementation */}
      {editingCourt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* Your existing edit modal JSX here */}
        </div>
      )}
    </div>
  );
};

export default CourtManagementTab;
