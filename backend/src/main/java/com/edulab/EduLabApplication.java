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

            // Seed 14 Core Physics Labs SGK GDPT 2018
            if (labRepository.count() < 14) {
                List<Lab> defaultLabs = List.of(
                    // LỚP 10
                    new Lab(
                        "sim-speed-measurement",
                        "Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng",
                        "Trang 28 SGK. Đo thời gian bi thép qua 2 cổng quang điện trên máng nghiêng để tính tốc độ v.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 10",
                        "EASY",
                        "/lab/speed-measurement",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T28,Kéo thả,Cổng quang điện",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-free-fall",
                        "Bài 14: Đo Gia Tốc Rơi Tự Do g",
                        "Trang 57 SGK. Nam châm điện ngắt điện thả bi thép rơi qua cổng quang điện, tự động tính gia tốc g.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 10",
                        "MEDIUM",
                        "/lab/free-fall",
                        "STEP_WORKFLOW",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T57,Kéo thả,Rơi tự do",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-friction-coefficient",
                        "Bài 21: Đo Hệ Số Ma Sát Trượt",
                        "Trang 83 SGK. Dùng lực kế kéo khối gỗ gắn quả cân trượt đều trên mặt bàn để đo hệ số ma sát mu.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 10",
                        "MEDIUM",
                        "/lab/sliding-friction",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T83,Kéo thả,Lực kế",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-momentum-collision",
                        "Bài 30: Khảo Sát Động Lượng & Va Chạm",
                        "Trang 117 SGK. Mô phỏng va chạm 2 xe trượt trên đệm không khí, kiểm chứng định luật bảo toàn động lượng.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 10",
                        "HARD",
                        "/lab/momentum-collision",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T117,Tham số,Va chạm",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-hooke-law",
                        "Bài 38: Độ Giãn Lò Xo (Định Luật Hooke)",
                        "Trang 148 SGK. Treo quả cân lên lò xo xoắn, đo độ giãn delta L và tính độ cứng k.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 10",
                        "EASY",
                        "/lab/spring-mass",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T148,Kéo thả,Hooke",
                        "PUBLISHED",
                        "u-admin"
                    ),

                    // LỚP 11
                    new Lab(
                        "sim-sound-resonance",
                        "Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)",
                        "Trang 22 SGK. Mô phỏng 3D ống thủy tinh cộng hưởng âm thanh, nâng hạ cột nước & loa Tone.js để đo v.",
                        "Vật lý",
                        "Sóng & Âm Học",
                        "Lớp 11",
                        "MEDIUM",
                        "/lab/sound-resonance",
                        "THREE_JS",
                        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T22,Three.js,Tone.js",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-simple-pendulum",
                        "Bài 7: Khảo Sát Dao Động Con Lắc Đơn",
                        "Trang 29 SGK. Khảo sát chu kỳ T = 2pi*sqrt(l/g) của con lắc đơn theo chiều dài l.",
                        "Vật lý",
                        "Cơ Học & Năng Lượng",
                        "Lớp 11",
                        "EASY",
                        "/lab/simple-pendulum",
                        "PHET_EMBED",
                        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T29,Tham số,PhET",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-young-interference",
                        "Bài 12: Đo Bước Sóng Ánh Sáng (Khe Y-âng)",
                        "Trang 50 SGK. Chiếu laser qua khe kép Y-âng, dùng thước kẹp đo khoảng vân i để tính bước sóng lambda.",
                        "Vật lý",
                        "Quang Học",
                        "Lớp 11",
                        "HARD",
                        "/lab/wave-interference",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T50,Kéo thả,Giao thoa",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-emf-internal-r",
                        "Bài 19: Đo Suất Điện Động E & Điện Trở Trong r",
                        "Trang 76 SGK. Khảo sát đồ thị U-I của nguồn Pin DC bằng biến trở con chạy và công tắc.",
                        "Vật lý",
                        "Điện & Từ Học",
                        "Lớp 11",
                        "MEDIUM",
                        "/lab/emf-internal-r",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T76,Kéo thả,Nguồn pin",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-refraction",
                        "Bài 21: Đo Chiết Suất Của Nước & Khúc Xạ",
                        "Trang 85 SGK. Chiếu tia laser qua bán trụ thủy tinh / nước để xác định góc khúc xạ r và chiết suất n.",
                        "Vật lý",
                        "Quang Học",
                        "Lớp 11",
                        "MEDIUM",
                        "/lab/refraction",
                        "PHET_EMBED",
                        "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T85,Tham số,Khúc xạ",
                        "PUBLISHED",
                        "u-admin"
                    ),
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

                    // LỚP 12
                    new Lab(
                        "sim-specific-heat",
                        "Bài 3: Đo Nhiệt Dung Riêng Của Nước",
                        "Trang 15 SGK. Dùng dây điện trở đun nước trong bình nhiệt lượng kế, đo công suất P và nhiệt độ T.",
                        "Vật lý",
                        "Nhiệt Học",
                        "Lớp 12",
                        "MEDIUM",
                        "/lab/specific-heat",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T15,Tham số,Nhiệt học",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-latent-heat",
                        "Bài 4: Đo Nhiệt Nóng Chảy Nước Đá",
                        "Trang 19 SGK. Khảo sát quá trình nóng chảy của nước đá bằng bình nhiệt lượng kế và nhiệt kế điện tử.",
                        "Vật lý",
                        "Nhiệt Học",
                        "Lớp 12",
                        "MEDIUM",
                        "/lab/latent-heat",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T19,Tham số,Nước đá",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-boyle-mariotte",
                        "Bài 7: Quá Trình Đẳng Nhiệt (Boyle - Mariotte)",
                        "Trang 30 SGK. Nén piston trong xy-lanh nén khí và đọc áp kế để kiểm chứng p*V = const.",
                        "Vật lý",
                        "Nhiệt Học",
                        "Lớp 12",
                        "HARD",
                        "/lab/boyle-mariotte",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T30,Tham số,Đẳng nhiệt",
                        "PUBLISHED",
                        "u-admin"
                    ),
                    new Lab(
                        "sim-electromagnetic-induction",
                        "Bài 12: Khảo Sát Cảm Ứng Điện Từ",
                        "Trang 52 SGK. Di chuyển nam châm vĩnh cửu qua cuộn dây cảm ứng để quan sát kim điện kế G lệch.",
                        "Vật lý",
                        "Điện & Từ Học",
                        "Lớp 12",
                        "MEDIUM",
                        "/lab/induction",
                        "CUSTOM_CANVAS",
                        "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500&auto=format&fit=crop&q=60",
                        "GDPT 2018,SGK T52,Kéo thả,Cảm ứng từ",
                        "PUBLISHED",
                        "u-admin"
                    )
                );
                labRepository.saveAll(defaultLabs);
                System.out.println("✅ Seeded 14 SGK GDPT 2018 physics labs into database table with dedicated routes");
            }
        };
    }
}
