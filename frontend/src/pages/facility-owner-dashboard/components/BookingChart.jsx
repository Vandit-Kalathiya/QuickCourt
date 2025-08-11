import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BookingChart = () => {
  const [chartType, setChartType] = useState('bookings');
  const [timeRange, setTimeRange] = useState('7days');

  const bookingData = [
    { name: 'Mon', bookings: 12, revenue: 480 },
    { name: 'Tue', bookings: 19, revenue: 760 },
    { name: 'Wed', bookings: 15, revenue: 600 },
    { name: 'Thu', bookings: 22, revenue: 880 },
    { name: 'Fri', bookings: 28, revenue: 1120 },
    { name: 'Sat', bookings: 35, revenue: 1400 },
    { name: 'Sun', bookings: 31, revenue: 1240 }
  ];

  const monthlyData = [
    { name: 'Jan', bookings: 420, revenue: 16800 },
    { name: 'Feb', bookings: 380, revenue: 15200 },
    { name: 'Mar', bookings: 450, revenue: 18000 },
    { name: 'Apr', bookings: 520, revenue: 20800 },
    { name: 'May', bookings: 580, revenue: 23200 },
    { name: 'Jun', bookings: 640, revenue: 25600 },
    { name: 'Jul', bookings: 720, revenue: 28800 },
    { name: 'Aug', bookings: 680, revenue: 27200 }
  ];

  const getCurrentData = () => {
    return timeRange === '7days' ? bookingData : monthlyData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <p className="text-foreground font-semibold mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm flex items-center space-x-2" style={{ color: entry?.color }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry?.color }}></div>
              <span>
                {entry?.name === 'bookings' ? 'Bookings' : 'Revenue'}: <span className="font-medium">{entry?.value}</span>
                {entry?.name === 'revenue' && ' USD'}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-subtle">
      {/* Header - Enhanced */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Booking Analytics</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Time Range Selector */}
          <div className="flex space-x-2 p-1 bg-muted/50 rounded-lg border border-border/50">
            <Button
              variant={timeRange === '7days' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('7days')}
              className={`${timeRange === '7days' ? 'bg-primary text-white shadow-sm' : 'hover:bg-muted'} transition-all`}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('monthly')}
              className={`${timeRange === 'monthly' ? 'bg-primary text-white shadow-sm' : 'hover:bg-muted'} transition-all`}
            >
              Monthly
            </Button>
          </div>
          
          {/* Chart Type Selector */}
          <div className="flex space-x-2 p-1 bg-muted/50 rounded-lg border border-border/50">
            <Button
              variant={chartType === 'bookings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bookings')}
              iconName="Calendar"
              iconPosition="left"
              className={`${chartType === 'bookings' ? 'bg-primary text-white shadow-sm' : 'hover:bg-muted'} transition-all`}
            >
              Bookings
            </Button>
            <Button
              variant={chartType === 'revenue' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('revenue')}
              iconName="DollarSign"
              iconPosition="left"
              className={`${chartType === 'revenue' ? 'bg-success text-white shadow-sm' : 'hover:bg-muted'} transition-all`}
            >
              Revenue
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Container - Enhanced */}
      <div className="h-80 bg-gradient-to-br from-muted/10 to-transparent rounded-xl p-4 border border-border/30">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bookings' ? (
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                fontWeight={500}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="bookings" 
                fill="var(--color-primary)" 
                radius={[6, 6, 0, 0]}
                className="drop-shadow-sm"
              />
            </BarChart>
          ) : (
            <LineChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                fontWeight={500}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-success)" 
                strokeWidth={4}
                dot={{ fill: 'var(--color-success)', strokeWidth: 3, r: 5, className: 'drop-shadow-sm' }}
                activeDot={{ r: 7, stroke: 'var(--color-success)', strokeWidth: 3, className: 'drop-shadow-md' }}
                className="drop-shadow-sm"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
        <span>Data updates in real-time</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>
    </div>
  );
};

export default BookingChart;
