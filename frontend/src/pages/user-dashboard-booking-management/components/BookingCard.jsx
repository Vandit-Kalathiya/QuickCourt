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
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-subtle hover:shadow-medium transition-smooth">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Venue Image */}
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={booking?.venue?.image}
              alt={booking?.venue?.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {booking?.venue?.name}
                </h3>
                <p className="text-sm text-text-secondary">{booking?.venue?.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
                {booking?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-text-secondary" />
                <span className="text-sm text-foreground">{formatDate(booking?.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-text-secondary" />
                <span className="text-sm text-foreground">
                  {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-text-secondary" />
                <span className="text-sm text-foreground">{booking?.court}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-text-secondary" />
                <span className="text-sm font-medium text-foreground">${booking?.totalAmount}</span>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-border pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Booking ID:</span>
                    <span className="text-text-secondary ml-2">{booking?.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Sport:</span>
                    <span className="text-text-secondary ml-2">{booking?.sport}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Duration:</span>
                    <span className="text-text-secondary ml-2">{booking?.duration} hours</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Payment:</span>
                    <span className="text-text-secondary ml-2">{booking?.paymentStatus}</span>
                  </div>
                </div>
                {booking?.notes && (
                  <div className="mt-3">
                    <span className="font-medium text-foreground">Notes:</span>
                    <p className="text-text-secondary mt-1">{booking?.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                {isExpanded ? 'Less Details' : 'More Details'}
              </Button>

              <div className="flex items-center space-x-2">
                {type === 'upcoming' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(booking)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    {canCancel() && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onCancel(booking)}
                        iconName="X"
                      >
                        Cancel
                      </Button>
                    )}
                  </>
                )}

                {type === 'history' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRebook(booking)}
                      iconName="RotateCcw"
                    >
                      Rebook
                    </Button>
                    {booking?.status === 'COMPLETED' && !booking?.hasReview && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onReview(booking)}
                        iconName="Star"
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