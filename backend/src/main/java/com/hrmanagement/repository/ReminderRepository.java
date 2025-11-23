package com.hrmanagement.repository;

import com.hrmanagement.model.Reminder;
import com.hrmanagement.model.User; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate; // --- MỚI: Import LocalDate ---
import java.util.List; 

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUser(User user);

    // --- MỚI: Sửa lại kiểu dữ liệu từ String sang LocalDate ---
    // Điều này sẽ khớp với kiểu dữ liệu (LocalDate) mà HealthService đang gọi
    List<Reminder> findByUserAndDate(User user, LocalDate date);
    // --- HẾT SỬA LỖI ---

    void deleteBySeriesIdAndUser(Long seriesId, User user);
}