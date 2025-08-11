package com.odoo.Quickcourt.Dto.Review;
// dto/review/ReviewRequest.java

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class ReviewRequest {
    @NotNull
    private UUID facilityId;

    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 1000)
    private String comment;
}
