package com.odoo.Quickcourt.Controller;

// controller/AdminController.java

import com.odoo.Quickcourt.Dto.Admin.AdminDashboardResponse;
import com.odoo.Quickcourt.Dto.Facility.FacilityResponse;
import com.odoo.Quickcourt.Dto.User.UserResponse;
import com.odoo.Quickcourt.Services.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final AdminService adminService;

    // Facility Management
    @GetMapping("/facility-requests")
    @Operation(summary = "Get pending facility requests")
    public ResponseEntity<Page<FacilityResponse>> getFacilityRequests(Pageable pageable) {
        Page<FacilityResponse> requests = adminService.getFacilityRequests(pageable);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/facility-requests/{id}/approve")
    @Operation(summary = "Approve facility")
    public ResponseEntity<String> approveFacility(@PathVariable UUID id) {
        adminService.approveFacility(id);
        return ResponseEntity.ok("Facility approved successfully");
    }

    @PostMapping("/facility-requests/{id}/reject")
    @Operation(summary = "Reject facility")
    public ResponseEntity<String> rejectFacility(
            @PathVariable UUID id,
            @RequestParam String reason) {
        adminService.rejectFacility(id, reason);
        return ResponseEntity.ok("Facility rejected successfully");
    }

    // User Management
    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        Page<UserResponse> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{id}/ban")
    @Operation(summary = "Ban user")
    public ResponseEntity<String> banUser(@PathVariable UUID id) {
        adminService.banUser(id);
        return ResponseEntity.ok("User banned successfully");
    }

    @PostMapping("/users/{id}/unban")
    @Operation(summary = "Unban user")
    public ResponseEntity<String> unbanUser(@PathVariable UUID id) {
        adminService.unbanUser(id);
        return ResponseEntity.ok("User unbanned successfully");
    }

    // Dashboard
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        AdminDashboardResponse dashboard = adminService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
