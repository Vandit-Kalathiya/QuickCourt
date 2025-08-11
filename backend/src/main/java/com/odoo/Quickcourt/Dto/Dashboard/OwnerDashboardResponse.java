package com.odoo.Quickcourt.Dto.Dashboard;

// dto/dashboard/OwnerDashboardResponse.java

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardResponse {
    private Long totalBookings;
    private Long activeCourts;
    private BigDecimal totalEarnings;
    private Long todayBookings;
    private List<BookingTrendData> bookingTrends;
    private Map<String, Long> peakHours;
    private List<FacilityStats> facilitiesStats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingTrendData {
        private LocalDate date;
        private Long bookings;
        private BigDecimal earnings;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FacilityStats {
        private String facilityName;
        private Long bookings;
        private BigDecimal earnings;
        private Double rating;
    }
}
