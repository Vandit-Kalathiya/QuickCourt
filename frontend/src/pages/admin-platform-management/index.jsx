import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PlatformKPICards from './components/PlatformKPICards';
import BookingActivityChart from './components/BookingActivityChart';
import MostActiveSportsChart from './components/MostActiveSportsChart';
import FacilityApprovalQueue from './components/FacilityApprovalQueue';
import UserManagementPanel from './components/UserManagementPanel';
import ReviewModerationSystem from './components/ReviewModerationSystem';
import QuickActionsPanel from './components/QuickActionsPanel';

const AdminPlatformManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'facilities', label: 'Facilities', icon: 'Building2' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' },
    { id: 'actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <PlatformKPICards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <BookingActivityChart />
              <MostActiveSportsChart />
            </div>
          </div>
        );
      case 'facilities':
        return <FacilityApprovalQueue />;
      case 'users':
        return <UserManagementPanel />;
      case 'reviews':
        return <ReviewModerationSystem />;
      case 'actions':
        return <QuickActionsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center space-x-2 text-sm text-text-secondary mb-2">
                  <span>Admin Portal</span>
                  <Icon name="ChevronRight" size={16} />
                  <span>Dashboard</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground">Platform Management</h1>
                <p className="text-text-secondary mt-1">
                  Comprehensive oversight and management of the SportBooker platform
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" iconName="Download">
                  Export Data
                </Button>
                <Button variant="default" iconName="Settings">
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <span>© {new Date()?.getFullYear()} SportBooker Admin</span>
              <span>•</span>
              <span>Platform Version 2.1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" iconName="HelpCircle">
                Help
              </Button>
              <Button variant="ghost" size="sm" iconName="FileText">
                Documentation
              </Button>
              <Button variant="ghost" size="sm" iconName="MessageCircle">
                Support
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPlatformManagement;