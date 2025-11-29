package com.healthmanager.controller;

import com.healthmanager.model.WorkoutSession;
import com.healthmanager.service.WorkoutSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health/workouts")
public class WorkoutSessionController {

    @Autowired
    private WorkoutSessionService workoutSessionService;

    // API: POST /api/health/workouts
    // Dùng để tạo buổi tập luyện mới
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkoutSession> createWorkoutSession(@RequestBody WorkoutSession session) {
        WorkoutSession newSession = workoutSessionService.createWorkoutSession(session);
        return ResponseEntity.ok(newSession);
    }
    
    // API: GET /api/health/workouts/dashboard
    // Dùng để lấy dữ liệu DASHBOARD (thống kê tuần, buổi tập hôm nay, 3 buổi gần nhất)
    @GetMapping("/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getDashboardFitnessData() {
        Map<String, Object> dashboardData = workoutSessionService.getDashboardFitnessData();
        return ResponseEntity.ok(dashboardData);
    }
    
    // API: GET /api/health/workouts
    // Lấy tất cả workout sessions của user hiện tại
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WorkoutSession>> getAllWorkoutSessions() {
        List<WorkoutSession> sessions = workoutSessionService.getAllWorkoutSessions();
        return ResponseEntity.ok(sessions);
    }
    
    // API: GET /api/health/workouts/library
    // Lấy workout library/templates (các bài tập mẫu)
    @GetMapping("/library")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WorkoutSession>> getWorkoutLibrary() {
        List<WorkoutSession> library = workoutSessionService.getWorkoutLibrary();
        return ResponseEntity.ok(library);
    }
    
    // API: GET /api/health/workouts/{id}
    // Lấy workout session theo ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkoutSession> getWorkoutSessionById(@PathVariable Long id) {
        WorkoutSession session = workoutSessionService.getWorkoutSessionById(id);
        return ResponseEntity.ok(session);
    }
    
    // API: PUT /api/health/workouts/{id}
    // Cập nhật workout session
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkoutSession> updateWorkoutSession(@PathVariable Long id, @RequestBody WorkoutSession sessionDetails) {
        WorkoutSession updatedSession = workoutSessionService.updateWorkoutSession(id, sessionDetails);
        return ResponseEntity.ok(updatedSession);
    }
    
    // API: PUT /api/health/workouts/{id}/complete
    // Đánh dấu hoàn thành/chưa hoàn thành
    @PutMapping("/{id}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WorkoutSession> toggleComplete(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        Boolean completed = request.getOrDefault("completed", false);
        WorkoutSession updatedSession = workoutSessionService.toggleComplete(id, completed);
        return ResponseEntity.ok(updatedSession);
    }
    
    // API: DELETE /api/health/workouts/{id}
    // Xóa workout session
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteWorkoutSession(@PathVariable Long id) {
        workoutSessionService.deleteWorkoutSession(id);
        return ResponseEntity.noContent().build();
    }
}
