package com.odoo.Quickcourt.Repository;
// repository/CourtAvailabilityRepository.java

import com.odoo.Quickcourt.Entities.CourtAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CourtAvailabilityRepository extends JpaRepository<CourtAvailability, UUID> {

    List<CourtAvailability> findByCourtIdAndDate(UUID courtId, LocalDate date);

    @Query("SELECT CASE WHEN COUNT(ca) > 0 THEN true ELSE false END FROM CourtAvailability ca " +
            "WHERE ca.courtId = :courtId AND ca.date = :date AND ca.isBlocked = true " +
            "AND ((ca.startTime <= :startTime AND ca.endTime > :startTime) " +
            "OR (ca.startTime < :endTime AND ca.endTime >= :endTime) " +
            "OR (ca.startTime >= :startTime AND ca.endTime <= :endTime))")
    Boolean existsByCourtIdAndDateAndTimeRangeAndIsBlockedTrue(
            @Param("courtId") UUID courtId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    void deleteByCourtIdAndDate(UUID courtId, LocalDate date);
    
    void deleteByCourtIdAndDateAndStartTimeAndEndTime(UUID courtId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
