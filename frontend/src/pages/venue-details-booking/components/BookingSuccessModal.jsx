import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingSuccessModal = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen || !bookingData) return null;

  const handleAddToCalendar = () => {
    const startDate = new Date(`${bookingData.date}T${bookingData.timeSlots[0].time}`);
    const endDate = new Date(startDate.getTime() + (bookingData.timeSlots.length * 60 * 60 * 1000));
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${bookingData?.sport} at ${bookingData?.venue}`)}&dates=${startDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z/${endDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0]}Z&details=${encodeURIComponent(`Booking confirmed for ${bookingData?.sport} at ${bookingData?.venue}`)}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleViewBookings = () => {
    window.location.href = '/user-dashboard-booking-management';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 animate-fade-in">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-text-secondary">Your booking has been successfully confirmed</p>
        </div>

        {/* Booking Details */}
        <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">Booking ID:</span>
            <span className="font-mono font-medium text-foreground">{bookingData?.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Venue:</span>
            <span className="font-medium text-foreground">{bookingData?.venue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Date:</span>
            <span className="font-medium text-foreground">
              {new Date(bookingData.date)?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Sport:</span>
            <span className="font-medium text-foreground">{bookingData?.sport}</span>
          </div>
          <div>
            <span className="text-text-secondary">Time Slots:</span>
            <div className="mt-1">
              {bookingData?.timeSlots?.map((slot, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{slot?.time}</span>
                  <span>${slot?.price}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Paid:</span>
              <span className="text-success">${bookingData?.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCalendar}
            variant="outline"
            fullWidth
            iconName="Calendar"
            iconPosition="left"
          >
            Add to Calendar
          </Button>
          
          <Button
            onClick={handleViewBookings}
            fullWidth
            iconName="Eye"
            iconPosition="left"
          >
            View My Bookings
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            fullWidth
          >
            Continue Browsing
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-accent mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground font-medium mb-1">Important Information:</p>
              <ul className="text-text-secondary space-y-1">
                <li>• Confirmation email sent to your registered email</li>
                <li>• SMS confirmation sent to your phone number</li>
                <li>• Free cancellation up to 24 hours before booking</li>
                <li>• Please arrive 15 minutes before your slot</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;