package com.hrmanagement.repository;

import com.hrmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Tìm user bằng email (cho việc login)
    Optional<User> findByEmail(String email);

    // Kiểm tra email đã tồn tại chưa (cho việc register)
    Boolean existsByEmail(String email);
}