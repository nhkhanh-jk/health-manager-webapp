package com.hrmanagement.model;

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
    private String matKhau;

    private int tuoi; 

    private String gioiTinh; 

    // Constructors
    public User() {
    }

    public User(String firstName, String lastName, String email, String password, int age, String gender) {
        this.ho= firstName;
        this.ten = lastName;
        this.email = email;
        this.matKhau = password;
        this.tuoi = age;
        this.gioiTinh = gender;
    }

}