package com.hrmanagement.repository;

import com.hrmanagement.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByDate(LocalDate date);

    List<WorkoutSession> findAllByDateBetweenOrderByDateAsc(LocalDate start, LocalDate end);

    long countByDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT COALESCE(SUM(w.durationMinutes), 0) FROM WorkoutSession w WHERE w.date BETWEEN :start AND :end")
    Integer sumDurationBetween(LocalDate start, LocalDate end);
}


