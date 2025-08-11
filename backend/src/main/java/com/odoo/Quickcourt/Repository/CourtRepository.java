package com.odoo.Quickcourt.Repository;

// repository/CourtRepository.java

import com.odoo.Quickcourt.Entities.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourtRepository extends JpaRepository<Court, UUID> {

    List<Court> findByFacilityIdAndActiveTrue(UUID facilityId);

    List<Court> findByFacilityId(UUID facilityId);

    @Query("SELECT COUNT(c) FROM Court c WHERE c.facilityId IN " +
            "(SELECT f.id FROM Facility f WHERE f.ownerId = :ownerId) AND c.active = true")
    Long countActiveCourtsByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("SELECT COUNT(c) FROM Court c WHERE c.active = true")
    Long countAllActiveCourts();
}
