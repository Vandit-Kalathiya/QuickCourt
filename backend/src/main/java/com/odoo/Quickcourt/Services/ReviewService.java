package com.odoo.Quickcourt.Services;

// service/ReviewService.java

import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Dto.Review.ReviewRequest;
import com.odoo.Quickcourt.Dto.Review.ReviewResponse;
import com.odoo.Quickcourt.Entities.Review;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.FacilityRepository;
import com.odoo.Quickcourt.Repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final FacilityRepository facilityRepository;

    public ReviewResponse addReview(ReviewRequest request) {
        UserPrincipal userPrincipal = getCurrentUser();

        // Check if facility exists
        if (!facilityRepository.existsById(request.getFacilityId())) {
            throw new ResourceNotFoundException("Facility not found");
        }

        // Check if user already reviewed this facility
        if (reviewRepository.existsByUserIdAndFacilityId(userPrincipal.getId(), request.getFacilityId())) {
            throw new BadRequestException("You have already reviewed this facility");
        }

        Review review = Review.builder()
                .userId(userPrincipal.getId())
                .facilityId(request.getFacilityId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    public ReviewResponse updateReview(UUID reviewId, ReviewRequest request) {
        UserPrincipal userPrincipal = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUserId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to update this review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    public Page<ReviewResponse> getFacilityReviews(UUID facilityId, Pageable pageable) {
        return reviewRepository.findByFacilityIdOrderByCreatedAtDesc(facilityId, pageable)
                .map(this::mapToResponse);
    }

    public void deleteReview(UUID reviewId) {
        UserPrincipal userPrincipal = getCurrentUser();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUserId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .facilityId(review.getFacilityId())
                .rating(review.getRating())
                .comment(review.getComment())
                .userName(review.getUser() != null ? review.getUser().getName() : null)
                .createdAt(review.getCreatedAt())
                .build();
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
