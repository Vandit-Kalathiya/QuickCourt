package com.odoo.Quickcourt.Dto.Admin;
// dto/admin/AdminDashboardResponse.java

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private Long totalUsers;
    private Long totalOwners;
    private Long totalBookings;
    private Long activeCourts;
    private Long pendingApprovals;
    private List<SportStats> topSports;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SportStats {
        private String sport;
        private Long count;
    }
}
