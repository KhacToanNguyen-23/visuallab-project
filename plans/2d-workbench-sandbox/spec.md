# Spec: 2.5D Interactive Physics Workbench Sandbox (NOBOOK-Style Architecture)

**Date:** 2026-09-22  
**Status:** Ready  

---

## Problem Statement
Mô phỏng thí nghiệm hiện tại dùng Three.js/Rapier 3D bị thô sơ về mặt hiển thị, tính chất vật lý hardcode công thức và đòi hỏi phải sửa code thủ công mỗi khi kết nối vật thể. Đặc tả này chuẩn hóa kiến trúc Bàn thực hành 2.5D Canvas Sandbox (phong cách NOBOOK) với cơ chế Cổng kết nối (Apparatus-Port-Socket) kéo thả tự động hút (Magnetic Snap) và tích hợp lõi vi phân Euler-Cromer từ PhET cho học sinh tự do khám phá và thực hành theo SGK GDPT 2018.

---

## User Stories

<!-- P1 = MVP (must ship), P2 = nice-to-have, P3 = future/out-of-scope -->

- **[P1]** As a student, I want to drag apparatus (stands, springs, weights, force meters) from an inventory toolbox onto the canvas workbench so that I can freely set up physics experiments.  
  *Accepted when:* User can drag items from sidebar onto workbench; items render high-resolution SVG sprites at exact dropped coordinates at 60 FPS.

- **[P1]** As a student, I want mass weights and springs to snap together automatically when dragged close ($R \le 25\text{px}$) without writing or modifying code so that they connect naturally like real equipment.  
  *Accepted when:* Dropping a mass weight near a spring hook or another weight's bottom slot creates a physical link, calculates total mass, and causes dynamic extension/oscillation.

- **[P1]** As a student, I want springs and force meters to oscillate and stretch realistically according to Hooke's Law with damping so that I can observe physical harmonic motion and equilibrium.  
  *Accepted when:* Euler-Cromer integration calculates position $x(t)$ with damped vibration $m a = -kx - \gamma v + mg$, settling smoothly at $\Delta l = mg/k$.

