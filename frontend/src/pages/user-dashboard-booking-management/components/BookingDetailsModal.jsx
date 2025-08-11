import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingDetailsModal = ({ booking, isOpen, onClose, onCancel, onAddToCalendar }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-success/10 text-success border-success/20';
      case 'CANCELLED':
        return 'bg-error/10 text-error border-error/20';
      case 'COMPLETED':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-text-secondary border-border';
    }
  };

  const canCancel = () => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
    return hoursDiff > 24 && booking?.status === 'CONFIRMED';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-pronounced max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Booking Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Venue Info */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={booking?.venue?.image}
                alt={booking?.venue?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{booking?.venue?.name}</h3>
                  <p className="text-text-secondary">{booking?.venue?.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking?.status)}`}>
                  {booking?.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning" />
                  <span>{booking?.venue?.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Phone" size={14} />
                  <span>{booking?.venue?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Booking ID:</span>
                    <span className="text-foreground font-medium">{booking?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Date:</span>
                    <span className="text-foreground">{formatDate(booking?.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Time:</span>
                    <span className="text-foreground">
                      {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Duration:</span>
                    <span className="text-foreground">{booking?.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Court:</span>
                    <span className="text-foreground">{booking?.court}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Sport:</span>
                    <span className="text-foreground">{booking?.sport}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Hourly Rate:</span>
                    <span className="text-foreground">${booking?.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Duration:</span>
                    <span className="text-foreground">{booking?.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal:</span>
                    <span className="text-foreground">${booking?.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tax:</span>
                    <span className="text-foreground">${booking?.tax}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-foreground">Total Amount:</span>
                      <span className="text-foreground">${booking?.totalAmount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Payment Status:</span>
                    <span className="text-success">{booking?.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Payment Method:</span>
                    <span className="text-foreground">{booking?.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking?.notes && (
            <div className="mb-6">
              <h4 className="font-medium text-foreground mb-2">Notes</h4>
              <p className="text-sm text-text-secondary bg-muted p-3 rounded-lg">{booking?.notes}</p>
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-2">Cancellation Policy</h4>
            <div className="text-sm text-text-secondary bg-muted p-3 rounded-lg">
              <p>• Free cancellation up to 24 hours before the booking time</p>
              <p>• 50% refund for cancellations between 12-24 hours</p>
              <p>• No refund for cancellations within 12 hours</p>
            </div>
          </div>

          {/* Venue Contact */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-2">Venue Contact</h4>
            <div className="text-sm text-text-secondary space-y-1">
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} />
                <span>{booking?.venue?.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} />
                <span>{booking?.venue?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span>{booking?.venue?.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onAddToCalendar(booking)}
              iconName="Calendar"
            >
              Add to Calendar
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {canCancel() && (
              <Button
                variant="destructive"
                onClick={() => onCancel(booking)}
                iconName="X"
              >
                Cancel Booking
              </Button>
            )}
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;