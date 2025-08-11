import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const courts = [
    { id: 1, name: 'Tennis Court A', type: 'Tennis' },
    { id: 2, name: 'Tennis Court B', type: 'Tennis' },
    { id: 3, name: 'Basketball Court', type: 'Basketball' },
    { id: 4, name: 'Badminton Court A', type: 'Badminton' }
  ];

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
  ];

  // Mock booking data
  const bookings = {
    1: { // Tennis Court A
      '8:00 AM': { status: 'booked', customer: 'John Smith' },
      '10:00 AM': { status: 'booked', customer: 'Sarah Johnson' },
      '2:00 PM': { status: 'blocked' },
      '6:00 PM': { status: 'booked', customer: 'Mike Davis' }
    },
    2: { // Tennis Court B
      '9:00 AM': { status: 'booked', customer: 'Emily Wilson' },
      '3:00 PM': { status: 'booked', customer: 'David Brown' },
      '7:00 PM': { status: 'blocked' }
    },
    3: { // Basketball Court
      '11:00 AM': { status: 'booked', customer: 'Alex Johnson' },
      '4:00 PM': { status: 'booked', customer: 'Lisa Chen' }
    },
    4: { // Badminton Court A
      '7:00 AM': { status: 'booked', customer: 'Tom Wilson' },
      '1:00 PM': { status: 'blocked' },
      '5:00 PM': { status: 'booked', customer: 'Anna Davis' }
    }
  };

  const getSlotStatus = (courtId, timeSlot) => {
    return bookings?.[courtId]?.[timeSlot] || { status: 'available' };
  };

  const getSlotColor = (status) => {
    const colors = {
      available: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
      booked: 'bg-primary/20 text-primary border-primary/30',
      blocked: 'bg-error/20 text-error border-error/30'
    };
    return colors?.[status] || colors?.available;
  };

  const getSlotIcon = (status) => {
    const icons = {
      available: 'Plus',
      booked: 'User',
      blocked: 'X'
    };
    return icons?.[status] || 'Plus';
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate?.setDate(newDate?.getDate() + direction);
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Court Availability</h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
              iconName="ChevronLeft"
            />
            <div className="px-4 py-2 bg-muted rounded-lg">
              <span className="text-sm font-medium text-foreground">
                {formatDate(selectedDate)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
              iconName="ChevronRight"
            />
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success/20 border border-success/30 rounded"></div>
            <span className="text-sm text-text-secondary">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary/20 border border-primary/30 rounded"></div>
            <span className="text-sm text-text-secondary">Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error/20 border border-error/30 rounded"></div>
            <span className="text-sm text-text-secondary">Blocked</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-[200px_repeat(17,1fr)] gap-1 mb-2">
              <div className="p-2 font-medium text-text-secondary">Court / Time</div>
              {timeSlots?.map((time) => (
                <div key={time} className="p-2 text-xs font-medium text-text-secondary text-center">
                  {time}
                </div>
              ))}
            </div>

            {/* Court Rows */}
            {courts?.map((court) => (
              <div key={court?.id} className="grid grid-cols-[200px_repeat(17,1fr)] gap-1 mb-1">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-foreground text-sm">{court?.name}</div>
                  <div className="text-xs text-text-secondary">{court?.type}</div>
                </div>
                
                {timeSlots?.map((timeSlot) => {
                  const slotData = getSlotStatus(court?.id, timeSlot);
                  return (
                    <div
                      key={`${court?.id}-${timeSlot}`}
                      className={`p-2 rounded border-2 cursor-pointer transition-smooth ${getSlotColor(slotData?.status)}`}
                      title={slotData?.customer ? `Booked by ${slotData?.customer}` : `${slotData?.status} slot`}
                    >
                      <div className="flex items-center justify-center h-8">
                        <Icon name={getSlotIcon(slotData?.status)} size={14} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-success/10 rounded-lg text-center">
            <div className="text-lg font-semibold text-success">42</div>
            <div className="text-sm text-text-secondary">Available Slots</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <div className="text-lg font-semibold text-primary">18</div>
            <div className="text-sm text-text-secondary">Booked Slots</div>
          </div>
          <div className="p-4 bg-error/10 rounded-lg text-center">
            <div className="text-lg font-semibold text-error">8</div>
            <div className="text-sm text-text-secondary">Blocked Slots</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;