- **[P1]** As a teacher or student, I want a curriculum scenario loader for Grade 10 Experiment 38 (Hooke's Law) so that students have predefined stands and springs with a measurement data table.  
  *Accepted when:* Opening Grade 10 Lesson 38 loads the preset workbench state, records $(\Delta l, F)$ across $N \ge 3$ weight additions, and evaluates auto-grading score ($30\% + 40\% + 30\%$).

- **[P2]** As a student, I want a free-floating metric ruler and digital stopwatch on the workbench so that I can measure distances, extension lengths, and oscillation periods manually.  
  *Accepted when:* Ruler tool is draggable, rotatable, and semi-transparent with accurate millimeter markings.

- **[P2]** As a student, I want slow-motion (0.5x, 0.2x) and pause controls so that I can observe fast dynamics and note exact peak amplitude positions.  
  *Accepted when:* Simulation loop can be paused, resumed, and throttled without losing numerical stability.

- **[P3]** _(Out of scope for MVP - Ray optics workbench and DC circuit nodal solver will follow in subsequent phases)._

---

## Functional Requirements

1. **FR-01 (Asset Preloader & Renderer):** Hệ thống nạp và đệm (cache) toàn bộ tài nguyên SVG từ `frontend/src/assets/apparatus/` và kết xuất qua `CanvasRenderingContext2D.drawImage()` với tỷ lệ chuẩn phòng lab.
2. **FR-02 (Apparatus Entity Definition):** Mỗi dụng cụ được khai báo qua interface `LabApparatus` gồm: `id`, `name`, `visualSvg`, `ports` (vị trí $(x,y)$, loại port: `MECHANICAL_HOOK` / `MECHANICAL_SOCKET`), và thông số vật lý ($m, k, \mu, l_0$).
3. **FR-03 (Magnetic Port Snapping):** Khi di chuyển vật $A$ có cổng $P_A$ lại gần cổng tương thích $P_B$ của vật $B$ với khoảng cách Euclidean $d \le 25\text{px}$, hiển thị vòng sáng chỉ thị (glow indicator) và tự động bắt dính khi nhả chuột.
4. **FR-04 (Physics Constraint Solver):** Bộ giải liên kết tự động gộp các vật gắn kết thành cây liên kết (Kinematic tree), tính tổng khối lượng treo $\sum m_i$, lực căng bề mặt $T$, và truyền vào bộ tích phân Euler-Cromer với bước thời gian $\Delta t = 0.016\text{s}$.
5. **FR-05 (Spring Deformation Renderer):** Lò xo xoắn hiển thị biến dạng theo chiều cao thực tế bằng cách vẽ đầu khuyên trên, kéo dãn cuộn xoắn ở giữa theo tỷ lệ $scaleY = (l_0 + \Delta l)/l_0$, và dịch chuyển móc dưới.
6. **FR-06 (Curriculum Scenario Loader):** Chế độ thực hành bài học nạp file JSON định nghĩa sẵn các vật thể ban đầu, khóa các dụng cụ không liên quan trong khay đồ nghề, và mở bảng thu thập số liệu thực nghiệm.
7. **FR-07 (Auto-Grading Integration):** Tính điểm tự động theo chuẩn VisualLab:
   - Thao tác (30%): $N \ge 3$ lần đo, lắp ráp đúng thứ tự.
   - Độ chính xác (40%): Sai số độ cứng $k$ hoặc gia tốc $g$ so với lý thuyết $\le 5\%$.
   - Báo cáo thu hoạch (30%): Trắc nghiệm lý thuyết.

---

## Non-Functional Requirements

- **Performance:** Đạt tốc độ ổn định $60\text{ FPS}$ (khung hình $\le 16.6\text{ms}$) trên màn hình độ phân giải $1080\text{p}$ với ít nhất 15 linh kiện cùng lúc trên bàn thí nghiệm.
- **Visual Quality:** Mọi dụng cụ hiển thị bằng vector SVG độ nét cao (không vỡ hạt khi zoom $200\%$).
- **Numerical Stability:** Bộ giải vi phân Euler-Cromer không bị trôi năng lượng (diverge) sau $600\text{s}$ chạy mô phỏng liên tục.
- **Responsiveness:** Khung bàn thí nghiệm co giãn mượt mà theo kích thước màn hình máy tính để bàn (tối thiểu $1024 \times 600\text{px}$).

---

## Success Criteria

- [ ] Kéo thả tự do các dụng cụ (`VERTICAL_STAND`, `HELICAL_SPRING`, `MASS_WEIGHT_SET`, `SPRING_BALANCE`) từ Toolbox ra Canvas không phát sinh lỗi console.
- [ ] Móc 1, 2, 3 quả cân nối tiếp vào nhau hoặc vào lò xo tự động hút trong bán kính $25\text{px}$ và lò xo dãn chính xác theo tỷ lệ $F = k \Delta l$.
- [ ] Bài thực hành Lớp 10 Bài 38 (Định luật Hooke) ghi nhận đúng số liệu đo và chấm điểm tự động đạt điểm chuẩn khi học sinh thực hiện đo đạc đúng.
- [ ] Không phụ thuộc vào thư viện ngoài nặng nề cho phần render (dùng Canvas 2D + SVG assets thuần).

---

## Out of Scope
- Dựng hình 3D xoay camera tự do bằng Three.js cho các bài bàn thí nghiệm lắp ráp cơ học.
- Phân hệ Quang học (Ray Optics) và Mạch điện (Circuit MNA) — sẽ triển khai ở giai đoạn tiếp theo.

---

## Assumptions
- Người dùng / Designer sẽ cung cấp hoặc tải các file vector SVG theo danh sách chuẩn hóa được liệt kê trong báo cáo Brainstorm.
- Trình duyệt mục tiêu hỗ trợ HTML5 Canvas 2D và Web APIs tiêu chuẩn (Chrome, Edge, Firefox, Safari hiện đại).
