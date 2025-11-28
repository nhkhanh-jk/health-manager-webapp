package com.healthmanager.controller;

import com.healthmanager.service.HealthService;
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

    // Reminder endpoints moved to ReminderController

    // --- MỚI: Endpoint cho NewDashboard.js (Lấy chỉ số) ---
    // GET /api/health/metrics/dashboard
    @GetMapping("/metrics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        // Cần triển khai logic này trong HealthService
        Map<String, Object> metrics = healthService.getDashboardMetrics();
        return ResponseEntity.ok(metrics);
    }
}
