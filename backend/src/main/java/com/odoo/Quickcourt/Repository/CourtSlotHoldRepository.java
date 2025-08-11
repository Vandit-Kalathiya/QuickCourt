package com.odoo.Quickcourt.Repository;


import com.odoo.Quickcourt.Entities.CourtSlotHold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface CourtSlotHoldRepository extends JpaRepository<CourtSlotHold, UUID> {

    @Query("""
        SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END
        FROM CourtSlotHold h
        WHERE h.courtId = :courtId
        AND h.date = :date
        AND h.expiresAt > CURRENT_TIMESTAMP
        AND ((h.startTime < :endTime AND h.endTime > :startTime))
        """)
    boolean existsActiveHold(UUID courtId, LocalDate date, LocalTime startTime, LocalTime endTime);

    List<CourtSlotHold> findByExpiresAtBefore(LocalDateTime now);

    void deleteByCourtIdAndDateAndStartTimeAndEndTime(UUID courtId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
