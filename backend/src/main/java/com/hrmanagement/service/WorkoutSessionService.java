package com.hrmanagement.service;

import com.hrmanagement.model.WorkoutSession;
import com.hrmanagement.repository.WorkoutSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkoutSessionService {

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    public List<WorkoutSession> getAllSessions() {
        return workoutSessionRepository.findAll();
    }

    public WorkoutSession getSessionById(Long id) {
        return workoutSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout session not found"));
    }

    public List<WorkoutSession> getSessionsByDateRange(LocalDate start, LocalDate end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        return workoutSessionRepository.findAllByDateBetweenOrderByDateAsc(start, end);
    }

    public WorkoutSession createSession(WorkoutSession session) {
        return workoutSessionRepository.save(session);
    }

    public WorkoutSession updateSession(Long id, WorkoutSession updated) {
        WorkoutSession existing = getSessionById(id);
        existing.setTitle(updated.getTitle());
        existing.setLevel(updated.getLevel());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setCalories(updated.getCalories());
        existing.setDate(updated.getDate());
        return workoutSessionRepository.save(existing);
    }

    public void deleteSession(Long id) {
        workoutSessionRepository.deleteById(id);
    }
}


