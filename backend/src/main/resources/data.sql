-- Default Accounts Seeder
INSERT INTO users (id, email, password, full_name, role, school, provider)
VALUES 
  ('u-admin', 'admin@edulab.vn', '123456', 'Quản Trị Viên EduLab', 'ADMIN', 'Hệ Thống Quản Lý EduLab', 'LOCAL'),
  ('u-teacher', 'teacher@edulab.vn', '123456', 'Thầy Nguyễn Văn A', 'TEACHER', 'THPT Chuyên Hà Nội - Amsterdam', 'LOCAL'),
  ('u-student', 'student@edulab.vn', '123456', 'Học sinh Trần Văn B', 'STUDENT', 'THCS Lê Quý Đôn', 'LOCAL')
ON CONFLICT (id) DO NOTHING;

-- Default 16 Labs Seeder
INSERT INTO labs (id, title, description, subject, domain, grade, difficulty, route, simulation_type, thumbnail_url, tags, status, created_by, created_at, updated_at)
VALUES
  ('sim-speed-measurement', 'Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng', 'Trang 28 SGK. Đo thời gian bi thép lăn trên máng nghiêng qua 2 cổng quang điện để xác định tốc độ trung bình và gia tốc.', 'Vật lý', 'Cơ Học & Năng Lượng', 'Lớp 10', 'EASY', '/lab/speed-measurement', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T28,Kéo thả,Cổng quang điện', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-free-fall', 'Bài 14: Đo Gia Tốc Rơi Tự Do', 'Trang 57 SGK. Nam châm điện ngắt điện thả bi thép rơi tự do qua cổng quang điện, tự động tính gia tốc g.', 'Vật lý', 'Cơ Học & Năng Lượng', 'Lớp 10', 'MEDIUM', '/lab/free-fall', 'STEP_WORKFLOW', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T57,Kéo thả,Rơi tự do', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-friction-coefficient', 'Bài 21: Đo Hệ Số Ma Sát Trượt', 'Trang 83 SGK. Dùng lực kế kéo khối gỗ gắn quả cân trượt đều trên mặt bàn để đo hệ số ma sát μ.', 'Vật lý', 'Cơ Học & Năng Lượng', 'Lớp 10', 'MEDIUM', '/lab/sliding-friction', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T83,Kéo thả,Lực kế', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-momentum-collision', 'Bài 30: Khảo Sát Động Lượng & Va Chạm', 'Trang 117 SGK. Mô phỏng va chạm 2 xe trượt trên đệm không khí, kiểm chứng định luật bảo toàn động lượng.', 'Vật lý', 'Cơ Học & Năng Lượng', 'Lớp 10', 'HARD', '/lab/momentum-collision', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T117,Tham số,Va chạm', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-hooke-law', 'Bài 38: Độ Biến Dạng Lò Xo (Định Luật Hooke)', 'Trang 148 SGK. Treo quả cân lên lò xo xoắn, đo độ giãn Δl và tính độ cứng k.', 'Vật lý', 'Cơ Học & Năng Lượng', 'Lớp 10', 'EASY', '/lab/spring-mass', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T148,Kéo thả,Hooke', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-simple-pendulum', 'Bài 7: Khảo Sát Dao Động Con Lắc Đơn', 'Trang 29 SGK. Khảo sát chu kỳ T = 2π√(l/g) của con lắc đơn theo chiều dài dây l.', 'Vật lý', 'Cơ Học & Năng Lượng', 'Lớp 11', 'EASY', '/lab/simple-pendulum', 'PHET_EMBED', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T29,Tham số,Con lắc đơn', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-sound-resonance', 'Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)', 'Trang 22 SGK. Mô phỏng 3D ống thủy tinh cộng hưởng âm thanh, nâng hạ cột nước để đo tốc độ truyền âm v.', 'Vật lý', 'Sóng & Âm Học', 'Lớp 11', 'MEDIUM', '/lab/sound-resonance', 'THREE_JS', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T22,Three.js,Tone.js', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-young-interference', 'Bài 12: Đo Bước Sóng Ánh Sáng (Khe Y-âng)', 'Trang 50 SGK. Chiếu laser qua khe kép Y-âng, dùng thước kẹp đo khoảng vân i để tính bước sóng λ.', 'Vật lý', 'Quang Học', 'Lớp 11', 'HARD', '/lab/wave-interference', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T50,Kéo thả,Giao thoa', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-refraction', 'Bài 21: Đo Chiết Suất Của Nước & Khúc Xạ', 'Trang 85 SGK. Chiếu tia laser qua bán trụ thủy tinh để xác định góc khúc xạ r và chiết suất n.', 'Vật lý', 'Quang Học', 'Lớp 11', 'MEDIUM', '/lab/refraction', 'PHET_EMBED', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T85,Tham số,Khúc xạ', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-emf-internal-r', 'Bài 19: Đo Suất Điện Động E & Điện Trở Trong r', 'Trang 76 SGK. Khảo sát đặc tuyến U-I của nguồn Pin DC bằng biến trở con chạy và công tắc.', 'Vật lý', 'Điện & Từ Học', 'Lớp 11', 'MEDIUM', '/lab/emf-internal-r', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T76,Kéo thả,Nguồn pin', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-dc-circuit', 'Mạch Điện Một Chiều & Định Luật Ohm', 'Mô phỏng lắp ráp mạch điện Pin, Điện trở, Ampe kế, Vôn kế và kiểm chứng định luật Ohm I = U / R.', 'Vật lý', 'Điện & Từ Học', 'Lớp 11', 'EASY', '/lab/dc-circuit', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,Canvas,Điện học,Định luật Ohm', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-specific-heat', 'Bài 3: Đo Nhiệt Dung Riêng Của Nước', 'Trang 15 SGK. Dùng dây điện trở đun nước trong bình nhiệt lượng kế, đo công suất P và nhiệt độ T.', 'Vật lý', 'Nhiệt Học', 'Lớp 12', 'MEDIUM', '/lab/specific-heat', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T15,Tham số,Nhiệt học', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-latent-heat', 'Bài 4: Đo Nhiệt Nóng Chảy Nước Đá', 'Trang 19 SGK. Khảo sát quá trình nóng chảy của nước đá bằng bình nhiệt lượng kế và nhiệt kế điện tử.', 'Vật lý', 'Nhiệt Học', 'Lớp 12', 'MEDIUM', '/lab/latent-heat', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T19,Tham số,Nước đá', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-boyle-mariotte', 'Bài 7: Quá Trình Đẳng Nhiệt (Boyle - Mariotte)', 'Trang 30 SGK. Nén piston trong xy-lanh khí và đọc áp kế để kiểm chứng p·V = const.', 'Vật lý', 'Nhiệt Học', 'Lớp 12', 'HARD', '/lab/boyle-mariotte', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T30,Tham số,Đẳng nhiệt', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('sim-electromagnetic-induction', 'Bài 12: Khảo Sát Cảm Ứng Điện Từ', 'Trang 52 SGK. Di chuyển nam châm vĩnh cửu qua cuộn dây cảm ứng để quan sát kim điện kế G lệch.', 'Vật lý', 'Điện & Từ Học', 'Lớp 12', 'MEDIUM', '/lab/induction', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80', 'GDPT 2018,SGK T52,Kéo thả,Cảm ứng từ', 'PUBLISHED', 'u-admin', NOW(), NOW()),
  ('workbench-universal', 'Bàn Thí Nghiệm Tự Do (Universal Sandbox)', 'Tự do chọn và ghép nối các linh kiện PhET SceneryStack thuộc 3 môn Cơ - Điện - Quang.', 'Vật lý', 'Cơ - Điện - Quang', 'Lớp 10 - 12', 'HARD', '/workbench/universal', 'CUSTOM_CANVAS', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', 'Sandbox,PhET,Sáng tạo,Toàn diện', 'PUBLISHED', 'u-admin', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  domain = EXCLUDED.domain,
  grade = EXCLUDED.grade,
  difficulty = EXCLUDED.difficulty,
  route = EXCLUDED.route,
  simulation_type = EXCLUDED.simulation_type,
  thumbnail_url = EXCLUDED.thumbnail_url,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = NOW();
