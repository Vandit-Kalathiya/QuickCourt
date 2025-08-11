package com.odoo.Quickcourt.Services.Slot;

import com.odoo.Quickcourt.Repository.Slot.SlotRepository;
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

    public List<Map<String, String>> getAvailableSlots(UUID courtId, LocalDate date) {
        List<Object[]> results = slotRepository.findAvailableSlots(courtId, date);
        return results.stream()
                .map(row -> Map.of(
                        "startTime", row[0].toString(),
                        "endTime", row[1].toString()
                ))
                .toList();
    }
}
