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
    <div className="fixed mt-[4.5rem] inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border/50 animate-in zoom-in-95 duration-200">
        {/* Header - Enhanced */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-muted/20 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={16} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Booking Details
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            className="hover:bg-muted/50 rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Venue Info - Enhanced */}
          <div className="flex items-start space-x-5 p-5 bg-gradient-to-r from-muted/20 to-transparent rounded-xl border border-border/50">
            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-background">
              <Image
                src={booking?.image}
                alt={booking?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {booking?.courtName}
                  </h3>
                  <div className="flex items-center space-x-2 text-text-secondary mb-2">
                    <Icon name="MapPin" size={14} />
                    <span>{booking?.facilityAddress}</span>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    booking?.status
                  )} whitespace-nowrap`}
                >
                  {booking?.status}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-text-secondary">
                {/* <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-warning/10 rounded flex items-center justify-center">
                    <Icon name="Star" size={12} className="text-warning" />
                  </div>
                  <span className="font-medium">{booking?.rating}</span>
                </div> */}
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                    <Icon name="Phone" size={12} className="text-primary" />
                  </div>
                  <span>{booking?.facilityPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/5 to-transparent p-5 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={14} className="text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">
                  Booking Information
                </h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Booking ID:</span>
                  <span className="text-foreground font-mono font-medium bg-muted px-2 py-1 rounded text-xs">
                    {booking?.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Date:</span>
                  <span className="text-foreground font-medium">
                    {formatDate(booking?.date)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Time:</span>
                  <span className="text-foreground font-medium">
                    {formatTime(booking?.startTime)} -{" "}
                    {formatTime(booking?.endTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="text-foreground font-medium">
                    {booking?.duration} hours
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Court:</span>
                  <span className="text-foreground font-medium">
                    {booking?.courtName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Sport:</span>
                  <span className="text-foreground font-medium">
                    {booking?.sportType}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-success/5 to-transparent p-5 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-7 h-7 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={14} className="text-success" />
                </div>
                <h4 className="font-semibold text-foreground">
                  Payment Details
                </h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Hourly Rate:</span>
                  <span className="text-foreground font-medium">
                    ₹ {booking?.hourlyRate}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="text-foreground font-medium">
                    {booking?.duration} hours
                  </span>
                </div>
                {/* <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="text-foreground font-medium">
                    ${booking?.subtotal}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Tax:</span>
                  <span className="text-foreground font-medium">
                    ${booking?.tax}
                  </span>
                </div> */}
                <div className="border-t border-border/50 pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold text-base">
                    <span className="text-foreground">Total Amount:</span>
                    <span className="text-success">
                      ₹ {booking?.totalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Payment Status:</span>
                  <span className="text-success font-medium bg-success/10 px-2 py-1 rounded text-xs">
                    {booking?.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-secondary">Payment Method:</span>
                  <span className="text-foreground font-medium">Razoepay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes - Enhanced */}
          {booking?.notes && (
            <div className="bg-gradient-to-r from-accent/5 to-transparent p-5 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon
                    name="MessageSquare"
                    size={12}
                    className="text-accent"
                  />
                </div>
                <h4 className="font-semibold text-foreground">Notes</h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {booking?.notes}
              </p>
            </div>
          )}

          {/* Cancellation Policy - Enhanced */}
          <div className="bg-gradient-to-r from-warning/5 to-transparent p-5 rounded-xl border border-border/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertCircle" size={12} className="text-warning" />
              </div>
              <h4 className="font-semibold text-foreground">
                Cancellation Policy
              </h4>
            </div>
            <div className="text-sm text-text-secondary space-y-1 leading-relaxed">
              <p className="flex items-start space-x-2">
                <span className="text-success mt-1">•</span>
                <span>
                  Free cancellation up to 24 hours before the booking time
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-warning mt-1">•</span>
                <span>50% refund for cancellations between 12-24 hours</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-error mt-1">•</span>
                <span>No refund for cancellations within 12 hours</span>
              </p>
            </div>
          </div>

          {/* Venue Contact - Enhanced */}
          <div className="bg-gradient-to-r from-muted/20 to-transparent p-5 rounded-xl border border-border/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Phone" size={12} className="text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Venue Contact</h4>
            </div>
            <div className="text-sm text-text-secondary space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                  <Icon name="Phone" size={12} className="text-primary" />
                </div>
                <span>{booking?.facilityPhone}</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center">
                  <Icon name="User" size={12} className="text-accent" />
                </div>
                <span>{booking?.facilityName}</span>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="w-6 h-6 bg-warning/10 rounded flex items-center justify-center">
                  <Icon name="MapPin" size={12} className="text-warning" />
                </div>
                <span>{booking?.facilityAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - Enhanced */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-gradient-to-r from-muted/10 to-transparent">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => onAddToCalendar(booking)}
              iconName="Calendar"
              className="hover:bg-primary hover:text-white transition-colors"
            >
              Add to Calendar
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            {canCancel() && (
              <Button
                variant="outline"
                onClick={() => onCancel(booking)}
                iconName="X"
                className="hover:bg-error hover:text-white hover:border-error transition-colors"
              >
                Cancel Booking
              </Button>
            )}
            <Button
              variant="default"
              onClick={onClose}
              className="bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
