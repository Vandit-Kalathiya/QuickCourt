import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useCourt } from "context/CourtContext";
import { useOwner } from "context/OwnerContext";
import AddNewCourt from "./AddNewCourt";

const QuickActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const quickActions = [
    {
      title: "Manage Courts",
      description: "Add, edit, or configure your courts",
      icon: "Settings",
      color: "primary",
      href: "/facility-court-management",
    },
    {
      title: "Manage Facility",
      description: "Edit facility information",
      icon: "Edit",
      color: "warning",
      href: "/facility-court-management",
    },
    {
      title: "View All Bookings",
      description: "See complete booking history",
      icon: "Calendar",
      color: "success",
      href: "/dashboard",
    },
    {
      title: "Pricing & Availability",
      description: "Manage rates and schedules",
      icon: "DollarSign",
      color: "accent",
      href: "/facility-court-management",
    },
  ];


  const getColorClasses = (color) => {
    const colors = {
      primary: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
      success: "bg-success/10 text-success hover:bg-success/20 border-success/20",
      warning: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
      accent: "bg-accent/10 text-accent hover:bg-accent/20 border-accent/20",
    };
    return colors?.[color] || colors?.primary;
  };

  const getGradientClasses = (color) => {
    const gradients = {
      primary: "from-primary/5 to-transparent",
      success: "from-success/5 to-transparent",
      warning: "from-warning/5 to-transparent",
      accent: "from-accent/5 to-transparent",
    };
    return gradients?.[color] || gradients?.primary;
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      facilityId: "",
      sportType: "",
      pricePerHour: "",
      openingTime: "06:00",
      closingTime: "22:00",
      active: true,
    });
  };

  const handleSubmit = async (e) => {
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

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating court:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <>
      <div className="bg-card border border-border/50 rounded-xl shadow-subtle overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
          </div>
        </div>

        <div className="p-6">
          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {quickActions?.map((action, index) => (
              <a
                key={index}
                href={action?.href}
                className={`group block p-5 bg-gradient-to-br ${getGradientClasses(
                  action?.color
                )} border border-border/50 rounded-xl hover:border-primary/50 hover:shadow-medium transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200 group-hover:scale-105 shadow-sm ${getColorClasses(
                      action?.color
                    )}`}
                  >
                    <Icon name={action?.icon} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {action?.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {action?.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-all">
                    <Icon
                      name="ChevronRight"
                      size={14}
                      className="text-text-secondary group-hover:text-primary transition-colors"
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                Add New Court
              </Button>
              <Button
                variant="outline"
                fullWidth
                iconName="BarChart3"
                iconPosition="left"
                className="hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Add Court Modal */}
      <AddNewCourt
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        formData={formData}
        onFormChange={handleFormChange}
        isSubmitting={isSubmitting}
        showFacilitySelect={true}
      />
    </>
  );
};

export default QuickActions;
