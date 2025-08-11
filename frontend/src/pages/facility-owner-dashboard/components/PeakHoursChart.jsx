import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PeakHoursChart = () => {
  const peakHoursData = [
    { hour: '6 AM', bookings: 2 },
    { hour: '7 AM', bookings: 5 },
    { hour: '8 AM', bookings: 8 },
    { hour: '9 AM', bookings: 12 },
    { hour: '10 AM', bookings: 15 },
    { hour: '11 AM', bookings: 18 },
    { hour: '12 PM', bookings: 22 },
    { hour: '1 PM', bookings: 20 },
    { hour: '2 PM', bookings: 25 },
    { hour: '3 PM', bookings: 28 },
    { hour: '4 PM', bookings: 32 },
    { hour: '5 PM', bookings: 35 },
    { hour: '6 PM', bookings: 38 },
    { hour: '7 PM', bookings: 35 },
    { hour: '8 PM', bookings: 30 },
    { hour: '9 PM', bookings: 25 },
    { hour: '10 PM', bookings: 15 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-sm text-primary">
            Bookings: {payload?.[0]?.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Peak Hours Analysis</h3>
        <p className="text-sm text-text-secondary">
          Average bookings per hour over the last 30 days
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={peakHoursData}>
            <defs>
              <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="hour" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              interval={1}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#bookingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-foreground">6-7 PM</div>
          <div className="text-sm text-text-secondary">Peak Hours</div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-foreground">38</div>
          <div className="text-sm text-text-secondary">Max Bookings</div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-lg font-semibold text-foreground">85%</div>
          <div className="text-sm text-text-secondary">Utilization</div>
        </div>
      </div>
    </div>
  );
};

export default PeakHoursChart;