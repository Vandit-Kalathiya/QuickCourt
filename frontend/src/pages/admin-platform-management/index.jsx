import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PlatformKPICards from './components/PlatformKPICards';
import BookingActivityChart from './components/BookingActivityChart';
import MostActiveSportsChart from './components/MostActiveSportsChart';
import FacilityApprovalQueue from './components/FacilityApprovalQueue';
import UserManagementPanel from './components/UserManagementPanel';
import ReviewModerationSystem from './components/ReviewModerationSystem';
import QuickActionsPanel from './components/QuickActionsPanel';

const AdminPlatformManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Mouse tracking for parallax effects (similar to homepage)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3', gradient: 'from-purple-500 to-cyan-500' },
    { id: 'facilities', label: 'Facilities', icon: 'Building2', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'users', label: 'Users', icon: 'Users', gradient: 'from-blue-500 to-indigo-500' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare', gradient: 'from-orange-500 to-red-500' },
    { id: 'actions', label: 'Quick Actions', icon: 'Zap', gradient: 'from-yellow-500 to-orange-500' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <PlatformKPICards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <BookingActivityChart />
              <MostActiveSportsChart />
            </div>
          </div>
        );
      case 'facilities':
        return <div className="animate-fade-in-up"><FacilityApprovalQueue /></div>;
      case 'users':
        return <div className="animate-fade-in-up"><UserManagementPanel /></div>;
      case 'reviews':
        return <div className="animate-fade-in-up"><ReviewModerationSystem /></div>;
      case 'actions':
        return <div className="animate-fade-in-up"><QuickActionsPanel /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-x-hidden">
      {/* Background Elements - Similar to Homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/15 to-teal-300/15 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        />
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-xl shadow-gray-900/5">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-pink-50/30 to-cyan-50/50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
              <div className="space-y-4">
                {/* Breadcrumb with enhanced styling */}
                <div className="inline-flex items-center bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 border border-white/50 shadow-lg shadow-gray-900/5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-600 font-medium">Admin Portal</span>
                  <Icon name="ChevronRight" size={16} className="mx-2 text-gray-400" />
                  <span className="text-purple-600 font-semibold">Dashboard</span>
                </div>
                
                {/* Enhanced Title */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
                    Platform <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Management</span>
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl font-medium">
                    Comprehensive oversight and management of the SportBooker platform with real-time insights
                  </p>
                </div>
              </div>
              
              {/* Enhanced Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="relative bg-white/80 backdrop-blur-xl text-gray-700 px-6 py-3 rounded-2xl font-semibold overflow-hidden group shadow-lg shadow-gray-900/5 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300 border border-white/50 hover:bg-white/90">
                  <div className="flex items-center space-x-2">
                    <Icon name="Download" size={18} />
                    <span>Export Data</span>
                  </div>
                </button>
                <button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold overflow-hidden group shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="relative flex items-center space-x-2">
                    <Icon name="Settings" size={18} />
                    <span>Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="relative bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-3 overflow-x-auto py-2">
            {tabs?.map((tab, index) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`relative flex items-center space-x-3 py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-500 whitespace-nowrap group ${
                  activeTab === tab?.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl shadow-gray-900/10 transform scale-105`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-lg hover:shadow-gray-900/5'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: activeTab === tab?.id ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div className={`p-2 rounded-xl ${
                  activeTab === tab?.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-white'
                } transition-all duration-300`}>
                  <Icon name={tab?.icon} size={18} />
                </div>
                <span className="font-bold">{tab?.label}</span>
                
                {/* Active indicator */}
                {activeTab === tab?.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="relative">
          {renderTabContent()}
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <span className="text-white font-bold">© {new Date()?.getFullYear()} SportBooker Admin</span>
                  <div className="text-gray-400">Platform Version 2.1.0</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {[
                { icon: 'HelpCircle', label: 'Help' },
                { icon: 'FileText', label: 'Documentation' },
                { icon: 'MessageCircle', label: 'Support' }
              ].map((item, index) => (
                <button
                  key={item.label}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon name={item.icon} size={16} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminPlatformManagement;