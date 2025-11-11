package com.hrmanagement.controller;

import com.hrmanagement.model.WorkoutSession;
import com.hrmanagement.service.WorkoutSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/workouts")
public class WorkoutSessionController {

    @Autowired
    private WorkoutSessionService workoutSessionService;

    @GetMapping
    public ResponseEntity<List<WorkoutSession>> getAllSessions() {
        return ResponseEntity.ok(workoutSessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutSession> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(workoutSessionService.getSessionById(id));
    }

    @GetMapping("/range")
    public ResponseEntity<List<WorkoutSession>> getSessionsByRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(workoutSessionService.getSessionsByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<WorkoutSession> createSession(@RequestBody WorkoutSession session) {
        return ResponseEntity.ok(workoutSessionService.createSession(session));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutSession> updateSession(@PathVariable Long id, @RequestBody WorkoutSession session) {
        return ResponseEntity.ok(workoutSessionService.updateSession(id, session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        workoutSessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}


