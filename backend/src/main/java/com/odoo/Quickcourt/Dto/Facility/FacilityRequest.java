package com.odoo.Quickcourt.Dto.Facility;
// dto/facility/FacilityRequest.java

import com.odoo.Quickcourt.Entities.Facility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class FacilityRequest {

    private String name;

    private String description;

    private String ownerEmail;
    private String ownerPhone;

    private String address;


    private List<String> sports;

    private List<String> amenities;
    MultipartFile photo;
    private boolean active;
}
