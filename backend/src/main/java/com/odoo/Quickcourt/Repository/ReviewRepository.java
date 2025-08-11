package com.odoo.Quickcourt.Repository;

// repository/ReviewRepository.java

import com.odoo.Quickcourt.Entities.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Page<Review> findByFacilityIdOrderByCreatedAtDesc(UUID facilityId, Pageable pageable);

    Optional<Review> findByUserIdAndFacilityId(UUID userId, UUID facilityId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.facilityId = :facilityId")
    Double findAverageRatingByFacilityId(@Param("facilityId") UUID facilityId);

    Long countByFacilityId(UUID facilityId);

    Boolean existsByUserIdAndFacilityId(UUID userId, UUID facilityId);
}
