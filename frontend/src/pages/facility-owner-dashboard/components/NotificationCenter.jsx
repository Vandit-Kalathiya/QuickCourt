import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      message: 'Sarah Johnson requested Tennis Court A for Aug 15, 2:00 PM',
      time: '5 minutes ago',
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $80 received for booking BK003',
      time: '1 hour ago',
      unread: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'review',
      title: 'New Review',
      message: 'Mike Davis left a 5-star review for your facility',
      time: '2 hours ago',
      unread: false,
      priority: 'low'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'Your facility profile has been updated successfully',
      time: '3 hours ago',
      unread: false,
      priority: 'low'
    },
    {
      id: 5,
      type: 'cancellation',
      title: 'Booking Cancelled',
      message: 'Customer cancelled booking BK002 for Aug 13',
      time: '4 hours ago',
      unread: false,
      priority: 'medium'
    }
  ]);

  const getNotificationIcon = (type) => {
    const icons = {
      booking: 'Calendar',
      payment: 'DollarSign',
      review: 'Star',
      system: 'Settings',
      cancellation: 'XCircle'
    };
    return icons?.[type] || 'Bell';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    if (type === 'payment') return 'text-success';
    if (type === 'review') return 'text-warning';
    return 'text-primary';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-error/10 text-error',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-secondary/10 text-secondary'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors?.[priority]}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev?.map(notification => 
      notification?.id === id 
        ? { ...notification, unread: false }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev?.map(notification => 
      ({ ...notification, unread: false })
    ));
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-primary hover:text-primary"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications?.map((notification) => (
          <div
            key={notification?.id}
            className={`p-4 border-b border-border hover:bg-muted/50 transition-smooth cursor-pointer ${
              notification?.unread ? 'bg-accent/5' : ''
            }`}
            onClick={() => markAsRead(notification?.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getNotificationColor(notification?.type, notification?.priority)}`}>
                <Icon name={getNotificationIcon(notification?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${notification?.unread ? 'text-foreground' : 'text-text-secondary'}`}>
                    {notification?.title}
                  </h4>
                  {getPriorityBadge(notification?.priority)}
                </div>
                
                <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                  {notification?.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    {notification?.time}
                  </span>
                  {notification?.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="Bell" iconPosition="left">
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationCenter;