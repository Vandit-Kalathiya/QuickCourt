import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReviewModal = ({ booking, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoverRating(starRating);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newPhotos = files?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos]?.slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev?.filter(photo => photo?.id !== photoId));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        bookingId: booking?.id,
        rating,
        review,
        photos: photos?.map(p => p?.file)
      });
      onClose();
      // Reset form
      setRating(0);
      setReview('');
      setPhotos([]);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 1: return 'text-error';
      case 2: return 'text-warning';
      case 3: return 'text-accent';
      case 4: return 'text-success';
      case 5: return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border/50 animate-in zoom-in-95 duration-200">
        {/* Header - Enhanced */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-warning/10 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Star" size={16} className="text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Write a Review</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Venue Info - Enhanced */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-muted/20 to-transparent rounded-xl border border-border/50">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-background">
              <Image
                src={booking?.venue?.image}
                alt={booking?.venue?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{booking?.venue?.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
                <Icon name="MapPin" size={12} />
                <span>{booking?.venue?.location}</span>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {new Date(booking.date)?.toLocaleDateString()} • {booking?.court}
              </p>
            </div>
          </div>

          {/* Rating - Enhanced */}
          <div className="bg-gradient-to-br from-warning/5 to-transparent p-5 rounded-xl border border-border/50">
            <label className="block text-sm font-semibold text-foreground mb-4">
              Rate your experience
            </label>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5]?.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 transition-all hover:scale-110 rounded-lg"
                >
                  <Icon
                    name="Star"
                    size={36}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-warning fill-current drop-shadow-sm' 
                        : 'text-muted-foreground hover:text-warning/50'
                    } transition-all duration-200`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className={`text-lg font-semibold ${getRatingColor(hoverRating || rating)} transition-colors`}>
                {getRatingText(hoverRating || rating)}
              </p>
            </div>
          </div>

          {/* Review Text - Enhanced */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Share your experience (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e?.target?.value)}
              placeholder="Tell others about your experience at this venue..."
              className="w-full h-36 px-4 py-3 border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-text-secondary">{review?.length}/500 characters</p>
              <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(review?.length / 500) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Photo Upload - Enhanced */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Add photos (optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-gradient-to-br from-muted/10 to-transparent hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={photos?.length >= 5}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer block ${photos?.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary transition-colors'}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="Camera" size={24} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {photos?.length >= 5 ? 'Maximum 5 photos reached' : 'Click to add photos'}
                </p>
                <p className="text-xs text-text-secondary">
                  JPG, PNG up to 5MB each
                </p>
              </label>
            </div>

            {/* Photo Preview - Enhanced */}
            {photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {photos?.map((photo) => (
                  <div key={photo?.id} className="relative group">
                    <img
                      src={photo?.url}
                      alt="Review photo"
                      className="w-full h-24 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo?.id)}
                      className="absolute -top-2 -right-2 bg-error text-white rounded-full w-7 h-7 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-error/90"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button - Enhanced */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              loading={isSubmitting}
              iconName="Send"
              className="bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
