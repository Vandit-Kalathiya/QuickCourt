package com.odoo.Quickcourt.Services;
// service/OwnerDashboardService.java

import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Dto.Dashboard.OwnerDashboardResponse;
import com.odoo.Quickcourt.Repository.BookingRepository;
import com.odoo.Quickcourt.Repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OwnerDashboardService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;

    public OwnerDashboardResponse getOwnerDashboard() {
        UserPrincipal userPrincipal = getCurrentUser();
        UUID ownerId = userPrincipal.getId();

        // Basic stats
        Long totalBookings = bookingRepository.countByOwnerId(ownerId);
        Long activeCourts = courtRepository.countActiveCourtsByOwnerId(ownerId);
        BigDecimal totalEarnings = bookingRepository.sumEarningsByOwnerId(ownerId).orElse(BigDecimal.ZERO);
        Long todayBookings = bookingRepository.countTodayBookings();

        // Booking trends (last 30 days)
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        List<Object[]> trendData = bookingRepository.findBookingTrendsByOwnerId(ownerId, startDate);
        List<OwnerDashboardResponse.BookingTrendData> bookingTrends = trendData.stream()
                .map(data -> OwnerDashboardResponse.BookingTrendData.builder()
                        .date((LocalDate) data[0])
                        .bookings((Long) data[1])
                        .earnings((BigDecimal) data[2])
                        .build())
                .collect(Collectors.toList());

        // Peak hours
        List<Object[]> peakHourData = bookingRepository.findPeakHoursByOwnerId(ownerId);
        Map<String, Long> peakHours = peakHourData.stream()
                .collect(Collectors.toMap(
                        data -> data[0] + ":00",
                        data -> (Long) data[1]
                ));

        return OwnerDashboardResponse.builder()
                .totalBookings(totalBookings)
                .activeCourts(activeCourts)
                .totalEarnings(totalEarnings)
                .todayBookings(todayBookings)
                .bookingTrends(bookingTrends)
                .peakHours(peakHours)
                .build();
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
