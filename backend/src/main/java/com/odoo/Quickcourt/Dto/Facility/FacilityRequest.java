package com.odoo.Quickcourt.Dto.Facility;
// dto/facility/FacilityRequest.java

import com.odoo.Quickcourt.Entities.Facility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FacilityRequest {

    private String name;

    private String description;


    private String address;


    private List<String> sports;

    private List<String> amenities;
    private boolean active;
}
