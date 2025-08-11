package com.odoo.Quickcourt.Controller;

// controller/ReviewController.java

import com.odoo.Quickcourt.Dto.Review.ReviewRequest;
import com.odoo.Quickcourt.Dto.Review.ReviewResponse;
import com.odoo.Quickcourt.Services.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Review management APIs")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Add a review")
    public ResponseEntity<ReviewResponse> addReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse review = reviewService.addReview(request);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Update a review")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse review = reviewService.updateReview(id, request);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('OWNER')")
    @Operation(summary = "Delete a review")
    public ResponseEntity<String> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
