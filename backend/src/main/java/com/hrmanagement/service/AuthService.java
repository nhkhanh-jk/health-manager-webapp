package com.hrmanagement.service;

import com.hrmanagement.exception.EmailAlreadyExistsException;
import com.hrmanagement.model.User;
import com.hrmanagement.payload.request.LoginRequest;
import com.hrmanagement.payload.request.RegisterRequest;
import com.hrmanagement.repository.UserRepository;
import com.hrmanagement.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional; // Cần import cho phương thức update và findByEmail

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    public String loginUser(LoginRequest loginRequest) {
        // Xác thực người dùng (so khớp email/password)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getMatKhau()
                )
        );

        // Nếu xác thực thành công, đặt vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo JWT token và trả về
        return tokenProvider.generateToken(authentication);
    }

    public User registerUser(RegisterRequest registerRequest) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email đã được sử dụng!");
        }

        // 2. Tạo user mới
        User user = new User(
                registerRequest.getHo(),
                registerRequest.getTen(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getMatKhau()), // 3. Mã hóa mật khẩu
                registerRequest.getTuoi(),
                registerRequest.getGioiTinh()
        );

        // 4. Lưu vào database
        return userRepository.save(user);
    }
    
    // --- PHƯƠNG THỨC CẬP NHẬT (UPDATE) ---
    
    /**
     * Cập nhật thông tin người dùng.
     * @param userId ID của người dùng cần cập nhật.
     * @param userDetails Đối tượng User chứa thông tin mới.
     * @return Optional chứa User đã được cập nhật hoặc Optional.empty() nếu không tìm thấy.
     */
    public Optional<User> updateUser(Long userId, User userDetails) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();

            // --- BƯỚC 1: CẬP NHẬT CÁC TRƯỜNG DỮ LIỆU KHÔNG PHẢI MẬT KHẨU ---
            // (LƯU Ý: Nếu các trường này là NOT NULL và không được gửi trong JSON, 
            // chúng sẽ là null, gây lỗi. DÙ SAO BẠN VẪN PHẢI GỬI ĐẦY ĐỦ TRÊN POSTMAN)
            existingUser.setHo(userDetails.getHo());
            existingUser.setTen(userDetails.getTen());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setTuoi(userDetails.getTuoi());
            existingUser.setGioiTinh(userDetails.getGioiTinh());

            // --- BƯỚC 2: XỬ LÝ MẬT KHẨU (LOGIC QUAN TRỌNG) ---
            String newMatKhau = userDetails.getMatKhau();

            if (newMatKhau != null && !newMatKhau.isEmpty()) {
                // Nếu có mật khẩu mới, mã hóa và set nó
                existingUser.setMatKhau(passwordEncoder.encode(newMatKhau));
            } else {
                // Nếu KHÔNG có mật khẩu mới, GIỮ LẠI MẬT KHẨU CŨ
                // Điều này ngăn chặn mật khẩu bị set thành null khi gọi save()
                // KHÔNG CẦN LÀM GÌ CẢ: existingUser VẪN ĐANG GIỮ MẬT KHẨU CŨ
                // Mật khẩu cũ đã được lấy ra khi gọi findById(userId)
            }

            // --- BƯỚC 3: Xử lý Email (UNIQUE Constraint) ---
            // Cần kiểm tra xem email mới (nếu có) có trùng với user khác không
            if (!existingUser.getEmail().equals(userDetails.getEmail())) {
                if (userRepository.existsByEmail(userDetails.getEmail())) {
                    // Ném ra exception nếu email đã được sử dụng bởi người khác
                    // Bạn có thể tạo một ResourceConflictException ở đây
                    throw new IllegalStateException("Email đã được sử dụng bởi tài khoản khác."); 
                }
            }
            
            // CẬP NHẬT LẠI EMAIL ĐÃ KIỂM TRA
            existingUser.setEmail(userDetails.getEmail());


            // Lưu lại để cập nhật (save() sẽ cập nhật nếu ID tồn tại)
            return Optional.of(userRepository.save(existingUser));
        } else {
            return Optional.empty(); // Không tìm thấy người dùng
        }
    }
    // --- PHƯƠNG THỨC XÓA (DELETE) ---

    /**
     * Xóa người dùng theo ID.
     * @param userId ID của người dùng cần xóa.
     * @return true nếu xóa thành công, false nếu không tìm thấy người dùng.
     */
    public boolean deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }
    
    // --- PHƯƠNG THỨC HỖ TRỢ CONTROLLER ---

    /**
     * Tìm người dùng theo email.
     * @param email Email của người dùng.
     * @return Optional<User>.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}