package com.odoo.Quickcourt.Repository;
// repository/FacilityRepository.java

import com.odoo.Quickcourt.Entities.Facility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, UUID> {

    Page<Facility> findByStatus(Facility.FacilityStatus status, Pageable pageable);

    List<Facility> findByOwnerId(UUID ownerId);

    @Query("SELECT f FROM Facility f WHERE f.status = 'APPROVED' " +
            "AND (:sports IS NULL OR EXISTS (SELECT s FROM f.sports s WHERE s IN :sports)) " +
            "AND (:name IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Facility> findApprovedFacilities(
            @Param("sports") List<Facility.Sport> sports,
            @Param("name") String name,
            Pageable pageable
    );

    @Query("SELECT COUNT(f) FROM Facility f WHERE f.status = :status")
    Long countByStatus(Facility.FacilityStatus status);

    @Query("SELECT f.sports as sport, COUNT(f) as count FROM Facility f " +
            "JOIN f.sports s GROUP BY s ORDER BY COUNT(f) DESC")
    List<Object[]> findTopSports();
}
