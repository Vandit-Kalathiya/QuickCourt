package com.odoo.Quickcourt.Services.Slot;

import com.odoo.Quickcourt.Repository.Slot.SlotRepository;
import com.odoo.Quickcourt.Repository.CourtAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotRepository slotRepository;
    private final CourtAvailabilityRepository courtAvailabilityRepository;

    public List<Map<String, String>> getAvailableSlots(UUID courtId, LocalDate date) {
        List<Object[]> results = slotRepository.findAvailableSlots(courtId, date);
        return results.stream()
                .map(row -> Map.of(
                        "startTime", row[0].toString(),
                        "endTime", row[1].toString()
                ))
                .toList();
    }

    public List<Map<String, String>> getBlockedSlots(UUID courtId, LocalDate date) {
        List<Object[]> results = slotRepository.findBlockedSlots(courtId, date);
        return results.stream()
                .map(row -> Map.of(
                        "startTime", row[0].toString(),
                        "endTime", row[1].toString()
                ))
                .toList();
    }

    public Map<String, Object> getAllSlots(UUID courtId, LocalDate date) {
        List<Map<String, String>> available = getAvailableSlots(courtId, date);
        List<Map<String, String>> blocked = getBlockedSlots(courtId, date);
        
        return Map.of(
                "available", available,
                "blocked", blocked,
                "date", date.toString(),
                "courtId", courtId.toString()
        );
    }
}
