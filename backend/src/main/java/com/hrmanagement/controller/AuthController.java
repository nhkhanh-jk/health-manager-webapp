package com.hrmanagement.controller;

import com.hrmanagement.payload.request.LoginRequest;
import com.hrmanagement.payload.request.RegisterRequest;
import com.hrmanagement.payload.response.AuthResponse;
import com.hrmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin đã được xử lý trong SecurityConfig, nhưng để đây cũng không sao
// @CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Gọi service để xác thực và tạo token
        String jwt = authService.loginUser(loginRequest);
        
        // Trả token về cho React
        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        
        // Gọi service để đăng ký
        authService.registerUser(registerRequest);

        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }
}


