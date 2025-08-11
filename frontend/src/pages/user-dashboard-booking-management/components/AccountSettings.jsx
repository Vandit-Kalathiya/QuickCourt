import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettings = ({ user, onUpdateProfile, onUpdatePreferences }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    dateOfBirth: user?.dateOfBirth || '1990-05-15',
    gender: user?.gender || 'male',
    bio: user?.bio || 'Sports enthusiast who loves playing tennis and basketball.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    pushNotifications: user?.preferences?.pushNotifications ?? true,
    bookingReminders: user?.preferences?.bookingReminders ?? true,
    promotionalEmails: user?.preferences?.promotionalEmails ?? false,
    weeklyDigest: user?.preferences?.weeklyDigest ?? true,
    language: user?.preferences?.language || 'en',
    timezone: user?.preferences?.timezone || 'America/New_York',
    currency: user?.preferences?.currency || 'USD'
  });

  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'payment', label: 'Payment Methods', icon: 'CreditCard' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'Shield' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' }
  ];

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await onUpdatePreferences(preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleProfileChange('avatar', url);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={profileData?.avatar}
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
              <Icon name="Camera" size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {profileData?.firstName} {profileData?.lastName}
          </h3>
          <p className="text-text-secondary">{profileData?.email}</p>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              className="mt-2"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={profileData?.firstName}
          onChange={(e) => handleProfileChange('firstName', e?.target?.value)}
          disabled={!isEditing}
          required
        />
        <Input
          label="Last Name"
          value={profileData?.lastName}
          onChange={(e) => handleProfileChange('lastName', e?.target?.value)}
          disabled={!isEditing}
          required
        />
        <Input
          label="Email"
          type="email"
          value={profileData?.email}
          onChange={(e) => handleProfileChange('email', e?.target?.value)}
          disabled={!isEditing}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={profileData?.phone}
          onChange={(e) => handleProfileChange('phone', e?.target?.value)}
          disabled={!isEditing}
        />
        <Input
          label="Date of Birth"
          type="date"
          value={profileData?.dateOfBirth}
          onChange={(e) => handleProfileChange('dateOfBirth', e?.target?.value)}
          disabled={!isEditing}
        />
        <Select
          label="Gender"
          options={genderOptions}
          value={profileData?.gender}
          onChange={(value) => handleProfileChange('gender', value)}
          disabled={!isEditing}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
        <textarea
          value={profileData?.bio}
          onChange={(e) => handleProfileChange('bio', e?.target?.value)}
          disabled={!isEditing}
          className="w-full h-24 px-3 py-2 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:text-text-secondary"
          placeholder="Tell us about yourself..."
          maxLength={200}
        />
        <p className="text-xs text-text-secondary mt-1">{profileData?.bio?.length}/200 characters</p>
      </div>

      {isEditing && (
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            loading={isSaving}
            iconName="Save"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Receive booking confirmations and updates via email"
            checked={preferences?.emailNotifications}
            onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
          />
          <Checkbox
            label="SMS Notifications"
            description="Receive booking reminders via text message"
            checked={preferences?.smsNotifications}
            onChange={(e) => handlePreferenceChange('smsNotifications', e?.target?.checked)}
          />
          <Checkbox
            label="Push Notifications"
            description="Receive real-time notifications in your browser"
            checked={preferences?.pushNotifications}
            onChange={(e) => handlePreferenceChange('pushNotifications', e?.target?.checked)}
          />
          <Checkbox
            label="Booking Reminders"
            description="Get reminded about upcoming bookings"
            checked={preferences?.bookingReminders}
            onChange={(e) => handlePreferenceChange('bookingReminders', e?.target?.checked)}
          />
          <Checkbox
            label="Promotional Emails"
            description="Receive special offers and promotions"
            checked={preferences?.promotionalEmails}
            onChange={(e) => handlePreferenceChange('promotionalEmails', e?.target?.checked)}
          />
          <Checkbox
            label="Weekly Digest"
            description="Get a weekly summary of your activity"
            checked={preferences?.weeklyDigest}
            onChange={(e) => handlePreferenceChange('weeklyDigest', e?.target?.checked)}
          />
        </div>
      </div>

      {/* Regional Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Regional Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Language"
            options={languageOptions}
            value={preferences?.language}
            onChange={(value) => handlePreferenceChange('language', value)}
          />
          <Select
            label="Timezone"
            options={timezoneOptions}
            value={preferences?.timezone}
            onChange={(value) => handlePreferenceChange('timezone', value)}
          />
          <Select
            label="Currency"
            options={currencyOptions}
            value={preferences?.currency}
            onChange={(value) => handlePreferenceChange('currency', value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSavePreferences}
          loading={isSaving}
          iconName="Save"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
        <Button iconName="Plus">Add New Card</Button>
      </div>

      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <div key={method?.id} className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                  <Icon name="CreditCard" size={20} color="white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {method?.brand} •••• {method?.last4}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Expires {method?.expiryMonth}/{method?.expiryYear}
                  </p>
                </div>
                {method?.isDefault && (
                  <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="Edit">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" iconName="Trash2">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Privacy & Security</h3>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Change Password</h4>
                <p className="text-sm text-text-secondary">Update your account password</p>
              </div>
              <Button variant="outline" iconName="Key">
                Change Password
              </Button>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                <p className="text-sm text-text-secondary">Add an extra layer of security</p>
              </div>
              <Button variant="outline" iconName="Shield">
                Enable 2FA
              </Button>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Download Your Data</h4>
                <p className="text-sm text-text-secondary">Export all your account data</p>
              </div>
              <Button variant="outline" iconName="Download">
                Download
              </Button>
            </div>
          </div>

          <div className="bg-error/10 border border-error/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-error">Delete Account</h4>
                <p className="text-sm text-error/80">Permanently delete your account and data</p>
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
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-smooth ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'payment' && renderPaymentTab()}
        {activeTab === 'privacy' && renderPrivacyTab()}
      </div>
    </div>
  );
};

export default AccountSettings;