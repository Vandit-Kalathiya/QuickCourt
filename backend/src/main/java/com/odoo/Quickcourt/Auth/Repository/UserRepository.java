package com.odoo.Quickcourt.Auth.Repository;


import com.odoo.Quickcourt.Auth.Entities.User;
import com.odoo.Quickcourt.Auth.Entities.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    Optional<User> findByEmailOrUsername(String email, String username);

    Optional<User> findByUsernameOrEmail(String username, String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);


    List<User> findByUsernameContainingIgnoreCase(String username);

    Page<User> findByRole(UserRole role, Pageable pageable);

    Page<User> findByIsActiveTrue(Pageable pageable);

    Page<User> findByIsBannedTrue(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.isBanned = false ORDER BY u.reputationScore DESC")
    Page<User> findTopUsers(Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.isBanned = false")
    long countActiveUsers();


}