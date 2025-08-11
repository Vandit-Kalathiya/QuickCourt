import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const BookingActivityChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');

  const bookingData = [
    { date: 'Jan 1', bookings: 245, revenue: 12250 },
    { date: 'Jan 2', bookings: 312, revenue: 15600 },
    { date: 'Jan 3', bookings: 189, revenue: 9450 },
    { date: 'Jan 4', bookings: 278, revenue: 13900 },
    { date: 'Jan 5', bookings: 356, revenue: 17800 },
    { date: 'Jan 6', bookings: 423, revenue: 21150 },
    { date: 'Jan 7', bookings: 389, revenue: 19450 },
    { date: 'Jan 8', bookings: 445, revenue: 22250 },
    { date: 'Jan 9', bookings: 367, revenue: 18350 },
    { date: 'Jan 10', bookings: 298, revenue: 14900 },
    { date: 'Jan 11', bookings: 334, revenue: 16700 },
    { date: 'Jan 12', bookings: 412, revenue: 20600 }
  ];

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + "Date,Bookings,Revenue\n" +
      bookingData?.map(row => `${row?.date},${row?.bookings},${row?.revenue}`)?.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", "booking_activity.csv");
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Booking Activity Trends</h3>
          <p className="text-sm text-text-secondary mt-1">Platform booking patterns over time</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            {timeRangeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setTimeRange(option?.value)}
                className={`px-3 py-1 text-sm rounded-md transition-smooth ${
                  timeRange === option?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-text-secondary hover:bg-muted/80'
                }`}
              >
                {option?.label}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
            >
              Bar
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            iconName="Download"
          >
            Export
          </Button>
        </div>
      </div>
      <div className="w-full h-80" aria-label="Booking Activity Chart">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#1E40AF" 
                strokeWidth={2}
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="bookings" 
                fill="#1E40AF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">4,192</p>
          <p className="text-sm text-text-secondary">Total Bookings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">$209,600</p>
          <p className="text-sm text-text-secondary">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">349</p>
          <p className="text-sm text-text-secondary">Avg Daily</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">+18.5%</p>
          <p className="text-sm text-text-secondary">Growth Rate</p>
        </div>
      </div>
    </div>
  );
};

export default BookingActivityChart;