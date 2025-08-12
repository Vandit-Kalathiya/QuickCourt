package com.odoo.Quickcourt.Dto.Facility;

// dto/facility/FacilityResponse.java

import com.odoo.Quickcourt.Entities.Facility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacilityResponse {
    private UUID id;
    private String name;
    private String description;
    private String address;
    private List<String> sports;
    private List<String> amenities;
    private Facility.FacilityStatus status;
    private Double averageRating;
    private Integer totalReviews;
    private String longitude;
    private String latitude;
    private String ownerName;
    private String ownerEmail;
    private String rating;
    private String phone;
    private List<String> photos;
    private LocalDateTime createdAt;
}
