package com.healthmanager.service;

import com.healthmanager.exception.EmailAlreadyExistsException;
import com.healthmanager.model.User;
import com.healthmanager.payload.request.LoginRequest;
import com.healthmanager.payload.request.RegisterRequest;
import com.healthmanager.payload.response.AuthResponse;
import com.healthmanager.repository.UserRepository;
import com.healthmanager.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // --- MỚI: Logic Đăng nhập ĐÃ SỬA LỖI ---
    public AuthResponse loginUser(LoginRequest loginRequest) {
        
        // 1. Xác thực email và mật khẩu (SỬA: Dùng getMatKhau())
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getMatKhau() // --- SỬA LỖI: getPassword() -> getMatKhau()
                )
        );

        // 2. Lưu trữ thông tin xác thực
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Lấy User từ DB
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy người dùng sau khi xác thực."));
        
        // 4. Tạo JWT Token
        String jwt = jwtTokenProvider.generateToken(authentication);
        
        // 5. Trả về Response (SỬA: Dùng constructor mới của AuthResponse)
        return new AuthResponse(jwt, user); // --- SỬA LỖI: new AuthResponse(jwt) -> new AuthResponse(jwt, user)
    }
    // --- HẾT CODE MỚI ---

    // --- MỚI: Logic Đăng ký ĐÃ SỬA LỖI ---
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        
        // 1. Kiểm tra Email đã tồn tại chưa
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email đã được sử dụng!");
        }

        // 2. Tạo đối tượng User mới (SỬA: Dùng getHo, getTen, getTuoi...)
        User user = new User();
        user.setHo(registerRequest.getHo());             // --- SỬA LỖI: getFirstName -> getHo
        user.setTen(registerRequest.getTen());           // --- SỬA LỖI: getLastName -> getTen
        user.setEmail(registerRequest.getEmail());
        user.setTuoi(registerRequest.getTuoi());         // --- SỬA LỖI: getAge -> getTuoi
        user.setGioiTinh(registerRequest.getGioiTinh()); // --- SỬA LỖI: getGender -> getGioiTinh
        
        // 3. Mã hóa mật khẩu (SỬA: Dùng getMatKhau)
        user.setMatKhau(passwordEncoder.encode(registerRequest.getMatKhau())); // --- SỬA LỖI: getPassword -> getMatKhau

        // 4. Lưu User vào DB
        User savedUser = userRepository.save(user);

        // 5. Tự động đăng nhập cho người dùng mới (SỬA: Dùng getMatKhau)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getMatKhau() // --- SỬA LỖI: getPassword -> getMatKhau
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 6. Tạo JWT Token
        String jwt = jwtTokenProvider.generateToken(authentication);

        // 7. Trả về Response (SỬA: Dùng constructor mới của AuthResponse)
        return new AuthResponse(jwt, savedUser); // --- SỬA LỖI: new AuthResponse(jwt) -> new AuthResponse(jwt, savedUser)
    }
    // --- HẾT CODE MỚI ---
}
