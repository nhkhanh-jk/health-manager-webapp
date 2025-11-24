package com.hrmanagement.service;

import com.hrmanagement.model.User;
import com.hrmanagement.model.WorkoutSession;
import com.hrmanagement.repository.UserRepository;
import com.hrmanagement.repository.WorkoutSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WorkoutSessionService {

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + username));
    }

    // Logic Dashboard (Giữ nguyên sau khi đã fix lỗi)
    public Map<String, Object> getDashboardFitnessData() {
        User currentUser = getCurrentUser();
        LocalDate today = LocalDate.now();
        
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        // Lấy bài tập mới nhất hôm nay 
        WorkoutSession todayWorkout = workoutSessionRepository
                .findTopByUserAndDateOrderByStartTimeDesc(currentUser, today)
                .orElse(createEmptyWorkout()); 

        // Lấy các bài tập trong tuần này để thống kê
        List<WorkoutSession> weeklySessions = workoutSessionRepository
                .findByUserAndDateBetween(currentUser, startOfWeek, endOfWeek);

        long completedDays = weeklySessions.stream()
                                .filter(WorkoutSession::isCompleted)
                                .map(WorkoutSession::getDate)
                                .distinct()
                                .count();
                                
        double totalCalories = weeklySessions.stream()
                                .filter(WorkoutSession::isCompleted)
                                .mapToDouble(WorkoutSession::getCalories)
                                .sum();
                                
        int totalMinutes = weeklySessions.stream()
                                .filter(WorkoutSession::isCompleted)
                                .mapToInt(WorkoutSession::getDuration)
                                .sum();

        List<WorkoutSession> recentWorkouts = workoutSessionRepository
                .findTop3ByUserOrderByDateDescStartTimeDesc(currentUser);

        Map<String, Object> weeklyStats = new HashMap<>();
        weeklyStats.put("completedDays", completedDays);
        weeklyStats.put("totalDays", 7); 
        weeklyStats.put("totalCalories", totalCalories);
        weeklyStats.put("totalMinutes", totalMinutes);
        weeklyStats.put("streak", 0); 

        Map<String, Object> response = new HashMap<>();
        response.put("todayWorkout", todayWorkout);
        response.put("weeklyStats", weeklyStats);
        response.put("recentWorkouts", recentWorkouts);

        return response;
    }
    
    private WorkoutSession createEmptyWorkout() {
        WorkoutSession emptyWorkout = new WorkoutSession();
        emptyWorkout.setId(0L);
        emptyWorkout.setTitle("Chưa có bài tập");
        emptyWorkout.setDuration(0); 
        emptyWorkout.setCalories(0.0); 
        emptyWorkout.setCompleted(false); 
        emptyWorkout.setThumbnail("🧘‍♂️"); 
        emptyWorkout.setDate(LocalDate.now());
        emptyWorkout.setStartTime(java.time.LocalTime.now());
        return emptyWorkout;
    }

    // --- MỚI: Logic để lưu Workout Session (Cho trang nhập liệu) ---
    public WorkoutSession createWorkoutSession(WorkoutSession session) {
        User currentUser = getCurrentUser();

        // --- ĐÂY LÀ DÒNG QUAN TRỌNG: GÁN USER VÀO RECORD TRƯỚC KHI LƯU ---
        session.setUser(currentUser); 
        session.setId(null);
        session.setIsTemplate(false); // Đảm bảo không phải template
        
        // Đảm bảo date và startTime có giá trị nếu chưa có
        if (session.getDate() == null) {
            session.setDate(LocalDate.now());
        }
        if (session.getStartTime() == null) {
            session.setStartTime(java.time.LocalTime.now());
        }
        // ------------------------------------------------------------

        return workoutSessionRepository.save(session);
    }
    
    // --- MỚI: Lấy tất cả workout sessions của user ---
    public List<WorkoutSession> getAllWorkoutSessions() {
        User currentUser = getCurrentUser();
        return workoutSessionRepository.findByUserOrderByDateDescStartTimeDesc(currentUser);
    }
    
    // --- MỚI: Lấy workout library/templates ---
    public List<WorkoutSession> getWorkoutLibrary() {
        // Lấy các workout có user_id = null hoặc isTemplate = true
        return workoutSessionRepository.findWorkoutLibrary();
    }
    
    // --- MỚI: Lấy workout session theo ID ---
    public WorkoutSession getWorkoutSessionById(Long id) {
        User currentUser = getCurrentUser();
        return workoutSessionRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy workout session với ID: " + id));
    }
    
    // --- MỚI: Cập nhật workout session ---
    public WorkoutSession updateWorkoutSession(Long id, WorkoutSession sessionDetails) {
        User currentUser = getCurrentUser();
        WorkoutSession existingSession = workoutSessionRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy workout session để cập nhật"));
        
        // Cập nhật các trường
        if (sessionDetails.getTitle() != null) existingSession.setTitle(sessionDetails.getTitle());
        if (sessionDetails.getLevel() != null) existingSession.setLevel(sessionDetails.getLevel());
        if (sessionDetails.getDurationMinutes() != null) existingSession.setDurationMinutes(sessionDetails.getDurationMinutes());
        if (sessionDetails.getCalories() != null) existingSession.setCalories(sessionDetails.getCalories());
        if (sessionDetails.getDate() != null) existingSession.setDate(sessionDetails.getDate());
        if (sessionDetails.getStartTime() != null) existingSession.setStartTime(sessionDetails.getStartTime());
        if (sessionDetails.getThumbnail() != null) existingSession.setThumbnail(sessionDetails.getThumbnail());
        if (sessionDetails.getDescription() != null) existingSession.setDescription(sessionDetails.getDescription());
        if (sessionDetails.getCategory() != null) existingSession.setCategory(sessionDetails.getCategory());
        if (sessionDetails.getInstructor() != null) existingSession.setInstructor(sessionDetails.getInstructor());
        if (sessionDetails.getEquipment() != null) existingSession.setEquipment(sessionDetails.getEquipment());
        if (sessionDetails.getDifficulty() != null) existingSession.setDifficulty(sessionDetails.getDifficulty());
        if (sessionDetails.getRating() != null) existingSession.setRating(sessionDetails.getRating());
        if (sessionDetails.getYoutubeUrl() != null) existingSession.setYoutubeUrl(sessionDetails.getYoutubeUrl());
        
        return workoutSessionRepository.save(existingSession);
    }
    
    // --- MỚI: Đánh dấu hoàn thành/chưa hoàn thành ---
    public WorkoutSession toggleComplete(Long id, Boolean completed) {
        User currentUser = getCurrentUser();
        WorkoutSession existingSession = workoutSessionRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy workout session"));
        
        existingSession.setCompleted(completed);
        return workoutSessionRepository.save(existingSession);
    }
    
    // --- MỚI: Xóa workout session ---
    public void deleteWorkoutSession(Long id) {
        User currentUser = getCurrentUser();
        WorkoutSession existingSession = workoutSessionRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy workout session để xóa"));
        
        workoutSessionRepository.delete(existingSession);
    }
}