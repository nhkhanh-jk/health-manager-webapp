package com.hrmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

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

    // Constructors
    public User() {
    }

    public User(String firstName, String lastName, String email, String password, int age, String gender) {
        this.ho = firstName;
        this.ten = lastName;
        this.email = email;
        this.matKhau = password;
        this.tuoi = age;
        this.gioiTinh = gender;
    }

    // ✅ Thêm đầy đủ Getter và Setter thủ công

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHo() {
        return ho;
    }

    public void setHo(String ho) {
        this.ho = ho;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public int getTuoi() {
        return tuoi;
    }

    public void setTuoi(int tuoi) {
        this.tuoi = tuoi;
    }

    public String getGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(String gioiTinh) {
        this.gioiTinh = gioiTinh;
    }
}
