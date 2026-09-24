# Brainstorm: 2.5D Interactive Physics Workbench Sandbox (NOBOOK-Style Architecture)

**Date:** 2026-09-22  
**Status:** Completed  
**Author:** AI Pair Programmer & User  

---

## 1. Ideas Explored

1. **Full 3D Three.js + Rapier3D (Hướng đi cũ - Bị loại bỏ cho Workbench):**
   - *Nhận định:* Three.js là engine game 3D tổng quát, điều khiển camera 3D gây khó khăn cho việc kéo thả, căn chỉnh dây nối và lắp ráp thí nghiệm học đường. Rapier3D thiếu các khái niệm vật lý SGK (cổng quang, mạch điện, đo lực lò xo Hooke). UI/UX demo bị thô và rời rạc.
2. **2.5D Skeuomorphic Canvas Workbench (Kiểu NOBOOK - Được chọn):**
   - *Nhận định:* Giống như mô hình hàng đầu của NOBOOK (physics-en.nobook.com) và PhET Interactive Simulations: Sử dụng mặt bàn 2.5D với hình ảnh dụng cụ vector SVG sắc nét, chân thực, kéo thả chính xác 100% không bị lệch trục không gian 3D.
3. **Apparatus - Port - Socket Connection Architecture:**
   - *Nhận định:* Thay vì viết code kết nối riêng cho từng bài (hardcode), mỗi dụng cụ có các điểm neo (Snap Ports). Khi kéo gần nhau trong bán kính $R \le 25\text{px}$, các vật tự hút (magnetic snap) và tự động tạo ràng buộc vật lý (Joint / Constraint).
4. **Tách biệt UI và Lõi tính toán (Physics Solver):**
   - *UI:* Sử dụng thư viện ảnh Vector SVG cao cấp nạp vào Canvas 2D (phương án Canvas drawImage 60 FPS).
   - *Vật lý:* Tận dụng thuật toán vi phân Euler-Cromer / Verlet từ PhET (`masses-and-springs`) cho dao động cơ học, độ dãn đàn hồi, va chạm và rơi tự do.

---

## 2. User's Direction

- **Chốt phương án A:** Xây dựng Bàn thực hành 2.5D Canvas Workbench trực quan, sắc nét kiểu NOBOOK.
- **Triết lý 2 chế độ:**
  1. **Sandbox Free-Style:** Bàn thực hành tự do, mở khay đồ nghề cho học sinh tự do lấy dụng cụ, móc nối sáng tạo, đo đạc tùy biến.
  2. **Bài học theo giáo trình SGK GDPT 2018:** Kế thừa trực tiếp từ Sandbox, nạp kịch bản (Scenario JSON) định sẵn thiết bị, cung cấp bảng số liệu và thuật toán Auto-Grading (30% Thao tác + 40% Sai số + 30% Trắc nghiệm).
- **Phân hệ ưu tiên:** Cơ học / Động học (Lớp 10) trước mắt $\rightarrow$ Quang học (Ray Optics) $\rightarrow$ Nhiệt học / Sóng $\rightarrow$ Điện học.

---

## 3. Danh Sách File Ảnh Vector SVG Cần Tải / Thiết Kế (Synthesized SVG Asset List)

Để giao diện đạt chuẩn đẹp, chân thực như NOBOOK, đây là danh sách chi tiết các tài nguyên SVG cần chuẩn bị trong thư mục `frontend/src/assets/apparatus/`:

### Nhóm 1: Cơ học & Động học MVP (Ưu tiên số 1)
| Tên File SVG | Mô Tả Thiết Kế | Điểm Neo / Snap Ports |
| :--- | :--- | :--- |
| `vertical_stand_base.svg` | Đế giá đỡ kim loại đúc nặng, có chân đế bọc cao su | Neo cố định mặt bàn |
| `vertical_stand_rod.svg` | Thanh đứng inox mạ crom sáng bóng có vạch chia cm | Trục trượt kẹp |
| `stand_clamp.svg` | Khớp kẹp giá đỡ bằng gang kèm ốc vặn cánh bướm | `mount_socket` (móc treo) |
| `spring_top_ring.svg` | Khuyên treo trên của lò xo | `top_ring` (bắt vào kẹp) |
| `spring_coils.svg` | Thân cuộn lò xo thép đàn hồi (render co dãn theo scaleY) | Thân biến dạng |
| `spring_bottom_hook.svg` | Móc treo dưới của lò xo | `bottom_hook` (móc tải) |
| `mass_50g.svg` | Quả cân đồng thau hình trụ 50g dập chìm chữ "50g" | `top_hook`, `bottom_slot` |
| `mass_100g.svg` | Quả cân đồng thau hình trụ 100g dập chìm chữ "100g"| `top_hook`, `bottom_slot` |
| `mass_200g.svg` | Quả cân đồng thau hình trụ 200g dập chìm chữ "200g"| `top_hook`, `bottom_slot` |
| `spring_balance_body.svg` | Vỏ lực kế mica trong suốt, vạch đo $0 - 5\text{N}$, có khuyên trên | `top_ring` |
| `spring_balance_pointer.svg` | Trục kéo bên trong kèm kim chỉ thị màu đỏ và móc dưới | `bottom_hook` |
| `ruler_metric_1m.svg` | Thước thép hoặc gỗ 100cm có vạch chia milimét sắc nét | Thước đo tự do |
| `inclined_track.svg` | Máng nhôm nghiêng có chân chỉnh góc $0 - 45^\circ$ và vạch đo | Bề mặt ma sát trượt |
| `wooden_block.svg` | Khối gỗ thí nghiệm hình hộp chữ nhật có móc kéo 2 đầu | `front_hook`, `rear_hook` |
| `photogate_sensor.svg` | Cổng quang điện hình chữ U cảm biến hồng ngoại | Kẹp vào máng nghiêng |
| `digital_timer.svg` | Đồng hồ đo thời gian hiện số LED xanh/đỏ ($0.001\text{s}$) | Cổng cắm dây A, B |

### Nhóm 2: Mở rộng sau MVP (Điện & Quang)
| Tên File SVG | Mô Tả Thiết Kế |
| :--- | :--- |
| `dc_battery_pack.svg` | Hộp đựng 2-4 pin AA hoặc nguồn DC có 2 cọc đỏ (+), đen (-) |
| `switch_knife.svg` | Khóa K dạng dao gạt mở/đóng |
| `light_bulb_socket.svg` | Bóng đèn sợi đốt đui gài có tim phát sáng |
| `ammeter_analog.svg` | Ampe kế mặt hiển thị kim đo, thang $0 - 500\text{mA}$ |
| `voltmeter_analog.svg` | Vôn kế mặt hiển thị kim đo, thang $0 - 3\text{V}$ |
| `optical_laser_rgb.svg` | Đèn phát tia laser 1 chùm hoặc 3 chùm tia song song |
| `glass_prism_triangular.svg`| Lăng kính thủy tinh tam giác phản xạ & khúc xạ ánh sáng |
| `glass_convex_lens.svg` | Thấu kính hội tụ mỏng kèm giá đỡ |

---

## 4. Risks & Mitigations

1. **Hiệu năng Canvas khi có nhiều SVG Sprite:**
   - *Risk:* Nạp ảnh liên tục trong vòng lặp render gây tụt FPS.
   - *Mitigation:* Sử dụng cơ chế Preload/Asset Cache (`Map<string, HTMLImageElement>`), chỉ vẽ ảnh đã nạp sẵn trong bộ nhớ RAM.
2. **Độ mượt của lò xo khi co dãn:**
   - *Risk:* Kéo dãn hình ảnh SVG nguyên khối làm bẹt hình móc treo.
   - *Mitigation:* Tách lò xo làm 3 phần: Khuyên trên giữ nguyên tỷ lệ, phần xoắn ở giữa scale dọc theo $\Delta l$, móc dưới dịch chuyển theo tọa độ đuôi lò xo.
3. **Cơ chế Snap bị kẹt hoặc dính nhầm:**
   - *Risk:* Kéo vật thể gần nhiều cổng cùng lúc gây xung đột.
   - *Mitigation:* Bán kính snap nhỏ ($R \le 25\text{px}$), ưu tiên cổng gần nhất theo khoảng cách Euclidean và chỉ cho phép ghép đôi theo đúng loại Port tương thích (`MECHANICAL_HOOK` $\leftrightarrow$ `MECHANICAL_SOCKET`).
