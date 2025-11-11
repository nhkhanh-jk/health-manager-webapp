package com.hrmanagement.repository;

import com.hrmanagement.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByDate(LocalDate date);

    @Query("SELECT r FROM Reminder r WHERE r.date BETWEEN :start AND :end")
    List<Reminder> findByDateRange(LocalDate start, LocalDate end);
}


