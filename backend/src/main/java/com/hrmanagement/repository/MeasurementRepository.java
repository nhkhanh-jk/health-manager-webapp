package com.hrmanagement.repository;

import com.hrmanagement.model.Measurement;
import com.hrmanagement.model.User; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; 

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

    // --- MỚI: Sửa "Timestamp" thành "CreatedAt" ---
    // Tên trường trong Model là "createdAt" (ở Bước 23)
    Optional<Measurement> findTopByUserAndTypeOrderByCreatedAtDesc(User user, String type);
    // --- HẾT SỬA LỖI ---
}