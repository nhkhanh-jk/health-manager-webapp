package com.healthmanager.model;

// --- MỚI: Import thêm các thư viện cần thiết ---
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
// --- HẾT IMPORT MỚI ---

@Entity
@Table(name = "measurements")
public class Measurement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate date;

    // --- CÁC TRƯỜNG CỤ THỂ CỦA BẠN (GIỮ NGUYÊN) ---
    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "heart_rate")
    private Integer heartRate;

    private Double weight;
    // --- HẾT CÁC TRƯỜNG CỤ THỂ ---

    // --- MỚI: CÁC TRƯỜNG CHUNG ĐỂ SỬA LỖI HEALTHSERVICE ---
    @NotNull
    @Column(name = "measurement_type")
    private String type; // "weight", "blood_pressure", "heart_rate"

    @Column(name = "value_1")
    private Double value1; // Dùng cho weight, heart_rate, systolic_bp

    @Column(name = "value_2")
    private Double value2; // Dùng cho diastolic_bp
    // --- HẾT TRƯỜNG CHUNG ---

    // --- MỚI: Thêm liên kết quan trọng tới User ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    // --- HẾT CODE MỚI ---
    
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

    public Measurement() {}

    // --- CŨ ---
    // public Measurement(LocalDate date, Integer systolicBp, Integer diastolicBp, Integer heartRate, Double weight) {
    //     this.date = date;
    //     this.systolicBp = systolicBp;
    //     this.diastolicBp = diastolicBp;
    //     this.heartRate = heartRate;
    //     this.weight = weight;
    // }
    // --- HẾT CODE CŨ ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getSystolicBp() { return systolicBp; }
    
    // --- MỚI: Cập nhật các hàm Setters ---
    public void setSystolicBp(Integer systolicBp) { 
        this.systolicBp = systolicBp;
        this.type = "blood_pressure";
        this.value1 = systolicBp != null ? systolicBp.doubleValue() : null;
    }
    
    public Integer getDiastolicBp() { return diastolicBp; }
    public void setDiastolicBp(Integer diastolicBp) { 
        this.diastolicBp = diastolicBp;
        this.type = "blood_pressure"; // Ghi đè type
        this.value2 = diastolicBp != null ? diastolicBp.doubleValue() : null;
    }
    
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { 
        this.heartRate = heartRate;
        this.type = "heart_rate";
        this.value1 = heartRate != null ? heartRate.doubleValue() : null;
        this.value2 = null; // Đảm bảo value2 là null
    }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { 
        this.weight = weight;
        this.type = "weight";
        this.value1 = weight;
        this.value2 = null; // Đảm bảo value2 là null
    }
    // --- HẾT CẬP NHẬT SETTERS ---
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // --- MỚI: Thêm Getters/Setters cho các trường mới ---
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getValue1() { // HealthService cần hàm này
        return value1;
    }

    public void setValue1(Double value1) {
        this.value1 = value1;
    }

    public Double getValue2() { // HealthService cần hàm này
        return value2;
    }

    public void setValue2(Double value2) {
        this.value2 = value2;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // --- HẾT CODE MỚI ---
}
