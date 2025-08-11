package com.odoo.Quickcourt.Auth.Entities;

// entity/User.java

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    private String avatar;

    @Builder.Default
    private Boolean verified = false;

    @Builder.Default
    private Boolean banned = false;

    public enum Role {
        USER, OWNER, ADMIN
    }
}

//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedDate;
//import org.springframework.data.jpa.domain.support.AuditingEntityListener;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.time.LocalDateTime;
//import java.util.Collection;
//import java.util.List;
//
//@Entity
//@Table(name = "users")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@EntityListeners(AuditingEntityListener.class)
//public class User  extends BaseEntity implements UserDetails
//{
//
//
////
////    @Column(unique = true, nullable = false, length = 50)
////    private String username;
//
//    @Column(unique = true, nullable = false, length = 100)
//    private String email;
//
//    @Column(nullable = false)
//    private String password;
//
//
//    @Column(name = "display_name", length = 100)
//    private String displayName;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    @Builder.Default
//    private UserRole role = UserRole.USER;
//
//    @Builder.Default
//    private Boolean verified = false;
//
//
//    @Builder.Default
//    @Column(name = "is_active", nullable = false)
//    private Boolean isActive = true;
//
//    @Builder.Default
//    @Column(name = "is_banned", nullable = false)
//    private Boolean Banned = false;
//
//    @Column(name = "avatar_url")
//    private String avatarUrl;
//
//    @Column(columnDefinition = "TEXT")
//    private String bio;
//
//
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of();
//    }
//
//    @Override
//    public String getUsername() {
//        return email;
//    }
//}
