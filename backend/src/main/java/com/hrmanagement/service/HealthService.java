package com.hrmanagement.service;

import com.hrmanagement.model.Measurement;
import com.hrmanagement.model.Reminder;
import com.hrmanagement.model.User;
import com.hrmanagement.repository.MeasurementRepository;
import com.hrmanagement.repository.ReminderRepository;
import com.hrmanagement.repository.UserRepository;
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
    private ReminderRepository reminderRepository;

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
    public List<Reminder> getAllRemindersForCurrentUser() {
        User currentUser = getCurrentUser();
        return reminderRepository.findByUser(currentUser);
    }

    public Reminder createReminder(Reminder reminder) {
        User currentUser = getCurrentUser();
        reminder.setUser(currentUser); 
        
        if ("none".equals(reminder.getRepeat())) { 
            reminder.setSeriesId(null); 
            return reminderRepository.save(reminder);
        } else {
            List<Reminder> remindersToSave = new ArrayList<>();
            LocalDate startDate = reminder.getDate();
            LocalDate endDate = reminder.getEndDate(); 
            
            long seriesId = System.currentTimeMillis(); 

            LocalDate currentDateLoop = startDate;
            while (!currentDateLoop.isAfter(endDate)) {
                boolean shouldCreate = false;
                if (reminder.getRepeat().equals("daily")) { 
                    shouldCreate = true;
                } else if (reminder.getRepeat().equals("weekly") && currentDateLoop.getDayOfWeek() == startDate.getDayOfWeek()) { 
                    shouldCreate = true;
                }

                if (shouldCreate) {
                    Reminder newInstance = new Reminder();
                    newInstance.setUser(currentUser); 
                    newInstance.setTitle(reminder.getTitle());
                    newInstance.setTime(reminder.getTime());
                    newInstance.setType(reminder.getType()); 
                    newInstance.setEnabled(reminder.getEnabled()); 
                    newInstance.setRepeat(reminder.getRepeat()); 
                    newInstance.setEndDate(reminder.getEndDate()); 
                    newInstance.setDate(currentDateLoop.toString()); 
                    newInstance.setSeriesId(seriesId); 
                    
                    remindersToSave.add(newInstance);
                }
                
                currentDateLoop = currentDateLoop.plusDays(1);
            }
            reminderRepository.saveAll(remindersToSave);
            return remindersToSave.get(0); 
        }
    }

    public Reminder updateReminder(Long id, Reminder reminderDetails) {
        User currentUser = getCurrentUser();
        Reminder existingReminder = reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhắc nhở"));

        if (!existingReminder.getUser().getId().equals(currentUser.getId())) { 
            throw new RuntimeException("Không có quyền cập nhật nhắc nhở này");
        }

        if (existingReminder.getSeriesId() != null) { 
            reminderDetails.setSeriesId(null); 
            reminderDetails.setRepeat("none"); 
        }

        existingReminder.setTitle(reminderDetails.getTitle());
        existingReminder.setDate(reminderDetails.getDate()); 
        existingReminder.setTime(reminderDetails.getTime()); 
        existingReminder.setType(reminderDetails.getType()); 
        existingReminder.setEnabled(reminderDetails.getEnabled()); 
        existingReminder.setRepeat(reminderDetails.getRepeat()); 
        existingReminder.setEndDate(reminderDetails.getEndDate()); 
        existingReminder.setSeriesId(reminderDetails.getSeriesId()); 

        return reminderRepository.save(existingReminder);
    }

    public void deleteReminder(Long id, String deleteType) {
        User currentUser = getCurrentUser();
        Reminder existingReminder = reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhắc nhở"));

        if (!existingReminder.getUser().getId().equals(currentUser.getId())) { 
            throw new RuntimeException("Không có quyền xóa nhắc nhở này");
        }

        if ("series".equals(deleteType) && existingReminder.getSeriesId() != null) { 
            reminderRepository.deleteBySeriesIdAndUser(existingReminder.getSeriesId(), currentUser); 
        } else {
            reminderRepository.delete(existingReminder);
        }
    }

    public Map<String, Object> getTodayReminderStats() {
        User currentUser = getCurrentUser();
        LocalDate today = LocalDate.now();
        List<Reminder> todayReminders = reminderRepository.findByUserAndDate(currentUser, today);
        
        long onCount = todayReminders.stream().filter(Reminder::getEnabled).count();
        long offCount = todayReminders.size() - onCount;

        Map<String, Object> stats = new HashMap<>();
        stats.put("count", todayReminders.size());
        stats.put("on", onCount);
        stats.put("off", offCount);
        stats.put("items", todayReminders.stream().limit(3).collect(Collectors.toList()));
        
        return stats;
    }

    // --- MỚI: Sửa lỗi "Timestamp" thành "CreatedAt" ---
    public Map<String, Object> getDashboardMetrics() {
        User currentUser = getCurrentUser();
        
        // Sửa tên hàm ở đây
        Measurement lastWeight = measurementRepository.findTopByUserAndTypeOrderByCreatedAtDesc(currentUser, "weight").orElse(null);
        Measurement lastBloodPressure = measurementRepository.findTopByUserAndTypeOrderByCreatedAtDesc(currentUser, "blood_pressure").orElse(null);
        Measurement lastHeartRate = measurementRepository.findTopByUserAndTypeOrderByCreatedAtDesc(currentUser, "heart_rate").orElse(null);
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