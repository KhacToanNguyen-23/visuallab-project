package com.edulab;

import com.edulab.model.Lab;
import com.edulab.model.User;
import com.edulab.repository.LabRepository;
import com.edulab.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class EduLabApplication {
    public static void main(String[] args) {
        SpringApplication.run(EduLabApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDefaultAccounts(UserRepository userRepository, LabRepository labRepository) {
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

            // Seed Initial 6 Core Physics Labs
            if (labRepository.count() == 0) {
                List<Lab> defaultLabs = List.of(
                    new Lab(
                        "sim-dc-circuit",
                        "Mạch Điện Đơn Giản & Định Luật Ohm",
                        "Mô phỏng lắp mạch Pin, Điện trở, Ampe kế, Vôn kế. Ghi nhận dòng điện & hiệu điện thế.",
                        "Vật lý",
                        "Điện & Từ Học",
                        "Lớp 11",
                        "EASY",
                        "/lab/dc-circuit",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,Canvas,Điện học",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-emf-internal-r",
                        "Đo Suất Điện Động E & Điện Trở Trong r",
                        "Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy.",
                        "Vật lý",
                        "Điện & Từ Học",
                        "Lớp 11",
                        "MEDIUM",
                        "/lab/emf-internal-r",
                        "PHET_EMBED",
                        "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,Nguồn pin,Biến trở",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-free-fall",
                        "Đo Gia Tốc Rơi Tự Do g",
                        "Bi sắt rơi qua cổng quang điện, đo thời gian t và tự động tính gia tốc g.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 10",
                        "MEDIUM",
                        "/lab/free-fall",
                        "STEP_WORKFLOW",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,Cổng quang điện,PDF Report",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-simple-pendulum",
                        "Con Lắc Đơn & Dao Động Điều Hòa",
                        "Khảo sát chu kỳ dao động T = 2pi*sqrt(l/g) của con lắc đơn.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 11",
                        "EASY",
                        "/lab/simple-pendulum",
                        "PHET_EMBED",
                        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,Con lắc đơn,PhET",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-spring-mass",
                        "Khảo Sát Con Lắc Lò Xo",
                        "Khảo sát định luật Hooke và dao động điều hòa của con lắc lò xo.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 12",
                        "MEDIUM",
                        "/lab/spring-mass",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,Lò xo,Hooke",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-refraction",
                        "Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ",
                        "Chiếu laser qua môi trường chiết suất n1, n2 và xác định góc khúc xạ.",
                        "Vật lý",
                        "Quang Học",
                        "Lớp 11",
                        "HARD",
                        "/lab/refraction",
                        "PHET_EMBED",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,Laser,Thấu kính",
                        "PUBLISHED",
                        "u-admin"
                    )
                );
                labRepository.saveAll(defaultLabs);
                System.out.println("✅ Seeded 6 core physics labs into PostgreSQL 'labs' table with dedicated routes");
            }
        };
    }
}
