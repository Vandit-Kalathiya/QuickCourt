package com.odoo.Quickcourt.Repository;

import com.odoo.Quickcourt.Entities.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PricingRuleRepository extends JpaRepository<PricingRule, UUID> {

    List<PricingRule> findByFacilityIdAndActiveTrue(UUID facilityId);
    
    List<PricingRule> findByCourtIdAndActiveTrue(UUID courtId);
    
    List<PricingRule> findByFacilityId(UUID facilityId);
    
    List<PricingRule> findByCourtId(UUID courtId);

    @Query("SELECT pr FROM PricingRule pr WHERE pr.courtId = :courtId AND pr.active = true " +
           "AND (:dayOfWeek IS NULL OR :dayOfWeek MEMBER OF pr.applicableDays) " +
           "AND (pr.startTime IS NULL OR pr.endTime IS NULL OR " +
           "     (pr.startTime <= :time AND pr.endTime >= :time)) " +
           "AND (pr.startDate IS NULL OR pr.endDate IS NULL OR " +
           "     (pr.startDate <= :date AND pr.endDate >= :date)) " +
           "ORDER BY pr.priority ASC, pr.createdAt ASC")
    List<PricingRule> findApplicableRules(
            @Param("courtId") UUID courtId,
            @Param("dayOfWeek") PricingRule.DayOfWeek dayOfWeek,
            @Param("time") LocalTime time,
            @Param("date") LocalDate date
    );

    void deleteByFacilityId(UUID facilityId);
    
    void deleteByCourtId(UUID courtId);

    @Query("SELECT COUNT(pr) FROM PricingRule pr WHERE pr.facilityId = :facilityId AND pr.active = true")
    Long countActiveRulesByFacilityId(@Param("facilityId") UUID facilityId);
}