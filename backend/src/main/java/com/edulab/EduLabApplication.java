package com.edulab;

import com.edulab.model.User;
import com.edulab.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EduLabApplication {
    public static void main(String[] args) {
        SpringApplication.run(EduLabApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDefaultAccounts(UserRepository userRepository) {
        return args -> {
            // Seed Admin Account
            if (userRepository.findByEmail("admin@edulab.vn").isEmpty()) {
                User admin = new User(
                    "u-admin",
                    "admin@edulab.vn",
                    "123456",
                    "Quản Trị Viên EduLab",
                    "ADMIN",
                    "Hệ Thống Quản Lý EduLab",
                    "LOCAL"
                );
                userRepository.save(admin);
                System.out.println("✅ Seeded default Admin account: admin@edulab.vn / 123456");
            }

            // Seed Demo Teacher Account
            if (userRepository.findByEmail("teacher@edulab.vn").isEmpty()) {
                User teacher = new User(
                    "u-teacher",
                    "teacher@edulab.vn",
                    "123456",
                    "Thầy Nguyễn Văn A",
                    "TEACHER",
                    "THPT Chuyên Hà Nội - Amsterdam",
                    "LOCAL"
                );
                userRepository.save(teacher);
            }

            // Seed Demo Student Account
            if (userRepository.findByEmail("student@edulab.vn").isEmpty()) {
                User student = new User(
                    "u-student",
                    "student@edulab.vn",
                    "123456",
                    "Học sinh Trần Văn B",
                    "STUDENT",
                    "THCS Lê Quý Đôn",
                    "LOCAL"
                );
                userRepository.save(student);
            }
        };
    }
}
