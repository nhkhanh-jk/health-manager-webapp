package com.hrmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String ho; 

    @NotBlank
    @Size(max = 50)
    private String ten; 
    
    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true) 
    private String email;

    @NotBlank
    @Size(max = 120)
    @JsonIgnore
    private String matKhau;

    private int tuoi; 

    private String gioiTinh; 

    // --- MỚI: Thêm các trường thiếu từ Profile.js ---
    
    @Column(name = "blood_group")
    private String bloodGroup;

    private String height; // Để là String để xử lý đơn vị 'cm'
    private String weight; // Để là String để xử lý đơn vị 'kg'
    private String phone;
    private String address;

    // --- HẾT CODE MỚI ---

    // --- MỚI: THÊM CÁC MỐI QUAN HỆ VÀ CASCADING DELETION ---
    
    // 1. Reminders (Nhắc nhở)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Reminder> reminders; 

    // 2. MedicalHistory (Lịch sử bệnh lý)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<MedicalHistory> medicalHistories; 

    // 3. WorkoutSession (Luyện tập)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<WorkoutSession> workoutSessions;

    // Constructors
    public User() {
    }

    public User(String ho, String ten, String email, String matKhau, int tuoi, String gioiTinh) {
        this.ho = ho;
        this.ten = ten;
        this.email = email;
        this.matKhau = matKhau;
        this.tuoi = tuoi;
        this.gioiTinh = gioiTinh;
    }

    // ✅ Thêm đầy đủ Getter và Setter thủ công (Giữ nguyên)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHo() { return ho; }
    public void setHo(String ho) { this.ho = ho; }
    public String getTen() { return ten; }
    public void setTen(String ten) { this.ten = ten; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }
    public int getTuoi() { return tuoi; }
    public void setTuoi(int tuoi) { this.tuoi = tuoi; }
    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }
    
    // --- MỚI: Getters/Setters cho các trường mới ---
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }
    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    // --- HẾT CODE MỚI ---
}
