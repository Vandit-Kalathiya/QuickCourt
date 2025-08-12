package com.odoo.Quickcourt.Services;

// service/CourtService.java

import com.odoo.Quickcourt.Auth.Entities.UserPrincipal;
import com.odoo.Quickcourt.Dto.Court.CourtRequest;
import com.odoo.Quickcourt.Dto.Court.CourtResponse;
import com.odoo.Quickcourt.Entities.Court;
import com.odoo.Quickcourt.Entities.CourtAvailability;
import com.odoo.Quickcourt.Entities.Facility;
import com.odoo.Quickcourt.Exception.BadRequestException;
import com.odoo.Quickcourt.Exception.ResourceNotFoundException;
import com.odoo.Quickcourt.Repository.CourtAvailabilityRepository;
import com.odoo.Quickcourt.Repository.CourtRepository;
import com.odoo.Quickcourt.Repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourtService {

    private final CourtRepository courtRepository;
    private final FacilityRepository facilityRepository;
    private final CourtAvailabilityRepository availabilityRepository;

    public CourtResponse createCourt(UUID facilityId, CourtRequest request) {
        UserPrincipal userPrincipal = getCurrentUser();

        Facility facility = facilityRepository.findById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));


        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to add courts to this facility");
        }

        Court court = Court.builder()
                .facilityId(facilityId)
                .name(request.getName())
                .sportType(Facility.Sport.valueOf(request.getSportType().toUpperCase()))
                .pricePerHour(request.getPricePerHour())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .active(true)
                .build();

        court = courtRepository.save(court);
        return mapToResponse(court);
    }

    public CourtResponse updateCourt(UUID courtId, CourtRequest request) {
        UserPrincipal userPrincipal = getCurrentUser();

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        Facility facility = facilityRepository.findById(court.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to update this court");
        }

        court.setName(request.getName());
        court.setSportType(Facility.Sport.valueOf(request.getSportType()));
        court.setPricePerHour(request.getPricePerHour());
        court.setOpeningTime(request.getOpeningTime());
        court.setClosingTime(request.getClosingTime());

        court = courtRepository.save(court);
        return mapToResponse(court);
    }

    public List<CourtResponse> getFacilityCourts(UUID facilityId) {
        return courtRepository.findByFacilityIdAndActiveTrue(facilityId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void blockTimeSlot(UUID courtId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        UserPrincipal userPrincipal = getCurrentUser();

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        Facility facility = facilityRepository.findById(court.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to manage this court");
        }

        CourtAvailability availability = CourtAvailability.builder()
                .courtId(courtId)
                .date(date)
                .startTime(startTime)
                .endTime(endTime)
                .isBlocked(true)
                .build();

        availabilityRepository.save(availability);
    }

    public void unblockTimeSlot(UUID courtId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        UserPrincipal userPrincipal = getCurrentUser();

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found"));

        Facility facility = facilityRepository.findById(court.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        if (!facility.getOwnerId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Not authorized to manage this court");
        }

        availabilityRepository.deleteByCourtIdAndDateAndStartTimeAndEndTime(courtId, date, startTime, endTime);
    }

    private CourtResponse mapToResponse(Court court) {
        return CourtResponse.builder()
                .id(court.getId())
                .facilityId(court.getFacilityId())
                .name(court.getName())
                .sportType(court.getSportType())
                .pricePerHour(court.getPricePerHour())
                .openingTime(court.getOpeningTime())
                .closingTime(court.getClosingTime())
                .active(court.getActive())
                .build();
    }

    private UserPrincipal getCurrentUser() {
        return (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
