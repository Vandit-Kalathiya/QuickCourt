package com.odoo.Quickcourt.Dto.Review;
// dto/review/ReviewResponse.java

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID id;
    private UUID userId;
    private UUID facilityId;
    private Integer rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;
}
