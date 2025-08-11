import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const QuickActionsPanel = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const quickActions = [
    {
      id: 'announcement',
      title: 'Platform Announcement',
      description: 'Send announcement to all users',
      icon: 'Megaphone',
      color: 'bg-primary',
      action: () => setShowAnnouncementModal(true)
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: isMaintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode',
      icon: 'Settings',
      color: isMaintenanceMode ? 'bg-error' : 'bg-warning',
      action: () => setIsMaintenanceMode(!isMaintenanceMode)
    },
    {
      id: 'backup',
      title: 'System Backup',
      description: 'Create platform data backup',
      icon: 'Database',
      color: 'bg-success',
      action: () => console.log('Creating system backup...')
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      description: 'Export platform analytics',
      icon: 'FileText',
      color: 'bg-secondary',
      action: () => console.log('Generating reports...')
    },
    {
      id: 'users',
      title: 'User Analytics',
      description: 'View detailed user insights',
      icon: 'Users',
      color: 'bg-accent',
      action: () => window.location.href = '/admin-platform-management?tab=users'
    },
    {
      id: 'facilities',
      title: 'Facility Overview',
      description: 'Manage facility approvals',
      icon: 'Building2',
      color: 'bg-primary',
      action: () => window.location.href = '/admin-platform-management?tab=facilities'
    }
  ];

  const systemStats = [
    {
      label: 'Server Status',
      value: 'Online',
      status: 'success',
      icon: 'Server'
    },
    {
      label: 'Database',
      value: '99.9% Uptime',
      status: 'success',
      icon: 'Database'
    },
    {
      label: 'API Response',
      value: '45ms avg',
      status: 'success',
      icon: 'Zap'
    },
    {
      label: 'Storage Used',
      value: '67% of 1TB',
      status: 'warning',
      icon: 'HardDrive'
    }
  ];

  const handleSendAnnouncement = () => {
    if (announcementText?.trim()) {
      console.log('Sending announcement:', announcementText);
      setAnnouncementText('');
      setShowAnnouncementModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={action?.action}
              className="flex items-center space-x-3 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-smooth text-left"
            >
              <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{action?.title}</h4>
                <p className="text-sm text-text-secondary">{action?.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Status</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats?.map((stat) => (
            <div key={stat?.label} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={stat?.icon} size={16} className={getStatusColor(stat?.status)} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">{stat?.label}</p>
                <p className={`font-medium ${getStatusColor(stat?.status)}`}>{stat?.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Platform Configuration */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4">Platform Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={20} className="text-primary" />
              <div>
                <h4 className="font-medium text-foreground">Security Settings</h4>
                <p className="text-sm text-text-secondary">Manage platform security configuration</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={20} className="text-accent" />
              <div>
                <h4 className="font-medium text-foreground">Email Templates</h4>
                <p className="text-sm text-text-secondary">Customize notification email templates</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="CreditCard" size={20} className="text-success" />
              <div>
                <h4 className="font-medium text-foreground">Payment Settings</h4>
                <p className="text-sm text-text-secondary">Configure payment gateways and fees</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name={isMaintenanceMode ? "AlertTriangle" : "CheckCircle"} size={20} className={isMaintenanceMode ? "text-error" : "text-success"} />
              <div>
                <h4 className="font-medium text-foreground">Maintenance Mode</h4>
                <p className="text-sm text-text-secondary">
                  {isMaintenanceMode ? 'Platform is in maintenance mode' : 'Platform is operational'}
                </p>
              </div>
            </div>
            <Button 
              variant={isMaintenanceMode ? "destructive" : "outline"} 
              size="sm"
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
            >
              {isMaintenanceMode ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>
      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Send Platform Announcement</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Announcement Message
                </label>
                <textarea
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e?.target?.value)}
                  placeholder="Enter your announcement message..."
                  className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-accent mt-0.5" />
                  <p className="text-sm text-foreground">
                    This announcement will be sent to all registered users via email and displayed as a platform notification.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSendAnnouncement}
                  disabled={!announcementText?.trim()}
                  iconName="Send"
                >
                  Send Announcement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsPanel;