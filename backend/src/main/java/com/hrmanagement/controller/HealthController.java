package com.hrmanagement.controller;

import com.hrmanagement.model.Reminder;
import com.hrmanagement.model.MedicalHistory;
import com.hrmanagement.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private HealthService healthService;

    @GetMapping("/reminders/today")
    public ResponseEntity<?> getTodayReminders() {
        return ResponseEntity.ok(healthService.getTodayReminders());
    }

    @GetMapping("/reminders/month")
    public ResponseEntity<?> getMonthReminders() {
        return ResponseEntity.ok(healthService.getMonthReminders());
    }

    @GetMapping("/fitness/stats")
    public ResponseEntity<?> getFitnessStats() {
        return ResponseEntity.ok(healthService.getFitnessStats());
    }

    @PostMapping("/reminders")
    public ResponseEntity<?> createReminder(@RequestBody Reminder reminder) {
        return ResponseEntity.ok(healthService.createReminder(reminder));
    }

    @PutMapping("/reminders/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @RequestBody Reminder reminder) {
        return ResponseEntity.ok(healthService.updateReminder(id, reminder));
    }

    @PatchMapping("/reminders/{id}/toggle")
    public ResponseEntity<?> toggleReminder(@PathVariable Long id, @RequestParam boolean enabled) {
        return ResponseEntity.ok(healthService.toggleReminder(id, enabled));
    }

    @DeleteMapping("/reminders/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        healthService.deleteReminder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/metrics/dashboard")
    public ResponseEntity<?> getDashboardMetrics() {
        return ResponseEntity.ok(healthService.getDashboardMetrics());
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMedicalHistory() {
        return ResponseEntity.ok(healthService.getMedicalHistory());
    }

    @PostMapping("/history")
    public ResponseEntity<?> createMedicalHistory(@RequestBody MedicalHistory history) {
        return ResponseEntity.ok(healthService.createMedicalHistory(history));
    }

    @PutMapping("/history/{id}")
    public ResponseEntity<?> updateMedicalHistory(@PathVariable Long id, @RequestBody MedicalHistory history) {
        return ResponseEntity.ok(healthService.updateMedicalHistory(id, history));
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteMedicalHistory(@PathVariable Long id) {
        healthService.deleteMedicalHistory(id);
        return ResponseEntity.ok().build();
    }
}


