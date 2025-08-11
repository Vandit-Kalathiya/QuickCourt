//package com.odoo.Quickcourt.Auth.Repository;
//// repository/OtpRepository.java
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//import java.util.UUID;
//
//@Repository
//public interface OtpRepository extends JpaRepository<Otp, UUID> {
//    Optional<Otp> findByUserIdAndCodeAndUsedFalseAndExpiresAtAfter(
//            UUID userId, String code, LocalDateTime currentTime);
//
//    void deleteByUserId(UUID userId);
//    void deleteByExpiresAtBefore(LocalDateTime currentTime);
//}
