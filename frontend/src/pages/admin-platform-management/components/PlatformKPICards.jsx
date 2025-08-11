import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformKPICards = () => {
  const kpiData = [
    {
      id: 1,
      title: "Total Users",
      value: "12,847",
      change: "+8.2%",
      changeType: "increase",
      icon: "Users",
      description: "Active platform users"
    },
    {
      id: 2,
      title: "Facility Owners",
      value: "1,234",
      change: "+12.5%",
      changeType: "increase",
      icon: "Building2",
      description: "Registered facility owners"
    },
    {
      id: 3,
      title: "Total Bookings",
      value: "45,892",
      change: "+15.3%",
      changeType: "increase",
      icon: "Calendar",
      description: "All-time bookings"
    },
    {
      id: 4,
      title: "Active Courts",
      value: "3,456",
      change: "+5.7%",
      changeType: "increase",
      icon: "MapPin",
      description: "Currently active courts"
    },
    {
      id: 5,
      title: "Monthly Revenue",
      value: "$89,234",
      change: "+18.9%",
      changeType: "increase",
      icon: "DollarSign",
      description: "Platform commission"
    },
    {
      id: 6,
      title: "Pending Approvals",
      value: "23",
      change: "-12.3%",
      changeType: "decrease",
      icon: "Clock",
      description: "Facilities awaiting approval"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData?.map((kpi) => (
        <div key={kpi?.id} className="bg-card border border-border rounded-lg p-6 shadow-subtle hover:shadow-medium transition-smooth">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={kpi?.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary">{kpi?.title}</h3>
                  <p className="text-2xl font-bold text-foreground">{kpi?.value}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  kpi?.changeType === 'increase' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}>
                  <Icon 
                    name={kpi?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                    className="mr-1" 
                  />
                  {kpi?.change}
                </span>
                <span className="text-xs text-text-secondary">vs last month</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-text-secondary mt-3">{kpi?.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PlatformKPICards;