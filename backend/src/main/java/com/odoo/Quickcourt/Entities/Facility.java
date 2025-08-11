package com.odoo.Quickcourt.Entities;

// entity/Facility.java

import com.odoo.Quickcourt.Auth.Entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "facilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID ownerId;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String phone;
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<String> sports;

    @ElementCollection
    private List<String> amenities;

    private String longitude;
    private String latitude;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FacilityStatus status = FacilityStatus.PENDING;

    private String rejectionReason;

    @OneToMany(mappedBy = "facilityId", cascade = CascadeType.ALL)
    private List<Court> courts;

    @OneToMany(mappedBy = "facilityId", cascade = CascadeType.ALL)
    private List<Photo> photos;

    @OneToMany(mappedBy = "facilityId", cascade = CascadeType.ALL)
    private List<Review> reviews;

    @Builder.Default
    private Boolean active = true;

    public enum Sport {
        FOOTBALL, BASKETBALL, TENNIS, BADMINTON, VOLLEYBALL, CRICKET, SWIMMING
    }

    public enum FacilityStatus {
        PENDING, APPROVED, REJECTED
    }
}
