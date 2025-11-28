package com.healthmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "workout_sessions")
public class WorkoutSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- MỚI: Liên kết với User (Quan trọng nhất) ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    // --- HẾT CODE MỚI ---

    @NotBlank
    private String title;

    @NotBlank
    private String level; 

    @NotNull
    @Column(name = "duration_minutes") 
    private Integer durationMinutes; 

    @NotNull
    private Double calories; // Sửa từ Integer sang Double

    // Date và startTime có thể null cho templates/library
    private LocalDate date;
    
    @Column(name = "start_time") 
    private LocalTime startTime; 
    
    private String thumbnail; 
    
    @Column(name = "is_completed")
    private boolean completed = false;
    
    // --- MỚI: Các trường cho Workout Library ---
    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả bài tập
    
    private String category; // "Cardio", "HIIT", "Yoga", "Strength", "Stretch"
    
    private String instructor; // Tên huấn luyện viên
    
    private String equipment; // Dụng cụ cần thiết
    
    private Integer difficulty; // Độ khó (1-5)
    
    private Double rating; // Đánh giá (1-5)
    
    @Column(name = "is_template")
    private Boolean isTemplate = false; // Đánh dấu là template/library
    
    @Column(name = "youtube_url", columnDefinition = "TEXT")
    @JsonProperty("youtubeUrl")
    private String youtubeUrl; // Link YouTube video
    // --- HẾT CODE MỚI --- 

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // (Constructor và Getters/Setters giữ nguyên)
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    public WorkoutSession() {}
    public WorkoutSession(String title, String level, Integer durationMinutes, Double calories, LocalDate date, LocalTime startTime, String thumbnail) {
        this.title = title; this.level = level; this.durationMinutes = durationMinutes; this.calories = calories; this.date = date; this.startTime = startTime; this.thumbnail = thumbnail;
    }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getDuration() { return durationMinutes; } 
    public void setDuration(Integer durationMinutes) { this.durationMinutes = durationMinutes; } 
    public Double getCalories() { return calories; }
    public void setCalories(Double calories) { this.calories = calories; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // --- MỚI: Getters/Setters cho các trường library ---
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }
    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Boolean getIsTemplate() { return isTemplate; }
    public void setIsTemplate(Boolean isTemplate) { this.isTemplate = isTemplate; }
    public String getYoutubeUrl() { return youtubeUrl; }
    public void setYoutubeUrl(String youtubeUrl) { this.youtubeUrl = youtubeUrl; }
    // --- HẾT CODE MỚI ---
}
