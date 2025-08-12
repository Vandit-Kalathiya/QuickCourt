import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import { useAuth } from "context/AuthContext";

const AccountSettings = ({ onUpdateProfile, onUpdatePreferences }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const { userProfile } = useAuth();
  const [user, setUser] = useState();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Initialize profile data based on actual user object structure
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
      setProfileData({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        avatar: userProfile?.avatar || null,
      });
    }
  }, [userProfile]);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    promotionalEmails: false,
    weeklyDigest: true,
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
  });

  const [paymentMethods] = useState([
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: "User", color: "blue" },
    { id: "preferences", label: "Preferences", icon: "Settings", color: "purple" },
    { id: "payment", label: "Payment Methods", icon: "CreditCard", color: "green" },
    { id: "privacy", label: "Privacy & Security", icon: "Shield", color: "red" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  ];

  const currencyOptions = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
  ];

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile(profileData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await onUpdatePreferences(preferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleProfileChange("avatar", url);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Enhanced Avatar Section */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-lg">
              {profileData?.avatar ? (
                <Image
                  src={profileData.avatar}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {getInitials(profileData?.name)}
                  </span>
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors group-hover:scale-110 transform duration-200">
                <Icon name="Camera" size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {profileData?.name || "User"}
            </h2>
            <p className="text-text-secondary text-lg mb-4">{profileData?.email}</p>
            
            {/* User Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Member Since</span>
                </div>
                <p className="text-sm text-emerald-600 mt-1">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Account Status</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {user?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                className="hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form - Only show available fields */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Icon name="User" size={24} className="text-primary" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={profileData?.name || ""}
            onChange={(e) => handleProfileChange("name", e?.target?.value)}
            disabled={!isEditing}
            required
            className="transition-all duration-200 focus:shadow-md"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={profileData?.email || ""}
            onChange={(e) => handleProfileChange("email", e?.target?.value)}
            disabled={!isEditing}
            required
            className="transition-all duration-200 focus:shadow-md"
          />
        </div>

        {/* Account Information */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Info" size={18} className="text-primary" />
            Account Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">User ID:</span>
              <p className="font-mono text-xs text-foreground break-all">{user?.id}</p>
            </div>
            <div>
              <span className="text-text-secondary">Role:</span>
              <p className="font-medium text-foreground">{user?.role}</p>
            </div>
            <div>
              <span className="text-text-secondary">Last Updated:</span>
              <p className="text-foreground">{formatDate(user?.updatedAt)}</p>
            </div>
            <div>
              <span className="text-text-secondary">Status:</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user?.isActive ? 'bg-success' : 'bg-error'}`}></div>
                <span className={user?.isActive ? 'text-success' : 'text-error'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                // Reset to original data
                setProfileData({
                  name: user?.name || "",
                  email: user?.email || "",
                  avatar: user?.avatar || null,
                });
              }}
              disabled={isSaving}
              className="hover:bg-error/10 hover:border-error/30 hover:text-error"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              loading={isSaving}
              iconName="Save"
              className="bg-success hover:bg-success/90"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-8">
      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Icon name="Bell" size={24} className="text-purple-600" />
          Notification Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-xl hover:bg-primary/5 transition-colors">
              <Checkbox
                label="Email Notifications"
                description="Receive booking confirmations and updates via email"
                checked={preferences?.emailNotifications}
                onChange={(e) => handlePreferenceChange("emailNotifications", e?.target?.checked)}
              />
            </div>
            <div className="p-4 border border-border rounded-xl hover:bg-primary/5 transition-colors">
              <Checkbox
                label="Push Notifications"
                description="Receive real-time notifications in your browser"
                checked={preferences?.pushNotifications}
                onChange={(e) => handlePreferenceChange("pushNotifications", e?.target?.checked)}
              />
            </div>
            <div className="p-4 border border-border rounded-xl hover:bg-primary/5 transition-colors">
              <Checkbox
                label="Booking Reminders"
                description="Get reminded about upcoming bookings"
                checked={preferences?.bookingReminders}
                onChange={(e) => handlePreferenceChange("bookingReminders", e?.target?.checked)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-xl hover:bg-primary/5 transition-colors">
              <Checkbox
                label="Promotional Emails"
                description="Receive special offers and promotions"
                checked={preferences?.promotionalEmails}
                onChange={(e) => handlePreferenceChange("promotionalEmails", e?.target?.checked)}
              />
            </div>
            <div className="p-4 border border-border rounded-xl hover:bg-primary/5 transition-colors">
              <Checkbox
                label="Weekly Digest"
                description="Get a weekly summary of your activity"
                checked={preferences?.weeklyDigest}
                onChange={(e) => handlePreferenceChange("weeklyDigest", e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Preferences */}
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Icon name="Globe" size={24} className="text-indigo-600" />
          Regional Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Language"
            options={languageOptions}
            value={preferences?.language}
            onChange={(value) => handlePreferenceChange("language", value)}
          />
          <Select
            label="Timezone"
            options={timezoneOptions}
            value={preferences?.timezone}
            onChange={(value) => handlePreferenceChange("timezone", value)}
          />
          <Select
            label="Currency"
            options={currencyOptions}
            value={preferences?.currency}
            onChange={(value) => handlePreferenceChange("currency", value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSavePreferences}
          loading={isSaving}
          iconName="Save"
          className="bg-purple-600 hover:bg-purple-700"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
            <Icon name="CreditCard" size={24} className="text-green-600" />
            Payment Methods
          </h3>
          <Button iconName="Plus" className="bg-green-600 hover:bg-green-700">
            Add New Card
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods?.map((method) => (
            <div key={method?.id} className="p-6 border-2 border-border rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
                    <Icon name="CreditCard" size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-lg">
                      {method?.brand} •••• {method?.last4}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Expires {method?.expiryMonth}/{method?.expiryYear}
                    </p>
                  </div>
                  {method?.isDefault && (
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/20">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="Edit" className="hover:bg-primary/5">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" iconName="Trash2" className="hover:bg-error/10 hover:text-error">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Icon name="Shield" size={24} className="text-red-600" />
          Privacy & Security
        </h3>
        <div className="space-y-6">
          <div className="p-6 border-2 border-border rounded-xl hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon name="Key" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">Change Password</h4>
                  <p className="text-sm text-text-secondary">
                    Update your account password for better security
                  </p>
                </div>
              </div>
              <Button variant="outline" iconName="Key" className="hover:bg-blue-50 hover:border-blue-300">
                Change Password
              </Button>
            </div>
          </div>

          <div className="p-6 border-2 border-border rounded-xl hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <Button variant="outline" iconName="Shield" className="hover:bg-green-50 hover:border-green-300">
                Enable 2FA
              </Button>
            </div>
          </div>

          <div className="p-6 border-2 border-border rounded-xl hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Icon name="Download" size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">
                    Download Your Data
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Export all your account data in JSON format
                  </p>
                </div>
              </div>
              <Button variant="outline" iconName="Download" className="hover:bg-purple-50 hover:border-purple-300">
                Download
              </Button>
            </div>
          </div>

          <div className="p-6 border-2 border-error/30 bg-error/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                  <Icon name="Trash2" size={20} className="text-error" />
                </div>
                <div>
                  <h4 className="font-semibold text-error text-lg">Delete Account</h4>
                  <p className="text-sm text-error/80">
                    Permanently delete your account and all associated data
                  </p>
                </div>
              </div>
              <Button variant="destructive" iconName="Trash2">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-success text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-slide-in">
          <Icon name="CheckCircle" size={20} />
          <span className="font-medium">Settings updated successfully!</span>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="bg-white rounded-3xl border-2 border-border p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon name="Settings" size={28} className="text-primary" />
              </div>
              Account Settings
            </h1>
            <p className="text-text-secondary text-lg">
              Manage your account preferences and security settings
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-text-secondary">Welcome back,</p>
              <p className="font-semibold text-foreground">{user?.name}</p>
            </div>
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20">
              {profileData?.avatar ? (
                <Image src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {getInitials(user?.name)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        <nav className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-3 py-6 px-8 border-b-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab?.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-text-secondary hover:text-foreground hover:bg-gray-50"
              }`}
            >
              <Icon name={tab?.icon} size={20} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "preferences" && renderPreferencesTab()}
          {activeTab === "payment" && renderPaymentTab()}
          {activeTab === "privacy" && renderPrivacyTab()}
        </div>
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

export default AccountSettings;
