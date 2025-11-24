package com.hrmanagement.controller;

import com.hrmanagement.model.Reminder;
import com.hrmanagement.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private HealthService healthService;

    // --- MỚI: Endpoint cho NewReminder.js (Lấy tất cả) ---
    // GET /api/health/reminders
    @GetMapping("/reminders")
    public ResponseEntity<List<Reminder>> getAllUserReminders() {
        List<Reminder> reminders = healthService.getAllRemindersForCurrentUser();
        return ResponseEntity.ok(reminders);
    }

    // --- MỚI: Endpoint cho NewReminder.js (Tạo mới) ---
    // POST /api/health/reminders
    @PostMapping("/reminders")
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) {
        Reminder createdReminder = healthService.createReminder(reminder);
        return ResponseEntity.ok(createdReminder);
    }

    // --- MỚI: Endpoint cho NewReminder.js (Cập nhật) ---
    // PUT /api/health/reminders/{id}
    @PutMapping("/reminders/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable Long id, @RequestBody Reminder reminderDetails) {
        Reminder updatedReminder = healthService.updateReminder(id, reminderDetails);
        return ResponseEntity.ok(updatedReminder);
    }

    // --- MỚI: Endpoint cho NewReminder.js (Xóa) ---
    // DELETE /api/health/reminders/{id}
    @DeleteMapping("/reminders/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id, @RequestParam(required = false, defaultValue = "instance") String deleteType) {
        healthService.deleteReminder(id, deleteType);
        return ResponseEntity.noContent().build();
    }

    // --- MỚI: Endpoint cho NewDashboard.js (Lấy nhắc nhở hôm nay) ---
    // GET /api/health/reminders/today
    @GetMapping("/reminders/today")
    public ResponseEntity<Map<String, Object>> getTodayRemindersDashboard() {
        // Cần triển khai logic này trong HealthService
        Map<String, Object> todayStats = healthService.getTodayReminderStats();
        return ResponseEntity.ok(todayStats);
    }

    // --- MỚI: Endpoint cho NewDashboard.js (Lấy chỉ số) ---
    // GET /api/health/metrics/dashboard
    @GetMapping("/metrics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        // Cần triển khai logic này trong HealthService
        Map<String, Object> metrics = healthService.getDashboardMetrics();
        return ResponseEntity.ok(metrics);
    }
}