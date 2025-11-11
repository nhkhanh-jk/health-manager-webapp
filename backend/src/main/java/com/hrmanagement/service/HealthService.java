package com.hrmanagement.service;

import com.hrmanagement.model.Reminder;
import com.hrmanagement.model.MedicalHistory;
import com.hrmanagement.model.Measurement;
import com.hrmanagement.model.WorkoutSession;
import com.hrmanagement.repository.ReminderRepository;
import com.hrmanagement.repository.WorkoutSessionRepository;
import com.hrmanagement.repository.MeasurementRepository;
import com.hrmanagement.repository.MedicalHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HealthService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @Autowired
    private MeasurementRepository measurementRepository;

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    public Map<String, Object> getTodayReminders() {
        LocalDate today = LocalDate.now();
        List<Reminder> items = reminderRepository.findByDate(today);
        long on = items.stream().filter(r -> Boolean.TRUE.equals(r.getEnabled())).count();
        long off = items.size() - on;

        Map<String, Object> result = new HashMap<>();
        result.put("count", items.size());
        result.put("on", on);
        result.put("off", off);
        result.put("items", items);
        return result;
    }

    public Map<String, Object> getMonthReminders() {
        YearMonth ym = YearMonth.now();
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<Reminder> all = reminderRepository.findByDateRange(start, end);

        int leading = start.getDayOfWeek().getValue() % 7;
        Map<String, Object> body = new HashMap<>();
        body.put("leading", java.util.Collections.nCopies(leading, 0));

        java.util.List<Map<String, Object>> days = new java.util.ArrayList<>();
        for (int d = 1; d <= ym.lengthOfMonth(); d++) {
            LocalDate date = ym.atDay(d);
            java.util.List<Reminder> dayItems = all.stream().filter(r -> r.getDate().equals(date)).toList();
            Map<String, Object> day = new HashMap<>();
            day.put("day", d);
            day.put("date", date.toString());
            day.put("items", dayItems);
            days.add(day);
        }
        body.put("days", days);
        return body;
    }

    public Map<String, Object> getFitnessStats() {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);
        Integer minutes = workoutSessionRepository.sumDurationBetween(start, end);
        if (minutes == null) minutes = 0;
        List<WorkoutSession> weeklySessions =
                workoutSessionRepository.findAllByDateBetweenOrderByDateAsc(start, end);

        Map<String, Object> result = new HashMap<>();
        result.put("weeklyMinutes", minutes);
        result.put("sessions", weeklySessions.size());
        result.put("items", weeklySessions);
        return result;
    }

    public Reminder createReminder(Reminder reminder) {
        if (reminder.getEnabled() == null) reminder.setEnabled(true);
        return reminderRepository.save(reminder);
    }

    public Reminder updateReminder(Long id, Reminder updated) {
        Reminder r = reminderRepository.findById(id).orElseThrow(() -> new RuntimeException("Reminder not found"));
        r.setTitle(updated.getTitle());
        r.setDate(updated.getDate());
        r.setTime(updated.getTime());
        if (updated.getEnabled() != null) r.setEnabled(updated.getEnabled());
        return reminderRepository.save(r);
    }

    public Reminder toggleReminder(Long id, boolean enabled) {
        Reminder r = reminderRepository.findById(id).orElseThrow(() -> new RuntimeException("Reminder not found"));
        r.setEnabled(enabled);
        return reminderRepository.save(r);
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }

    public Map<String, Object> getDashboardMetrics() {
        Measurement latest = measurementRepository.findFirstByOrderByDateDesc().orElse(null);
        List<Measurement> history = measurementRepository.findTop7ByOrderByDateDesc();

        Map<String, Object> result = new HashMap<>();
        
        if (latest != null) {
            result.put("systolic", latest.getSystolicBp());
            result.put("diastolic", latest.getDiastolicBp());
            result.put("heartRate", latest.getHeartRate());
            result.put("weight", latest.getWeight());
        }

        result.put("systolicHistory", history.stream().map(Measurement::getSystolicBp).collect(Collectors.toList()));
        result.put("diastolicHistory", history.stream().map(Measurement::getDiastolicBp).collect(Collectors.toList()));
        result.put("heartRateHistory", history.stream().map(Measurement::getHeartRate).collect(Collectors.toList()));
        
        return result;
    }

    public Map<String, Object> getMedicalHistory() {
        Map<String, Object> result = new HashMap<>();
        List<MedicalHistory> latest = medicalHistoryRepository.findTop10ByOrderByDateDesc();
        result.put("items", latest);
        return result;
    }

    public MedicalHistory createMedicalHistory(MedicalHistory history) {
        if (history.getDate() == null || history.getTitle() == null || history.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Date and title are required");
        }
        return medicalHistoryRepository.save(history);
    }

    public MedicalHistory updateMedicalHistory(Long id, MedicalHistory updated) {
        MedicalHistory h = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical history not found"));
        if (updated.getDate() != null) h.setDate(updated.getDate());
        if (updated.getTitle() != null) h.setTitle(updated.getTitle());
        h.setNotes(updated.getNotes());
        return medicalHistoryRepository.save(h);
    }

    public void deleteMedicalHistory(Long id) {
        medicalHistoryRepository.deleteById(id);
    }
}


