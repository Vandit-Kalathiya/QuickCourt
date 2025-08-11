package com.odoo.Quickcourt.Repository.Slot;

import com.odoo.Quickcourt.Entities.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SlotRepository extends JpaRepository<Court, UUID> {

    @Query(
            value = """
        WITH slot_ranges AS (
            SELECT generate_series(c.opening_time, c.closing_time - interval '1 hour', interval '1 hour') AS start_time,
                   (generate_series(c.opening_time, c.closing_time - interval '1 hour', interval '1 hour') + interval '1 hour') AS end_time
            FROM courts c
            WHERE c.id = :courtId
        )
        SELECT start_time, end_time
        FROM slot_ranges sr
        WHERE NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.court_id = :courtId
              AND b.date = :date
              AND b.status = 'CONFIRMED'
              AND ((b.start_time < sr.end_time) AND (b.end_time > sr.start_time))
        )
        AND NOT EXISTS (
            SELECT 1 FROM court_availability ca
            WHERE ca.court_id = :courtId
              AND ca.date = :date
              AND ca.is_blocked = true
              AND ((ca.start_time < sr.end_time) AND (ca.end_time > sr.start_time))
        )
        AND NOT EXISTS (
            SELECT 1 FROM court_slot_holds h
            WHERE h.court_id = :courtId
              AND h.date = :date
              AND h.expires_at > now()
              AND ((h.start_time < sr.end_time) AND (h.end_time > sr.start_time))
        )
        ORDER BY start_time
        """,
            nativeQuery = true
    )
    List<Object[]> findAvailableSlots(UUID courtId, LocalDate date);
}
