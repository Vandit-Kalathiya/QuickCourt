package com.odoo.Quickcourt.Repository;
// repository/BookingRepository.java

import com.odoo.Quickcourt.Entities.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Page<Booking> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.facilityId IN " +
            "(SELECT f.id FROM Facility f WHERE f.ownerId = :ownerId) " +
            "ORDER BY b.createdAt DESC")
    Page<Booking> findByOwnerIdOrderByCreatedAtDesc(@Param("ownerId") UUID ownerId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.courtId = :courtId AND b.date = :date " +
            "AND b.status = 'CONFIRMED' " +
            "AND ((b.startTime <= :startTime AND b.endTime > :startTime) " +
            "OR (b.startTime < :endTime AND b.endTime >= :endTime) " +
            "OR (b.startTime >= :startTime AND b.endTime <= :endTime))")
    Boolean existsConflictingBooking(
            @Param("courtId") UUID courtId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.facilityId IN " +
            "(SELECT f.id FROM Facility f WHERE f.ownerId = :ownerId)")
    Long countByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.facilityId IN " +
            "(SELECT f.id FROM Facility f WHERE f.ownerId = :ownerId) AND b.status = 'COMPLETED'")
    Optional<BigDecimal> sumEarningsByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("SELECT DATE(b.createdAt) as date, COUNT(b) as bookings, SUM(b.totalPrice) as earnings " +
            "FROM Booking b WHERE b.facilityId IN " +
            "(SELECT f.id FROM Facility f WHERE f.ownerId = :ownerId) " +
            "AND b.createdAt >= :startDate " +
            "GROUP BY DATE(b.createdAt) ORDER BY DATE(b.createdAt)")
    List<Object[]> findBookingTrendsByOwnerId(
            @Param("ownerId") UUID ownerId,
            @Param("startDate") LocalDateTime startDate
    );

    @Query("SELECT HOUR(b.startTime) as hour, COUNT(b) as bookings FROM Booking b " +
            "WHERE b.facilityId IN (SELECT f.id FROM Facility f WHERE f.ownerId = :ownerId) " +
            "GROUP BY HOUR(b.startTime) ORDER BY COUNT(b) DESC")
    List<Object[]> findPeakHoursByOwnerId(@Param("ownerId") UUID ownerId);

    Long countByStatus(Booking.BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.createdAt) = CURRENT_DATE")
    Long countTodayBookings();
}
