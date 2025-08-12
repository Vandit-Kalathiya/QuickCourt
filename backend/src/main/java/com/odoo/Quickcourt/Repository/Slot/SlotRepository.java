package com.odoo.Quickcourt.Repository.Slot;

import com.odoo.Quickcourt.Entities.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SlotRepository extends JpaRepository<Court, UUID> {




        @Query(
                value = """
            WITH RECURSIVE slot_ranges AS (
                SELECT 
                    c.opening_time AS start_time,
                    ADDTIME(c.opening_time, '01:00:00') AS end_time,
                    c.closing_time,
                    c.id AS court_id
                FROM courts c
                WHERE c.id = :courtId

                UNION ALL

                SELECT 
                    ADDTIME(start_time, '01:00:00'),
                    ADDTIME(end_time, '01:00:00'),
                    closing_time,
                    court_id
                FROM slot_ranges
                WHERE ADDTIME(start_time, '01:00:00') < closing_time
            )

            SELECT sr.start_time, sr.end_time
            FROM slot_ranges sr
            WHERE NOT EXISTS (
                SELECT 1 
                FROM bookings b
                WHERE b.court_id = sr.court_id
                  AND b.date = :bookingDate
                  AND b.status = 'COMPLETED'
                  AND (b.start_time < sr.end_time AND b.end_time > sr.start_time)
            )
            AND NOT EXISTS (
                SELECT 1 
                FROM court_availability ca
                WHERE ca.court_id = sr.court_id
                  AND ca.date = :bookingDate
                  AND ca.is_blocked = TRUE
                  AND (ca.start_time < sr.end_time AND ca.end_time > sr.start_time)
            )
            AND NOT EXISTS (
                SELECT 1 
                FROM court_slot_holds h
                WHERE h.court_id = sr.court_id
                  AND h.date = :bookingDate
                  AND h.expires_at > NOW()
                  AND (h.start_time < sr.end_time AND h.end_time > sr.start_time)
            )
            ORDER BY sr.start_time;
        """,
                nativeQuery = true
        )
        List<Object[]> findAvailableSlots(@Param("courtId") UUID courtId,
                                          @Param("bookingDate") LocalDate bookingDate);

        @Query(
                value = """
            SELECT ca.start_time, ca.end_time
            FROM court_availability ca
            WHERE ca.court_id = :courtId
              AND ca.date = :blockingDate
              AND ca.is_blocked = TRUE
            ORDER BY ca.start_time;
        """,
                nativeQuery = true
        )
        List<Object[]> findBlockedSlots(@Param("courtId") UUID courtId,
                                       @Param("blockingDate") LocalDate blockingDate);
    }

