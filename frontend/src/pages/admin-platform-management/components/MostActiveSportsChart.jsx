import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import Button from '../../../components/ui/Button';

const MostActiveSportsChart = () => {
  const [viewType, setViewType] = useState('pie');

  const sportsData = [
    { sport: 'Tennis', bookings: 1245, percentage: 28.5, color: '#1E40AF' },
    { sport: 'Basketball', bookings: 987, percentage: 22.6, color: '#F59E0B' },
    { sport: 'Football', bookings: 756, percentage: 17.3, color: '#10B981' },
    { sport: 'Badminton', bookings: 634, percentage: 14.5, color: '#EF4444' },
    { sport: 'Swimming', bookings: 423, percentage: 9.7, color: '#8B5CF6' },
    { sport: 'Cricket', bookings: 321, percentage: 7.4, color: '#F97316' }
  ];

  const totalBookings = sportsData?.reduce((sum, sport) => sum + sport?.bookings, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-foreground">{data?.sport}</p>
          <p className="text-sm text-text-secondary">
            {data?.bookings} bookings ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Most Active Sports</h3>
          <p className="text-sm text-text-secondary mt-1">Booking distribution by sport type</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={viewType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('pie')}
            iconName="PieChart"
          >
            Pie
          </Button>
          <Button
            variant={viewType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('bar')}
            iconName="BarChart3"
          >
            Bar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full h-80" aria-label="Sports Distribution Chart">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'pie' ? (
              <PieChart>
                <Pie
                  data={sportsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="bookings"
                >
                  {sportsData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={sportsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="sport" 
                  stroke="#6B7280" 
                  fontSize={12}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="bookings" 
                  fill="#1E40AF"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Sport Rankings</h4>
          <div className="space-y-3">
            {sportsData?.map((sport, index) => (
              <div key={sport?.sport} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm font-medium text-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{sport?.sport}</p>
                    <p className="text-sm text-text-secondary">{sport?.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{sport?.percentage}%</p>
                  <div className="w-16 h-2 bg-background rounded-full mt-1">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${sport?.percentage}%`, 
                        backgroundColor: sport?.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Total Bookings:</span>
              <span className="font-medium text-foreground">{totalBookings?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostActiveSportsChart;