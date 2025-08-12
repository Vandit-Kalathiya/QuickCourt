package com.odoo.Quickcourt.Services;

// service/FacilityService.java


import com.odoo.Quickcourt.Auth.Entities.User;
import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Auth.Repository.UserRepository;
import com.odoo.Quickcourt.Dto.Facility.FacilityRequest;
import com.odoo.Quickcourt.Dto.Facility.FacilityResponse;
import com.odoo.Quickcourt.Entities.Facility;
import com.odoo.Quickcourt.Entities.Photo;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.FacilityRepository;
import com.odoo.Quickcourt.Repository.PhotoRepository;
import com.odoo.Quickcourt.Repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final PhotoRepository photoRepository;
    private final ReviewRepository reviewRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public FacilityResponse createFacility(FacilityRequest request, MultipartFile photo) {
        UserPrincipal userPrincipal = getCurrentUser();

        Facility facility = Facility.builder()
                .ownerId(userPrincipal.getId())
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .email(request.getOwnerEmail())
                .phone(request.getOwnerPhone())
                .sports(request.getSports())
                .amenities(request.getAmenities())
                .active(request.isActive())
                .status(Facility.FacilityStatus.PENDING)
                .build();

        facility = facilityRepository.save(facility);

        // Save photos if provided
        if (photo != null && !photo.isEmpty()) {
            savePhotos(facility.getId(), photo);
        }

        return mapToResponse(facility);
    }

    public FacilityResponse updateFacility(UUID facilityId, FacilityRequest request, MultipartFile photo) {
        UserPrincipal userPrincipal = getCurrentUser();

        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to update this facility");
        }

        facility.setName(request.getName());
        facility.setDescription(request.getDescription());
        facility.setAddress(request.getAddress());
        facility.setSports(request.getSports());
        facility.setAmenities(request.getAmenities());

        facility = facilityRepository.save(facility);

        // Update photos if provided
        if (photo != null && !photo.isEmpty()) {
            // Delete existing photos
            photoRepository.deleteByFacilityId(facilityId);
            // Save new photos
            savePhotos(facilityId, photo);
        }

        return mapToResponse(facility);
    }

    public Page<FacilityResponse> getApprovedFacilities(List<Facility.Sport> sports, String name, Pageable pageable) {
        return facilityRepository.findApprovedFacilities(sports, name, pageable)
                .map(this::mapToResponse);
    }

    public FacilityResponse getFacilityById(UUID facilityId) {
        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (facility.getStatus() != Facility.FacilityStatus.APPROVED) {
            throw new BadRequestException("Facility is not available");
        }

        return mapToResponse(facility);
    }

    public List<FacilityResponse> getOwnerFacilities() {
        UserPrincipal userPrincipal = getCurrentUser();

        return facilityRepository.findByOwnerId(userPrincipal.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void savePhotos(UUID facilityId, MultipartFile photo) {
            String photoUrl = fileStorageService.storeFile(photo);
            Photo photoEntity = Photo.builder()
                    .facilityId(facilityId)
                    .url(photoUrl)
                    .build();
            photoRepository.save(photoEntity);

    }

    private FacilityResponse mapToResponse(Facility facility) {
        // Get photos
        List<String> photos = photoRepository.findByFacilityId(facility.getId())
                .stream()
                .map(Photo::getUrl)
                .collect(Collectors.toList());

        // Get rating info
        Double averageRating = reviewRepository.findAverageRatingByFacilityId(facility.getId());
        Long totalReviews = reviewRepository.countByFacilityId(facility.getId());

        User owner = userRepository.findById(facility.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return FacilityResponse.builder()
                .id(facility.getId())
                .name(facility.getName())
                .description(facility.getDescription())
                .address(facility.getAddress())
                .sports(facility.getSports())
                .amenities(facility.getAmenities())
                .status(facility.getStatus())
                .latitude(facility.getLatitude())
                .longitude(facility.getLongitude())
                .rating(facility.getRating())
                .phone(facility.getPhone())
                .ownerName(owner.getName())
                .ownerEmail(facility.getEmail())
                .averageRating(averageRating)
                .totalReviews(totalReviews.intValue())
                .photos(photos)
                .createdAt(facility.getCreatedAt())
                .build();
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<FacilityResponse> getOwnerApprovedFacilities() {
        UserPrincipal userPrincipal = getCurrentUser();

        return facilityRepository.findAllByOwnerIdAndStatus(userPrincipal.getId(), Facility.FacilityStatus.APPROVED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
