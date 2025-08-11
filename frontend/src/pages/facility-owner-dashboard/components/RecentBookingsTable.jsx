import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentBookingsTable = () => {
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '+1 (555) 123-4567',
      court: 'Tennis Court A',
      date: '2025-08-12',
      time: '10:00 AM - 12:00 PM',
      duration: '2 hours',
      amount: 80,
      status: 'CONFIRMED',
      bookingDate: '2025-08-10'
    },
    {
      id: 'BK002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1 (555) 987-6543',
      court: 'Basketball Court B',
      date: '2025-08-12',
      time: '2:00 PM - 4:00 PM',
      duration: '2 hours',
      amount: 60,
      status: 'PENDING',
      bookingDate: '2025-08-11'
    },
    {
      id: 'BK003',
      customerName: 'Mike Davis',
      customerEmail: 'mike.davis@email.com',
      customerPhone: '+1 (555) 456-7890',
      court: 'Tennis Court B',
      date: '2025-08-13',
      time: '6:00 PM - 8:00 PM',
      duration: '2 hours',
      amount: 80,
      status: 'CONFIRMED',
      bookingDate: '2025-08-11'
    },
    {
      id: 'BK004',
      customerName: 'Emily Wilson',
      customerEmail: 'emily.w@email.com',
      customerPhone: '+1 (555) 321-0987',
      court: 'Badminton Court A',
      date: '2025-08-14',
      time: '9:00 AM - 11:00 AM',
      duration: '2 hours',
      amount: 50,
      status: 'CONFIRMED',
      bookingDate: '2025-08-11'
    },
    {
      id: 'BK005',
      customerName: 'David Brown',
      customerEmail: 'david.brown@email.com',
      customerPhone: '+1 (555) 654-3210',
      court: 'Tennis Court A',
      date: '2025-08-15',
      time: '4:00 PM - 6:00 PM',
      duration: '2 hours',
      amount: 80,
      status: 'PENDING',
      bookingDate: '2025-08-11'
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
      PENDING: { color: 'bg-warning/10 text-warning', icon: 'Clock' },
      CANCELLED: { color: 'bg-error/10 text-error', icon: 'XCircle' },
      COMPLETED: { color: 'bg-secondary/10 text-secondary', icon: 'Check' }
    };

    const config = statusConfig?.[status] || statusConfig?.PENDING;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{status}</span>
      </span>
    );
  };

  const handleConfirmBooking = (bookingId) => {
    setBookings(prev => prev?.map(booking => 
      booking?.id === bookingId 
        ? { ...booking, status: 'CONFIRMED' }
        : booking
    ));
  };

  const handleCancelBooking = (bookingId) => {
    setBookings(prev => prev?.map(booking => 
      booking?.id === bookingId 
        ? { ...booking, status: 'CANCELLED' }
        : booking
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Booking ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Court & Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Time & Duration
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings?.map((booking) => (
              <tr key={booking?.id} className="hover:bg-muted/50 transition-smooth">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-foreground">{booking?.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{booking?.customerName}</div>
                    <div className="text-sm text-text-secondary">{booking?.customerEmail}</div>
                    <div className="text-xs text-text-secondary">{booking?.customerPhone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{booking?.court}</div>
                    <div className="text-sm text-text-secondary">{formatDate(booking?.date)}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{booking?.time}</div>
                    <div className="text-sm text-text-secondary">{booking?.duration}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-foreground">${booking?.amount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {booking?.status === 'PENDING' && (
                      <>
                        <Button
                          variant="success"
                          size="xs"
                          onClick={() => handleConfirmBooking(booking?.id)}
                          iconName="Check"
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => handleCancelBooking(booking?.id)}
                          iconName="X"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="xs" iconName="Eye">
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {bookings?.map((booking) => (
          <div key={booking?.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{booking?.id}</span>
              {getStatusBadge(booking?.status)}
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-foreground">{booking?.customerName}</div>
                <div className="text-xs text-text-secondary">{booking?.customerEmail}</div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span>{booking?.court}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{formatDate(booking?.date)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  {booking?.time} • {booking?.duration}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  ${booking?.amount}
                </div>
              </div>
            </div>

            {booking?.status === 'PENDING' && (
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="success"
                  size="sm"
                  fullWidth
                  onClick={() => handleConfirmBooking(booking?.id)}
                  iconName="Check"
                  iconPosition="left"
                >
                  Confirm
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  fullWidth
                  onClick={() => handleCancelBooking(booking?.id)}
                  iconName="X"
                  iconPosition="left"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="outline" fullWidth iconName="MoreHorizontal" iconPosition="left">
          View All Bookings
        </Button>
      </div>
    </div>
  );
};

export default RecentBookingsTable;