package com.odoo.Quickcourt.Repository;

// repository/PhotoRepository.java

import com.odoo.Quickcourt.Entities.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, UUID> {
    List<Photo> findByFacilityId(UUID facilityId);
    void deleteByFacilityId(UUID facilityId);
}
