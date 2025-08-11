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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-pronounced max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Write a Review</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Venue Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={booking?.venue?.image}
                alt={booking?.venue?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{booking?.venue?.name}</h3>
              <p className="text-sm text-text-secondary">{booking?.venue?.location}</p>
              <p className="text-sm text-text-secondary">
                {new Date(booking.date)?.toLocaleDateString()} • {booking?.court}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Rate your experience
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5]?.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-smooth"
                >
                  <Icon
                    name="Star"
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-warning fill-current' :'text-muted-foreground'
                    } transition-smooth`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-text-secondary">{getRatingText(hoverRating || rating)}</p>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Share your experience (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e?.target?.value)}
              placeholder="Tell others about your experience at this venue..."
              className="w-full h-32 px-3 py-2 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-text-secondary mt-1">{review?.length}/500 characters</p>
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Add photos (optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
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
                className={`cursor-pointer ${photos?.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon name="Camera" size={24} className="text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">
                  {photos?.length >= 5 ? 'Maximum 5 photos' : 'Click to add photos'}
                </p>
              </label>
            </div>

            {/* Photo Preview */}
            {photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {photos?.map((photo) => (
                  <div key={photo?.id} className="relative">
                    <img
                      src={photo?.url}
                      alt="Review photo"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo?.id)}
                      className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3">
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