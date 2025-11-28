package com.healthmanager.service;

import com.healthmanager.model.Measurement;
import com.healthmanager.model.User;
import com.healthmanager.repository.MeasurementRepository;
import com.healthmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HealthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MeasurementRepository measurementRepository;

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

    // ... (Các hàm create, update, delete Reminder giữ nguyên) ...
    // Reminder logic moved to ReminderService

    // --- MỚI: Sửa lỗi "Timestamp" thành "CreatedAt" ---
    public Map<String, Object> getDashboardMetrics() {
        User currentUser = getCurrentUser();

        // Sửa tên hàm ở đây
        Measurement lastWeight = measurementRepository.findTopByUserAndTypeOrderByCreatedAtDesc(currentUser, "weight")
                .orElse(null);
        Measurement lastBloodPressure = measurementRepository
                .findTopByUserAndTypeOrderByCreatedAtDesc(currentUser, "blood_pressure").orElse(null);
        Measurement lastHeartRate = measurementRepository
                .findTopByUserAndTypeOrderByCreatedAtDesc(currentUser, "heart_rate").orElse(null);
        // --- HẾT SỬA LỖI ---

        Map<String, Object> metrics = new HashMap<>();

        if (lastWeight != null) {
            metrics.put("weight", lastWeight.getValue1());
        } else {
            metrics.put("weight", 0);
        }

        if (lastHeartRate != null) {
            metrics.put("heartRate", lastHeartRate.getValue1());
        } else {
            metrics.put("heartRate", 0);
        }

        if (lastBloodPressure != null) {
            metrics.put("systolic", lastBloodPressure.getValue1());
            metrics.put("diastolic", lastBloodPressure.getValue2());
        } else {
            metrics.put("systolic", 0);
            metrics.put("diastolic", 0);
        }

        return metrics;
    }
}
