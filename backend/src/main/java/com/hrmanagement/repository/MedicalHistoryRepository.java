package com.hrmanagement.repository;

import com.hrmanagement.model.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    List<MedicalHistory> findTop10ByOrderByDateDesc();
    List<MedicalHistory> findByDateBetweenOrderByDateDesc(LocalDate start, LocalDate end);
}


