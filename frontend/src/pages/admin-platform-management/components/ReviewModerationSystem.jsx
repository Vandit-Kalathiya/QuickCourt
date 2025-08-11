import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReviewModerationSystem = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [moderationComment, setModerationComment] = useState('');

  const flaggedReviews = [
    {
      id: 1,
      reviewer: "Alex Thompson",
      reviewerAvatar: "https://randomuser.me/api/portraits/men/24.jpg",
      facility: "Elite Sports Complex",
      rating: 1,
      content: `This place is absolutely terrible! The staff was rude and unprofessional. The courts were dirty and poorly maintained. I would never recommend this facility to anyone. Complete waste of money and time!\n\nThe booking system is also broken and they charged me twice for the same session. Avoid at all costs!`,
      flaggedDate: "2025-01-10",
      flaggedBy: "Facility Owner",
      flagReason: "Inappropriate language and false claims",
      reportCount: 3,
      status: "pending",
      facilityResponse: "We believe this review contains false information about our facility and uses inappropriate language."
    },
    {
      id: 2,
      reviewer: "Maria Garcia",
      reviewerAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
      facility: "Community Recreation Center",
      rating: 5,
      content: `Amazing facility with great amenities! The staff is friendly and helpful. Courts are well-maintained and booking is easy. Highly recommend for anyone looking for quality sports facilities.\n\nPricing is very reasonable and they offer great packages for regular users.`,
      flaggedDate: "2025-01-09",
      flaggedBy: "User",
      flagReason: "Suspected fake review",
      reportCount: 1,
      status: "pending",
      facilityResponse: null
    },
    {
      id: 3,
      reviewer: "John Davis",
      reviewerAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      facility: "Premier Football Academy",
      rating: 2,
      content: `The facility is okay but overpriced for what they offer. Equipment could be better maintained and the changing rooms need renovation. Staff is helpful but the overall experience was disappointing.`,
      flaggedDate: "2025-01-08",
      flaggedBy: "Facility Owner",
      flagReason: "Misleading information about pricing",
      reportCount: 1,
      status: "pending",
      facilityResponse: "Our pricing is competitive and clearly displayed. This review seems to misrepresent our rates."
    }
  ];

  const handleModerateReview = (reviewId, action) => {
    console.log(`${action} review ${reviewId} with comment: ${moderationComment}`);
    setSelectedReview(null);
    setModerationComment('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-accent fill-current' : 'text-muted'}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Review Moderation</h3>
            <p className="text-sm text-text-secondary mt-1">
              {flaggedReviews?.length} reviews flagged for moderation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {flaggedReviews?.map((review) => (
          <div key={review?.id} className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={review?.reviewerAvatar}
                      alt={review?.reviewer}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{review?.reviewer}</h4>
                      <span className="text-sm text-text-secondary">•</span>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(review?.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">{review?.facility}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-text-secondary">
                      <span>Flagged: {review?.flaggedDate}</span>
                      <span>•</span>
                      <span>Reports: {review?.reportCount}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(review?.status)}`}>
                        {review?.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReview(review)}
                    iconName="Eye"
                  >
                    Review
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleModerateReview(review?.id, 'approve')}
                    iconName="Check"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleModerateReview(review?.id, 'reject')}
                    iconName="X"
                  >
                    Reject
                  </Button>
                </div>
              </div>

              {/* Review Content Preview */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-foreground line-clamp-3">
                  {review?.content}
                </p>
              </div>

              {/* Flag Information */}
              <div className="flex items-start space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Flag" size={16} className="text-error" />
                  <span className="text-text-secondary">Flagged by:</span>
                  <span className="font-medium text-foreground">{review?.flaggedBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-text-secondary">Reason:</span>
                  <span className="font-medium text-foreground">{review?.flagReason}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  Review Moderation
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedReview(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Review Details */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={selectedReview?.reviewerAvatar}
                    alt={selectedReview?.reviewer}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-foreground">{selectedReview?.reviewer}</h4>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(selectedReview?.rating)}
                    </div>
                  </div>
                  <p className="text-text-secondary">{selectedReview?.facility}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                    <span>Flagged: {selectedReview?.flaggedDate}</span>
                    <span>•</span>
                    <span>Reports: {selectedReview?.reportCount}</span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h5 className="font-medium text-foreground mb-3">Review Content</h5>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-line">{selectedReview?.content}</p>
                </div>
              </div>

              {/* Flag Information */}
              <div>
                <h5 className="font-medium text-foreground mb-3">Flag Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary">Flagged By</label>
                    <p className="font-medium text-foreground">{selectedReview?.flaggedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary">Flag Reason</label>
                    <p className="font-medium text-foreground">{selectedReview?.flagReason}</p>
                  </div>
                </div>
              </div>

              {/* Facility Response */}
              {selectedReview?.facilityResponse && (
                <div>
                  <h5 className="font-medium text-foreground mb-3">Facility Response</h5>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-foreground">{selectedReview?.facilityResponse}</p>
                  </div>
                </div>
              )}

              {/* Moderation Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Moderation Comment
                </label>
                <textarea
                  value={moderationComment}
                  onChange={(e) => setModerationComment(e?.target?.value)}
                  placeholder="Add your moderation decision reasoning..."
                  className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReview(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleModerateReview(selectedReview?.id, 'reject')}
                  iconName="X"
                >
                  Reject Review
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleModerateReview(selectedReview?.id, 'approve')}
                  iconName="Check"
                >
                  Approve Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewModerationSystem;