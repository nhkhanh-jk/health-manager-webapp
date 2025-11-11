package com.hrmanagement.controller;

import com.hrmanagement.payload.request.LoginRequest;
import com.hrmanagement.payload.request.RegisterRequest;
import com.hrmanagement.payload.response.AuthResponse;
import com.hrmanagement.service.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/auth", "/api/auth"})
// @CrossOrigin đã được xử lý trong SecurityConfig, nhưng để đây cũng không sao
// @CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String jwt = authService.loginUser(loginRequest);
        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.registerUser(registerRequest);
        return ResponseEntity.ok(Map.of("message", "Đăng ký tài khoản thành công!"));
    }
}