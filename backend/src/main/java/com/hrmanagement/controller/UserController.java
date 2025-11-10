package com.hrmanagement.controller;

import com.hrmanagement.model.User;
import com.hrmanagement.service.AuthService; // Thay vì UserService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // Thay thế UserRepository bằng AuthService
    @Autowired
    private AuthService authService; 

    // Endpoint 1: Lấy thông tin người dùng hiện tại
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        
        String email = principal.getName(); 
        
        // Cần phương thức findByEmail trong AuthService (hoặc gọi trực tiếp qua Repository nếu không muốn sửa AuthService)
        // Giả sử AuthService có phương thức này:
        User user = authService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user với email: " + email));

        // Không trả về mật khẩu
        user.setMatKhau(null); 
        
        return ResponseEntity.ok(user);
    }

    // --- BỔ SUNG CHỨC NĂNG CẬP NHẬT VÀ XÓA ---

    // Endpoint 2: Cập nhật người dùng (sử dụng PUT)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, 
                                          @RequestBody User userDetails, 
                                          Principal principal) {
        
        // **BẢO MẬT:** Kiểm tra người dùng có được phép cập nhật tài khoản này không.
        User currentUser = authService.findByEmail(principal.getName())
                                    .orElseThrow(() -> new UsernameNotFoundException("User không tồn tại."));
                                    
        if (!currentUser.getId().equals(id)) {
            // 403 Forbidden nếu người dùng cố gắng cập nhật tài khoản khác
            return ResponseEntity.status(403).build(); 
        }

        // Gọi AuthService để xử lý logic cập nhật
        Optional<User> updatedUser = authService.updateUser(id, userDetails);

        if (updatedUser.isPresent()) {
            User user = updatedUser.get();
            user.setMatKhau(null);// Không trả về mật khẩu
            return ResponseEntity.ok(user); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // Endpoint 3: Xóa người dùng (sử dụng DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, Principal principal) {
        
        // **BẢO MẬT:** Kiểm tra người dùng có được phép xóa tài khoản này không.
        User currentUser = authService.findByEmail(principal.getName())
                                    .orElseThrow(() -> new UsernameNotFoundException("User không tồn tại."));

        if (!currentUser.getId().equals(id)) {
            // 403 Forbidden nếu người dùng cố gắng xóa tài khoản khác
            return ResponseEntity.status(403).build(); 
        }

        // Gọi AuthService để xử lý logic xóa
        boolean isDeleted = authService.deleteUser(id);

        if (isDeleted) {

            // 204 No Content cho việc xóa thành công (không cần trả về body)
            return ResponseEntity.noContent().build(); 
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}