package com.hrmanagement.repository;

import com.hrmanagement.model.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
    Optional<Measurement> findFirstByOrderByDateDesc();
    
    List<Measurement> findTop7ByOrderByDateDesc();
    
    @Query("SELECT m FROM Measurement m WHERE m.date BETWEEN :start AND :end ORDER BY m.date ASC")
    List<Measurement> findByDateRange(LocalDate start, LocalDate end);
}

