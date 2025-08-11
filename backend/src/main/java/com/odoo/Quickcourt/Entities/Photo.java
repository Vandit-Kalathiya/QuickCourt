package com.odoo.Quickcourt.Entities;

// entity/Photo.java

import com.odoo.Quickcourt.Auth.Entities.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo extends BaseEntity {

    @NotNull
    @Column(nullable = false)
    private UUID facilityId;

    @NotBlank
    @Column(nullable = false)
    private String url;
}
