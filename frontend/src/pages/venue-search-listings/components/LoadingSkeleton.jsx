import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  const SkeletonCard = () => (
    <div className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-muted"></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title and Distance */}
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>
        
        {/* Sports */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="h-4 w-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex space-x-1">
            {[...Array(5)]?.map((_, i) => (
              <div key={i} className="h-4 w-4 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-muted rounded w-12"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        
        {/* Amenities */}
        <div className="flex items-center space-x-3 mb-4">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="flex items-center space-x-1">
              <div className="h-4 w-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </div>
          ))}
        </div>
        
        {/* Price and Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-muted rounded w-12"></div>
            <div className="h-4 bg-muted rounded w-8"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-muted rounded-full"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
        
        {/* Opening Hours */}
        <div className="flex items-center space-x-1 mt-2">
          <div className="h-3 w-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {[...Array(count)]?.map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
};

export default LoadingSkeleton;