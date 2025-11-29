package com.healthmanager.controller;

import com.healthmanager.model.Reminder;
import com.healthmanager.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    /**
     * Lấy danh sách tất cả nhắc nhở của người dùng hiện tại.
     */
    @GetMapping
    public ResponseEntity<List<Reminder>> getAllUserReminders() {
        List<Reminder> reminders = reminderService.getAllRemindersForCurrentUser();
        return ResponseEntity.ok(reminders);
    }

    /**
     * Tạo mới một nhắc nhở.
     * Hỗ trợ tạo nhắc nhở đơn lẻ hoặc nhắc nhở lặp lại (chuỗi).
     */
    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) {
        Reminder createdReminder = reminderService.createReminder(reminder);
        return ResponseEntity.ok(createdReminder);
    }

    /**
     * Cập nhật thông tin một nhắc nhở.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable Long id, @RequestBody Reminder reminderDetails) {
        Reminder updatedReminder = reminderService.updateReminder(id, reminderDetails);
        return ResponseEntity.ok(updatedReminder);
    }

    /**
     * Xóa nhắc nhở.
     * 
     * @param deleteType "instance" để xóa 1 lần, "series" để xóa toàn bộ chuỗi lặp.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id,
            @RequestParam(required = false, defaultValue = "instance") String deleteType) {
        reminderService.deleteReminder(id, deleteType);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thống kê tóm tắt về nhắc nhở trong ngày hôm nay.
     * API này phục vụ cho việc hiển thị Dashboard.
     */
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodayRemindersDashboard() {
        Map<String, Object> todayStats = reminderService.getTodayReminderStats();
        return ResponseEntity.ok(todayStats);
    }
}
