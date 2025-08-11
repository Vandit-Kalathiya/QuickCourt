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
    <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500 group overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="inline-flex items-center bg-purple-100/80 backdrop-blur-sm rounded-full px-2 py-2 mb-4 border border-purple-200/50 shadow-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-purple-700 text-sm font-semibold">Analytics</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Activity Trends</h3>
            <p className="text-gray-600 font-medium">Platform booking patterns over time</p>
          </div>
          
          <div className="flex items-center space-x-1 mt-6 sm:mt-0">
            {/* Time Range Buttons */}
            <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-2xl p-1 border border-white/50 shadow-lg shadow-gray-900/5">
              {timeRangeOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => setTimeRange(option?.value)}
                  className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all duration-300 ${
                    timeRange === option?.value
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                  }`}
                >
                  {option?.label}
                </button>
              ))}
            </div>
            
            {/* Chart Type Buttons */}
            <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-2xl p-1 border border-white/50 shadow-lg shadow-gray-900/5">
              <button
                onClick={() => setChartType('line')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  chartType === 'line'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                }`}
              >
                <span>📈</span>
                <span>Line</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  chartType === 'bar'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                }`}
              >
                <span>📊</span>
                <span>Bar</span>
              </button>
            </div>         
          </div>
        </div>

        {/* Enhanced Chart Container */}
        <div className="w-full h-80 bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-inner" aria-label="Booking Activity Chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight="500"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontWeight: '600'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 3, fill: '#fff' }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </LineChart>
            ) : (
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  fontWeight="500"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontWeight: '600'
                  }}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200/50">
          {[
            { number: "4,192", label: "Total Bookings", icon: "🎯", gradient: "from-yellow-400 to-orange-500" },
            { number: "$209,600", label: "Total Revenue", icon: "💰", gradient: "from-emerald-400 to-teal-500" },
            { number: "349", label: "Avg Daily", icon: "📈", gradient: "from-blue-400 to-indigo-500" },
            { number: "+18.5%", label: "Growth Rate", icon: "🚀", gradient: "from-purple-400 to-pink-500" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 group hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative text-center">
                <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-500">
                  {stat.icon}
                </div>
                <p className="text-2xl font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingActivityChart;
