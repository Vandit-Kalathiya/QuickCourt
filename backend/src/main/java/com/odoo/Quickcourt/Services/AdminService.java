package com.odoo.Quickcourt.Services;

// service/AdminService.java

import com.odoo.Quickcourt.Auth.Entities.User;
import com.odoo.Quickcourt.Auth.Repository.UserRepository;
import com.odoo.Quickcourt.Dto.Admin.AdminDashboardResponse;
import com.odoo.Quickcourt.Dto.Facility.FacilityResponse;
import com.odoo.Quickcourt.Dto.User.UserResponse;
import com.odoo.Quickcourt.Entities.Facility;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.BookingRepository;
import com.odoo.Quickcourt.Repository.CourtRepository;
import com.odoo.Quickcourt.Repository.FacilityRepository;
import com.odoo.Quickcourt.Repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final ReviewRepository reviewRepository;

    // Facility Management
    public Page<FacilityResponse> getFacilityRequests(Pageable pageable) {
        return facilityRepository.findByStatus(Facility.FacilityStatus.PENDING, pageable)
                .map(this::mapFacilityToResponse);
    }

    public void approveFacility(UUID facilityId) {
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (facility.getStatus() != Facility.FacilityStatus.PENDING) {
            throw new BadRequestException("Facility is not in pending status");
        }

        facility.setStatus(Facility.FacilityStatus.APPROVED);
        facility.setRejectionReason(null);
        facilityRepository.save(facility);
    }

    public void rejectFacility(UUID facilityId, String reason) {
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (facility.getStatus() != Facility.FacilityStatus.PENDING) {
            throw new BadRequestException("Facility is not in pending status");
        }

        facility.setStatus(Facility.FacilityStatus.REJECTED);
        facility.setRejectionReason(reason);
        facilityRepository.save(facility);
    }

    // User Management
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAllUsersAndOwners(pageable)
                .map(this::mapUserToResponse);
    }

    public void banUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new BadRequestException("Cannot ban admin user");
        }

        user.setBanned(true);
        userRepository.save(user);
    }

    public void unbanUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setBanned(false);
        userRepository.save(user);
    }

    // Dashboard
    public AdminDashboardResponse getAdminDashboard() {
        Long totalUsers = userRepository.countByRole(User.Role.USER);
        Long totalOwners = userRepository.countByRole(User.Role.OWNER);
        Long totalBookings = bookingRepository.count();
        Long activeCourts = courtRepository.countAllActiveCourts();
        Long pendingApprovals = facilityRepository.countByStatus(Facility.FacilityStatus.PENDING);

        // Top sports
        List<Object[]> topSportsData = facilityRepository.findTopSports();
        List<AdminDashboardResponse.SportStats> topSports = topSportsData.stream()
                .map(data -> AdminDashboardResponse.SportStats.builder()
                        .sport(data[0].toString())
                        .count((Long) data[1])
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalOwners(totalOwners)
                .totalBookings(totalBookings)
                .activeCourts(activeCourts)
                .pendingApprovals(pendingApprovals)
                .topSports(topSports)
                .build();
    }

    private FacilityResponse mapFacilityToResponse(Facility facility) {
        User owner = userRepository.findById(facility.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        return FacilityResponse.builder()
                .id(facility.getId())
                .name(facility.getName())
                .description(facility.getDescription())
                .address(facility.getAddress())
                .ownerName(owner.getName())
                .ownerEmail(facility.getEmail())
                .ownerPhone(facility.getPhone())
                .sports(facility.getSports())
                .amenities(facility.getAmenities())
                .status(facility.getStatus())
                .createdAt(facility.getCreatedAt())
                .build();
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
//                .verified(user.getVerified())
                .banned(user.getBanned())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
