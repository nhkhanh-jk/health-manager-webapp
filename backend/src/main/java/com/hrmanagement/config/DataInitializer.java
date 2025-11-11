package com.hrmanagement.config;

import com.hrmanagement.model.User;
import com.hrmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            logger.info("🔍 Checking for demo user...");
            // Tạo user demo nếu chưa tồn tại
            userRepository.findByEmail("admin@company.com").ifPresentOrElse(existing -> {
                logger.info("📋 Demo user found, checking password...");
                if (!passwordEncoder.matches("admin123", existing.getMatKhau())) {
                    existing.setMatKhau(passwordEncoder.encode("admin123"));
                    userRepository.save(existing);
                    logger.info("✅ Demo user password reset to default credentials.");
                    logger.info("   Email: admin@company.com");
                    logger.info("   Password: admin123");
                } else {
                    logger.info("✅ Demo user already exists with correct password.");
                    logger.info("   Email: admin@company.com");
                    logger.info("   Password: admin123");
                }
            }, () -> {
                logger.info("📝 Creating new demo user...");
                User adminUser = new User();
                adminUser.setHo("Admin");
                adminUser.setTen("User");
                adminUser.setEmail("admin@company.com");
                adminUser.setMatKhau(passwordEncoder.encode("admin123")); // Mật khẩu: admin123
                adminUser.setTuoi(30);
                adminUser.setGioiTinh("Nam");

                userRepository.save(adminUser);
                logger.info("✅ Demo user created successfully!");
                logger.info("   Email: admin@company.com");
                logger.info("   Password: admin123");
            });
        } catch (Exception e) {
            logger.error("❌ Error initializing demo user: ", e);
        }
    }
}

