import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReviewsSection = ({ reviews, overallRating, totalReviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const reviewsPerPage = 5;

  const sortedReviews = [...reviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedReviews?.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = sortedReviews?.slice(startIndex, startIndex + reviewsPerPage);

  const ratingDistribution = [5, 4, 3, 2, 1]?.map(rating => {
    const count = reviews?.filter(review => review?.rating === rating)?.length;
    const percentage = reviews?.length > 0 ? (count / reviews?.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-6">Reviews & Ratings</h3>
        
        {/* Overall Rating Summary */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">{overallRating}</div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={20}
                    className={i < Math.floor(overallRating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                  />
                ))}
              </div>
              <p className="text-text-secondary">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution?.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-foreground w-8">{rating}</span>
                  <Icon name="Star" size={14} className="text-accent fill-current" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-foreground">
            {sortedReviews?.length} Review{sortedReviews?.length !== 1 ? 's' : ''}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-3 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {currentReviews?.map((review) => (
          <div key={review?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={review?.user?.avatar}
                  alt={review?.user?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-foreground">{review?.user?.name}</h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < review?.rating ? 'text-accent fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-text-secondary">•</span>
                      <span className="text-sm text-text-secondary">{formatDate(review?.date)}</span>
                    </div>
                  </div>
                  {review?.verified && (
                    <div className="flex items-center space-x-1 text-success text-sm">
                      <Icon name="CheckCircle" size={16} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-text-secondary leading-relaxed mb-4">{review?.comment}</p>

                {/* Review Images */}
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors">
                    <Icon name="ThumbsUp" size={16} />
                    <span className="text-sm">Helpful ({review?.helpfulCount})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors">
                    <Icon name="MessageCircle" size={16} />
                    <span className="text-sm">Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {[...Array(totalPages)]?.map((_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;