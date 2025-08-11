import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AvailabilityTab = ({ courts, availability, onAvailabilityUpdate }) => {
  const [selectedCourt, setSelectedCourt] = useState(courts?.[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = 6 + i;
    return `${hour?.toString()?.padStart(2, '0')}:00`;
  });

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day;
    startOfWeek?.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date?.setDate(startOfWeek?.getDate() + i);
      return date;
    });
  };

  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: `${court?.name} (${court?.sportType})`
  }));

  const viewModeOptions = [
    { value: 'week', label: 'Week View' },
    { value: 'month', label: 'Month View' }
  ];

  const bulkActionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'block', label: 'Block Selected' },
    { value: 'unblock', label: 'Unblock Selected' },
    { value: 'maintenance', label: 'Mark Maintenance' }
  ];

  const getSlotStatus = (courtId, date, time) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    const slotKey = `${courtId}-${dateStr}-${time}`;
    return availability?.[slotKey] || 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success/20 hover:bg-success/30 border-success/30';
      case 'booked': return 'bg-primary/20 border-primary/30';
      case 'blocked': return 'bg-error/20 border-error/30';
      case 'maintenance': return 'bg-warning/20 border-warning/30';
      default: return 'bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Check';
      case 'booked': return 'Calendar';
      case 'blocked': return 'X';
      case 'maintenance': return 'Wrench';
      default: return 'Clock';
    }
  };

  const handleSlotClick = (courtId, date, time) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    const slotKey = `${courtId}-${dateStr}-${time}`;
    
    setSelectedSlots(prev => {
      if (prev?.includes(slotKey)) {
        return prev?.filter(slot => slot !== slotKey);
      } else {
        return [...prev, slotKey];
      }
    });
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedSlots?.length === 0) return;

    const updates = {};
    selectedSlots?.forEach(slotKey => {
      updates[slotKey] = bulkAction === 'unblock' ? 'available' : bulkAction;
    });

    onAvailabilityUpdate(updates);
    setSelectedSlots([]);
    setBulkAction('');
  };

  const weekDates = getWeekDates(new Date(selectedDate));
  const selectedCourtData = courts?.find(court => court?.id === selectedCourt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Availability Management</h2>
          <p className="text-text-secondary mt-1">Manage court availability and time slots</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={setViewMode}
            className="w-32"
          />
          <Button variant="outline" iconName="Download">
            Export
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Select Court"
            options={courtOptions}
            value={selectedCourt}
            onChange={setSelectedCourt}
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <Select
            label="Bulk Actions"
            options={bulkActionOptions}
            value={bulkAction}
            onChange={setBulkAction}
          />
        </div>

        {selectedSlots?.length > 0 && (
          <div className="flex items-center justify-between bg-muted rounded-lg p-4">
            <span className="text-sm text-foreground">
              {selectedSlots?.length} slot{selectedSlots?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSlots([])}
              >
                Clear Selection
              </Button>
              <Button
                size="sm"
                onClick={handleBulkAction}
                disabled={!bulkAction}
              >
                Apply Action
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-medium text-foreground mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { status: 'available', label: 'Available', color: 'bg-success/20 border-success/30' },
            { status: 'booked', label: 'Booked', color: 'bg-primary/20 border-primary/30' },
            { status: 'blocked', label: 'Blocked', color: 'bg-error/20 border-error/30' },
            { status: 'maintenance', label: 'Maintenance', color: 'bg-warning/20 border-warning/30' }
          ]?.map(({ status, label, color }) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border ${color}`} />
              <span className="text-sm text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Calendar Grid */}
      {selectedCourtData && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {selectedCourtData?.name} - {selectedCourtData?.sportType}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Operating Hours: {selectedCourtData?.operatingHours?.start} - {selectedCourtData?.operatingHours?.end}
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b border-border">
                <div className="p-3 bg-muted font-medium text-sm text-foreground">Time</div>
                {weekDates?.map((date, index) => (
                  <div key={index} className="p-3 bg-muted text-center">
                    <div className="font-medium text-sm text-foreground">
                      {date?.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots?.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-border">
                  <div className="p-3 bg-muted/50 font-medium text-sm text-foreground border-r border-border">
                    {time}
                  </div>
                  {weekDates?.map((date, dateIndex) => {
                    const status = getSlotStatus(selectedCourt, date, time);
                    const slotKey = `${selectedCourt}-${date?.toISOString()?.split('T')?.[0]}-${time}`;
                    const isSelected = selectedSlots?.includes(slotKey);
                    
                    return (
                      <div
                        key={dateIndex}
                        className={`p-2 border-r border-border cursor-pointer transition-colors ${
                          getStatusColor(status)
                        } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleSlotClick(selectedCourt, date, time)}
                      >
                        <div className="flex items-center justify-center h-8">
                          <Icon 
                            name={getStatusIcon(status)} 
                            size={16} 
                            className={`${
                              status === 'available' ? 'text-success' :
                              status === 'booked' ? 'text-primary' :
                              status === 'blocked' ? 'text-error' :
                              status === 'maintenance'? 'text-warning' : 'text-text-secondary'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" iconName="Calendar" fullWidth>
            Block Weekend
          </Button>
          <Button variant="outline" iconName="Clock" fullWidth>
            Set Peak Hours
          </Button>
          <Button variant="outline" iconName="Wrench" fullWidth>
            Schedule Maintenance
          </Button>
          <Button variant="outline" iconName="Copy" fullWidth>
            Copy Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityTab;