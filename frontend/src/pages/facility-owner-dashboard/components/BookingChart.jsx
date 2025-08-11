import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import Button from '../../../components/ui/Button';

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
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="text-foreground font-medium">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name === 'bookings' ? 'Bookings' : 'Revenue'}: {entry?.value}
              {entry?.name === 'revenue' && ' USD'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-foreground">Booking Analytics</h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex space-x-2">
            <Button
              variant={timeRange === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7days')}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'bookings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bookings')}
              iconName="Calendar"
              iconPosition="left"
            >
              Bookings
            </Button>
            <Button
              variant={chartType === 'revenue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('revenue')}
              iconName="DollarSign"
              iconPosition="left"
            >
              Revenue
            </Button>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bookings' ? (
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="bookings" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingChart;