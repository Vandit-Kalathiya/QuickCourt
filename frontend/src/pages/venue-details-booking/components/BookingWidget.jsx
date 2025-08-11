import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const BookingWidget = ({ venue, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingSummary, setShowBookingSummary] = useState(false);

  // Mock time slots data
  const timeSlots = [
    { id: '06:00', time: '6:00 AM', price: 25, available: true },
    { id: '07:00', time: '7:00 AM', price: 25, available: true },
    { id: '08:00', time: '8:00 AM', price: 30, available: false },
    { id: '09:00', time: '9:00 AM', price: 30, available: true },
    { id: '10:00', time: '10:00 AM', price: 35, available: true },
    { id: '11:00', time: '11:00 AM', price: 35, available: true },
    { id: '12:00', time: '12:00 PM', price: 40, available: true },
    { id: '13:00', time: '1:00 PM', price: 40, available: false },
    { id: '14:00', time: '2:00 PM', price: 40, available: true },
    { id: '15:00', time: '3:00 PM', price: 45, available: true },
    { id: '16:00', time: '4:00 PM', price: 45, available: true },
    { id: '17:00', time: '5:00 PM', price: 50, available: true },
    { id: '18:00', time: '6:00 PM', price: 50, available: true },
    { id: '19:00', time: '7:00 PM', price: 45, available: true },
    { id: '20:00', time: '8:00 PM', price: 40, available: true },
    { id: '21:00', time: '9:00 PM', price: 35, available: true }
  ];

  const sportOptions = venue?.sports?.map(sport => ({
    value: sport?.toLowerCase(),
    label: sport
  }));

  // Get minimum date (today)
  const today = new Date()?.toISOString()?.split('T')?.[0];

  useEffect(() => {
    if (selectedDate && selectedSport) {
      // Simulate API call to get available slots
      setIsLoading(true);
      setTimeout(() => {
        setAvailableSlots(timeSlots);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedDate, selectedSport]);

  useEffect(() => {
    // Calculate total price
    const total = selectedTimeSlots?.reduce((sum, slotId) => {
      const slot = timeSlots?.find(s => s?.id === slotId);
      return sum + (slot ? slot?.price : 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedTimeSlots]);

  const handleTimeSlotToggle = (slotId) => {
    setSelectedTimeSlots(prev => {
      if (prev?.includes(slotId)) {
        return prev?.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  const handleBookingSubmit = () => {
    if (selectedDate && selectedSport && selectedTimeSlots?.length > 0) {
      setShowBookingSummary(true);
    }
  };

  const handlePaymentProcess = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      const bookingData = {
        venue: venue?.name,
        date: selectedDate,
        sport: selectedSport,
        timeSlots: selectedTimeSlots?.map(slotId => {
          const slot = timeSlots?.find(s => s?.id === slotId);
          return { time: slot?.time, price: slot?.price };
        }),
        totalPrice,
        bookingId: `BK${Date.now()}`,
        status: 'CONFIRMED'
      };
      onBookingComplete(bookingData);
      setShowBookingSummary(false);
      // Reset form
      setSelectedDate('');
      setSelectedSport('');
      setSelectedTimeSlots([]);
    }, 2000);
  };

  if (showBookingSummary) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 sticky top-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Booking Summary</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBookingSummary(false)}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-text-secondary">Venue:</span>
            <span className="font-medium text-foreground">{venue?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Date:</span>
            <span className="font-medium text-foreground">{new Date(selectedDate)?.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Sport:</span>
            <span className="font-medium text-foreground">{selectedSport}</span>
          </div>
          <div>
            <span className="text-text-secondary">Time Slots:</span>
            <div className="mt-2 space-y-1">
              {selectedTimeSlots?.map(slotId => {
                const slot = timeSlots?.find(s => s?.id === slotId);
                return (
                  <div key={slotId} className="flex justify-between text-sm">
                    <span>{slot?.time}</span>
                    <span>${slot?.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary">${totalPrice}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handlePaymentProcess}
          loading={isLoading}
          fullWidth
          className="mb-3"
        >
          {isLoading ? 'Processing Payment...' : 'Confirm & Pay'}
        </Button>
        <p className="text-xs text-text-secondary text-center">
          Secure payment powered by Stripe. Your booking will be confirmed instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-2">
      <h3 className="text-xl font-semibold text-foreground mb-6">Book This Venue</h3>
      <div className="space-y-6">
        {/* Date Selection */}
        <Input
          type="date"
          label="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e?.target?.value)}
          min={today}
          required
        />

        {/* Sport Selection */}
        <Select
          label="Choose Sport"
          placeholder="Select a sport"
          options={sportOptions}
          value={selectedSport}
          onChange={setSelectedSport}
          required
        />

        {/* Time Slots */}
        {selectedDate && selectedSport && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Available Time Slots
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {availableSlots?.map((slot) => (
                  <button
                    key={slot?.id}
                    onClick={() => handleTimeSlotToggle(slot?.id)}
                    disabled={!slot?.available}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      !slot?.available
                        ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                        : selectedTimeSlots?.includes(slot?.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div>{slot?.time}</div>
                    <div className="text-xs opacity-80">${slot?.price}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Summary */}
        {selectedTimeSlots?.length > 0 && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Selected Slots:</span>
              <span className="font-medium text-foreground">{selectedTimeSlots?.length}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Price:</span>
              <span className="text-primary">${totalPrice}</span>
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          onClick={handleBookingSubmit}
          disabled={!selectedDate || !selectedSport || selectedTimeSlots?.length === 0}
          fullWidth
          iconName="Calendar"
          iconPosition="left"
        >
          Book Now
        </Button>

        <div className="text-xs text-text-secondary space-y-1">
          <p>• Free cancellation up to 24 hours before booking</p>
          <p>• Instant confirmation via email and SMS</p>
          <p>• Secure payment processing</p>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;