package com.odoo.Quickcourt.Config;


import com.odoo.Quickcourt.Services.CourtSlotHoldService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class HoldCleanupScheduler {

    private final CourtSlotHoldService holdService;

    // Every minute
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredHolds() {
        int removed = holdService.cleanupExpiredHolds();
        if (removed > 0) {
            System.out.println("Cleaned up " + removed + " expired holds");
        }
    }
}
