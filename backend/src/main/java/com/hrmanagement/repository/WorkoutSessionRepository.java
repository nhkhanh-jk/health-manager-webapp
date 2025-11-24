package com.hrmanagement.repository;

import com.hrmanagement.model.User;
import com.hrmanagement.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    /**
     * Lấy các buổi tập của người dùng trong một khoảng ngày (dùng để tính thống kê tuần).
     */
    List<WorkoutSession> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    /**
     * Lấy buổi tập mới nhất của người dùng trong một ngày cụ thể (dùng để lấy bài tập "Hôm nay" trên Dashboard).
     */
    Optional<WorkoutSession> findTopByUserAndDateOrderByStartTimeDesc(User user, LocalDate date);
    
    /**
     * Lấy 3 buổi tập gần nhất của người dùng.
     */
    List<WorkoutSession> findTop3ByUserOrderByDateDescStartTimeDesc(User user);
    
    /**
     * Lấy tất cả workout sessions của user (không phải templates).
     */
    List<WorkoutSession> findByUserOrderByDateDescStartTimeDesc(User user);
    
    /**
     * Lấy workout library/templates (user_id = null VÀ isTemplate = true).
     * FIX: Chỉ lấy templates thực sự, không lấy user sessions
     */
    @Query("SELECT DISTINCT w FROM WorkoutSession w WHERE (w.user IS NULL AND w.isTemplate = true) ORDER BY w.title ASC")
    List<WorkoutSession> findWorkoutLibrary();
    
    /**
     * Lấy workout session theo ID và user (để kiểm tra quyền).
     */
    Optional<WorkoutSession> findByIdAndUser(Long id, User user);
}