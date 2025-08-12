import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useOwner } from '../../../context/OwnerContext';
import toast from 'react-hot-toast';

const AvailabilityTab = ({ courts, availability, onAvailabilityUpdate }) => {
  const [selectedCourt, setSelectedCourt] = useState(courts?.[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [slotAvailability, setSlotAvailability] = useState({});

  const { getAllSlots, blockTimeSlot, unblockTimeSlot } = useOwner();

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = 6 + i;
    return `${hour?.toString()?.padStart(2, '0')}:00`;
  });

  // Fetch availability data when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchAvailabilityData();
    }
  }, [selectedCourt, selectedDate]);

  // Update selected court when courts change
  useEffect(() => {
    if (courts?.length > 0 && !selectedCourt) {
      setSelectedCourt(courts[0].id);
    }
  }, [courts]);



  const fetchAvailabilityData = async () => {
    if (!selectedCourt || !selectedDate) return;

    setLoading(true);
    try {
      const slotsData = await getAllSlots(selectedCourt, selectedDate);
      
      const available = slotsData.available || [];
      const blocked = slotsData.blocked || [];

      setAvailableSlots(available);
      setBlockedSlots(blocked);

      // Build slot availability map
      const availability = {};
      
      // Mark available slots
      available.forEach(slot => {
        // Normalize time format (remove seconds if present)
        const normalizedTime = slot.startTime.substring(0, 5); // Get HH:mm from HH:mm:ss
        const slotKey = `${selectedCourt}-${selectedDate}-${normalizedTime}`;
        availability[slotKey] = 'available';
      });

      // Mark blocked slots (override available)
      blocked.forEach(slot => {
        // Normalize time format (remove seconds if present)
        const normalizedTime = slot.startTime.substring(0, 5); // Get HH:mm from HH:mm:ss
        const slotKey = `${selectedCourt}-${selectedDate}-${normalizedTime}`;
        availability[slotKey] = 'blocked';
      });

      setSlotAvailability(availability);
    } catch (error) {
      console.error('Error fetching availability data:', error);
      toast.error('Failed to fetch availability data');
    } finally {
      setLoading(false);
    }
  };

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
    
    // Check real availability data first
    if (slotAvailability[slotKey]) {
      return slotAvailability[slotKey];
    }
    
    // Fallback to mock data if provided
    return availability?.[slotKey] || 'unavailable';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success/20 hover:bg-success/30 border-success/30';
      case 'booked': return 'bg-primary/20 border-primary/30';
      case 'blocked': return 'bg-error/20 border-error/30';
      case 'maintenance': return 'bg-warning/20 border-warning/30';
      case 'unavailable': return 'bg-gray-100 border-gray-300';
      default: return 'bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Check';
      case 'booked': return 'Calendar';
      case 'blocked': return 'X';
      case 'maintenance': return 'Wrench';
      case 'unavailable': return 'Minus';
      default: return 'Clock';
    }
  };

  const handleSlotClick = async (courtId, date, time, event) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    const slotKey = `${courtId}-${dateStr}-${time}`;
    
    // If Ctrl/Cmd key is pressed, add to selection for bulk actions
    if (event.ctrlKey || event.metaKey) {
      setSelectedSlots(prev => {
        if (prev?.includes(slotKey)) {
          return prev?.filter(slot => slot !== slotKey);
        } else {
          return [...prev, slotKey];
        }
      });
      return;
    }

    // Single click - toggle block/unblock
    const currentStatus = getSlotStatus(courtId, date, time);
    
    if (currentStatus === 'booked') {
      toast.error('Cannot modify booked slots');
      return;
    }

    // Check if we have a valid court ID
    if (!courtId) {
      toast.error('No court selected');
      return;
    }

    const startTime = time;
    const endTime = `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
    
    // Confirmation dialog
    const action = currentStatus === 'blocked' ? 'unblock' : 'block';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} the slot from ${startTime} to ${endTime} on ${dateStr}?`
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      if (currentStatus === 'blocked') {
        await unblockTimeSlot(courtId, dateStr, startTime, endTime);
        toast.success('Slot unblocked successfully');
      } else {
        await blockTimeSlot(courtId, dateStr, startTime, endTime);
        toast.success('Slot blocked successfully');
      }

      // Refresh availability data
      await fetchAvailabilityData();
    } catch (error) {
      console.error('Error toggling slot:', error);
      toast.error(error.message || 'Failed to toggle slot status');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedSlots?.length === 0) return;

    // Confirmation dialog
    const actionText = bulkAction === 'unblock' ? 'unblock' : 'block';
    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${selectedSlots.length} slot${selectedSlots.length > 1 ? 's' : ''}?`
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      const promises = [];

      for (const slotKey of selectedSlots) {
        const [courtId, date, time] = slotKey.split('-');
        const startTime = time;
        const endTime = `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;

        if (bulkAction === 'unblock') {
          promises.push(unblockTimeSlot(courtId, date, startTime, endTime));
        } else if (bulkAction === 'block') {
          promises.push(blockTimeSlot(courtId, date, startTime, endTime));
        }
      }

      await Promise.all(promises);
      
      // Refresh availability data
      await fetchAvailabilityData();
      
      setSelectedSlots([]);
      setBulkAction('');
      
      toast.success(`Successfully ${actionText}ed ${selectedSlots.length} slot${selectedSlots.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error applying bulk action:', error);
      toast.error(`Failed to ${actionText} slots`);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockWeekend = async () => {
    if (!selectedCourt || !selectedDate) return;

    const weekDates = getWeekDates(new Date(selectedDate));
    const weekendDates = weekDates.filter(date => {
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });

    if (weekendDates.length === 0) {
      toast.error('No weekend dates in the current week view');
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to block all weekend dates (${weekendDates.length} day${weekendDates.length > 1 ? 's' : ''}) for the entire day?`
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      const promises = [];
      
      for (const date of weekendDates) {
        const dateStr = date.toISOString().split('T')[0];
        // Block the entire day (assuming 6 AM to 10 PM)
        promises.push(blockTimeSlot(selectedCourt, dateStr, '06:00', '22:00'));
      }

      await Promise.all(promises);
      await fetchAvailabilityData();
      
      toast.success(`Successfully blocked ${weekendDates.length} weekend day${weekendDates.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error blocking weekend:', error);
      toast.error('Failed to block weekend dates');
    } finally {
      setLoading(false);
    }
  };

  const weekDates = getWeekDates(new Date(selectedDate));
  const selectedCourtData = courts?.find(court => court?.id === selectedCourt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Availability Management</h2>
          <p className="text-text-secondary mt-1">
            Manage court availability and time slots. Click to toggle block/unblock, Ctrl+Click to select multiple.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={setViewMode}
            className="w-32"
          />
          <Button 
            variant="outline" 
            iconName="RefreshCw" 
            onClick={fetchAvailabilityData}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button 
            variant="outline" 
            iconName="Play" 
            onClick={async () => {
              if (!selectedCourt) {
                toast.error('No court selected');
                return;
              }
              
              const confirmed = window.confirm('Test block slot 10:00-11:00?');
              if (!confirmed) return;
              
              try {
                await blockTimeSlot(selectedCourt, selectedDate, '10:00', '11:00');
                toast.success('Test block successful');
                await fetchAvailabilityData();
              } catch (error) {
                console.error('Test failed:', error);
                toast.error('Test failed: ' + error.message);
              }
            }}
            disabled={loading || !selectedCourt}
          >
            Test Block
          </Button>
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
      {/* Statistics and Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistics */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-medium text-foreground mb-3">Today's Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{availableSlots.length}</div>
              <div className="text-sm text-success">Available</div>
            </div>
            <div className="text-center p-3 bg-error/10 rounded-lg">
              <div className="text-2xl font-bold text-error">{blockedSlots.length}</div>
              <div className="text-sm text-error">Blocked</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-medium text-foreground mb-3">Status Legend</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { status: 'available', label: 'Available', color: 'bg-success/20 border-success/30' },
              { status: 'booked', label: 'Booked', color: 'bg-primary/20 border-primary/30' },
              { status: 'blocked', label: 'Blocked', color: 'bg-error/20 border-error/30' },
              { status: 'unavailable', label: 'Unavailable', color: 'bg-gray-100 border-gray-300' },
              { status: 'maintenance', label: 'Maintenance', color: 'bg-warning/20 border-warning/30' }
            ]?.map(({ status, label, color }) => (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded border ${color}`} />
                <span className="text-sm text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Calendar Grid */}
      {loading && (
        <div className="bg-card rounded-lg border border-border p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
            <span className="text-foreground">Loading availability data...</span>
          </div>
        </div>
      )}
      
      {!loading && selectedCourtData && (
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
                        } ${isSelected ? 'ring-2 ring-primary' : ''} ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => !loading && handleSlotClick(selectedCourt, date, time, e)}
                        title={`${status.charAt(0).toUpperCase() + status.slice(1)} - Click to toggle, Ctrl+Click to select`}
                      >
                        <div className="flex items-center justify-center h-8">
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          ) : (
                            <Icon 
                              name={getStatusIcon(status)} 
                              size={16} 
                              className={`${
                                status === 'available' ? 'text-success' :
                                status === 'booked' ? 'text-primary' :
                                status === 'blocked' ? 'text-error' :
                                status === 'unavailable' ? 'text-gray-400' :
                                status === 'maintenance'? 'text-warning' : 'text-text-secondary'
                              }`}
                            />
                          )}
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
          <Button 
            variant="outline" 
            iconName="Calendar" 
            fullWidth
            onClick={handleBlockWeekend}
            disabled={loading || !selectedCourt}
          >
            Block Weekend
          </Button>
          <Button 
            variant="outline" 
            iconName="Clock" 
            fullWidth
            disabled={loading || !selectedCourt}
          >
            Set Peak Hours
          </Button>
          <Button 
            variant="outline" 
            iconName="Wrench" 
            fullWidth
            disabled={loading || !selectedCourt}
          >
            Schedule Maintenance
          </Button>
          <Button 
            variant="outline" 
            iconName="Copy" 
            fullWidth
            disabled={loading || !selectedCourt}
          >
            Copy Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityTab;