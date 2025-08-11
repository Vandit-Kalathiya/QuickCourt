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
      description: "Active platform users",
      gradient: "from-blue-500 to-indigo-500",
      emoji: "👥"
    },
    {
      id: 2,
      title: "Facility Owners",
      value: "1,234",
      change: "+12.5%",
      changeType: "increase",
      icon: "Building2",
      description: "Registered facility owners",
      gradient: "from-emerald-500 to-teal-500",
      emoji: "🏢"
    },
    {
      id: 3,
      title: "Total Bookings",
      value: "45,892",
      change: "+15.3%",
      changeType: "increase",
      icon: "Calendar",
      description: "All-time bookings",
      gradient: "from-purple-500 to-pink-500",
      emoji: "📅"
    },
    {
      id: 4,
      title: "Active Courts",
      value: "3,456",
      change: "+5.7%",
      changeType: "increase",
      icon: "MapPin",
      description: "Currently active courts",
      gradient: "from-orange-500 to-red-500",
      emoji: "🏟️"
    },
    {
      id: 5,
      title: "Monthly Revenue",
      value: "$89,234",
      change: "+18.9%",
      changeType: "increase",
      icon: "DollarSign",
      description: "Platform commission",
      gradient: "from-green-500 to-emerald-500",
      emoji: "💰"
    },
    {
      id: 6,
      title: "Pending Approvals",
      value: "23",
      change: "-12.3%",
      changeType: "decrease",
      icon: "Clock",
      description: "Facilities awaiting approval",
      gradient: "from-yellow-500 to-orange-500",
      emoji: "⏳"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData?.map((kpi, index) => (
        <div 
          key={kpi?.id} 
          className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 group hover:-translate-y-2 overflow-hidden"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  {/* Enhanced Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${kpi.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon name={kpi?.icon} size={24} className="text-white" />
                  </div>
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-500">
                    {kpi.emoji}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">{kpi?.title}</h3>
                  <p className="text-3xl font-black text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-4">{kpi?.value}</p>
                </div>
                
                {/* Enhanced Change Indicator */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl border ${
                    kpi?.changeType === 'increase' 
                      ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50' 
                      : 'bg-red-100/80 text-red-700 border-red-200/50'
                  }`}>
                    <Icon 
                      name={kpi?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {kpi?.change}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">vs last month</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{kpi?.description}</p>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full h-1 bg-gray-200/60 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${kpi.gradient} rounded-full transition-all duration-1000 group-hover:w-full`}
                style={{ width: kpi?.changeType === 'increase' ? '75%' : '45%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlatformKPICards;
