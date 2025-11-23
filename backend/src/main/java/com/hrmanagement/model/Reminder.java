package com.hrmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder { // Đảm bảo tên class khớp với tên file
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @Column(name = "is_enabled")
    private Boolean enabled = true;
    
    @Column(name = "reminder_type")
    private String type = "general"; 

    @Column(name = "repeat_type")
    private String repeat = "none"; 

    @Column(name = "end_date")
    private LocalDate endDate; 

    @Column(name = "series_id")
    private Long seriesId; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore 
    private User user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Reminder() {}

    public Reminder(String title, LocalDate date, LocalTime time, Boolean enabled, String type, User user) {
        this.title = title;
        this.date = date;
        this.time = time;
        this.enabled = enabled;
        this.type = type;
        this.user = user;
    }
    
    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setDate(String dateString) {
        if(dateString != null && !dateString.isEmpty()) {
            this.date = LocalDate.parse(dateString);
        }
    }
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    public void setTime(String timeString) {
        if(timeString != null && !timeString.isEmpty()) {
            this.time = LocalTime.parse(timeString);
        }
    }
    public Boolean getEnabled() { return enabled; } 
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRepeat() { return repeat; }
    public void setRepeat(String repeat) { this.repeat = repeat; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setEndDate(String dateString) {
        if(dateString != null && !dateString.isEmpty()) {
            this.endDate = LocalDate.parse(dateString);
        }
    }
    public Long getSeriesId() { return seriesId; }
    public void setSeriesId(Long seriesId) { this.seriesId = seriesId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}