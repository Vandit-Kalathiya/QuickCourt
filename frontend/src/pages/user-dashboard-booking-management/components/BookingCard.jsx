import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onCancel, onViewDetails, onRebook, onReview, type = 'upcoming' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const canCancel = () => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
    return hoursDiff > 24 && booking?.status === 'CONFIRMED';
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-subtle hover:shadow-medium transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start space-x-5">
          {/* Venue Image - Enhanced */}
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-border/50">
            <Image
              src={booking?.userId}
              alt={booking?.userId}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Booking Details - Enhanced */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate mb-1">
                  {booking?.courtName}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <Icon name="MapPin" size={14} />
                  <span className="truncate">{booking?.facilityAddress}</span>
                </div>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                  booking?.status
                )} whitespace-nowrap ml-3`}
              >
                {booking?.status}
              </span>
            </div>

            {/* Info Grid - Enhanced */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Calendar" size={14} className="text-primary" />
                </div>
                <span className="text-sm text-foreground font-medium">
                  {formatDate(booking?.date)}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={14} className="text-accent" />
                </div>
                <span className="text-sm text-foreground">
                  {formatTime(booking?.startTime)} -{" "}
                  {formatTime(booking?.endTime)}
                </span>
              </div>
              {/* <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={14} className="text-warning" />
                </div>
                <span className="text-sm text-foreground">
                  {booking?.court}
                </span>
              </div> */}
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {/* <Icon name="DollarSign" size={14} className="text-success" /> */}
                </div>
                <span className="text-lg font-semibold text-foreground">
                  ₹ {booking?.totalPrice}
                </span>
              </div>
            </div>

            {/* Expanded Details - Enhanced */}
            {isExpanded && (
              <div className="border-t border-border pt-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                <div className="bg-gradient-to-r from-muted/30 to-transparent p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-center">
                      <span className="font-medium text-foreground">
                        Booking ID:
                      </span>
                      <span className="text-text-secondary font-mono">
                        {booking?.id}
                      </span>
                    </div>
                    <div className="flex justify-around">
                      <span className="font-medium text-foreground">
                        Sport:
                      </span>
                      <span className="text-text-secondary">
                        {booking?.sportType}
                      </span>
                    </div>
                    <div className="flex justify-around">
                      <span className="font-medium text-foreground">
                        Duration:
                      </span>
                      <span className="text-text-secondary">
                        {booking?.duration} hours
                      </span>
                    </div>
                    <div className="flex justify-around">
                      <span className="font-medium text-foreground">
                        Payment:
                      </span>
                      <span className="text-text-secondary">
                        {booking?.status}
                      </span>
                    </div>
                  </div>
                  {booking?.notes && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <span className="font-medium text-foreground text-sm">
                        Notes:
                      </span>
                      <p className="text-text-secondary mt-1 text-sm leading-relaxed">
                        {booking?.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons - Enhanced */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                className="text-text-secondary hover:text-foreground hover:bg-muted/50"
              >
                {isExpanded ? "Less Details" : "More Details"}
              </Button>

              <div className="flex items-center space-x-2">
                {type === "upcoming" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(booking)}
                      iconName="Eye"
                      className="hover:bg-primary hover:text-white transition-colors"
                    >
                      View
                    </Button>
                    {canCancel() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel(booking)}
                        iconName="X"
                        className="hover:bg-error hover:text-white hover:border-error transition-colors"
                      >
                        Cancel
                      </Button>
                    )}
                  </>
                )}

                {type === "history" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRebook(booking)}
                      iconName="RotateCcw"
                      className="hover:bg-accent hover:text-white transition-colors"
                    >
                      Rebook
                    </Button>
                    {booking?.status === "COMPLETED" && !booking?.hasReview && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onReview(booking)}
                        iconName="Star"
                        className="bg-warning hover:bg-warning/90 text-white border-warning"
                      >
                        Review
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
