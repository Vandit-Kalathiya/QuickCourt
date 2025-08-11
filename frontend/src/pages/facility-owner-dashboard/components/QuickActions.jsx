import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Manage Courts',
      description: 'Add, edit, or configure your courts',
      icon: 'Settings',
      color: 'primary',
      href: '/facility-court-management'
    },
    {
      title: 'View All Bookings',
      description: 'See complete booking history',
      icon: 'Calendar',
      color: 'success',
      href: '/user-dashboard-booking-management'
    },
    {
      title: 'Update Facility',
      description: 'Edit facility information',
      icon: 'Edit',
      color: 'warning',
      href: '/facility-court-management'
    },
    {
      title: 'Pricing & Availability',
      description: 'Manage rates and schedules',
      icon: 'DollarSign',
      color: 'accent',
      href: '/facility-court-management'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary hover:bg-primary/20',
      success: 'bg-success/10 text-success hover:bg-success/20',
      warning: 'bg-warning/10 text-warning hover:bg-warning/20',
      accent: 'bg-accent/10 text-accent hover:bg-accent/20'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action, index) => (
          <a
            key={index}
            href={action?.href}
            className="group block p-4 border border-border rounded-lg hover:border-primary/50 transition-smooth hover:shadow-medium"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-smooth ${getColorClasses(action?.color)}`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-smooth">
                  {action?.title}
                </h4>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {action?.description}
                </p>
              </div>
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-text-secondary group-hover:text-primary transition-smooth" 
              />
            </div>
          </a>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="outline" 
            fullWidth 
            iconName="Plus" 
            iconPosition="left"
          >
            Add New Court
          </Button>
          <Button 
            variant="outline" 
            fullWidth 
            iconName="BarChart3" 
            iconPosition="left"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;