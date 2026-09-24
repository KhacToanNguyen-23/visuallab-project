# Brainstorm Report: Chuẩn Hóa 5 Bài Cơ Học Lớp 10 & Giới Hạn Hộp Dụng Cụ Theo Bài

**Ngày thực hiện:** 2026-09-22  
**Chủ đề:** Chuẩn hóa chuyên sâu 5 bài thực hành Cơ học Lớp 10 theo chuẩn [DacTa.md](file:///d:/Project/FptProject/visuallab-project/DacTa.md) và phân định quyền hiển thị dụng cụ (Bài học cố định vs Sandbox tự do).

---

## 1. Quyết định kiến trúc chính

1. **Giới hạn Hộp Dụng Cụ theo Kịch Bản (Lab-Specific Toolbox):**
   - Khi ở chế độ **Bài học cố định** (`/lab/curriculum/:labId`): Khay `ToolboxDrawer` chỉ hiển thị chính xác các dụng cụ thuộc `scenario.toolIds` của bài đó (theo bảng [DacTa.md](file:///d:/Project/FptProject/visuallab-project/DacTa.md)), giúp học sinh không bị xao nhãng hoặc kéo nhầm dụng cụ không liên quan.
   - Khi ở chế độ **Thực hành tự do** (`/workbench` hoặc `/workbench/universal`): Mở khóa toàn bộ 30+ dụng cụ trên tất cả các phân môn (Cơ, Điện, Quang, Nhiệt).

2. **Bộ Lõi Động Học Cơ Học 2.5D (Unified 2.5D Mechanics Engine):**
   - Mở rộng từ bộ giải động học và `EulerCromerSolver`:
     - **Bài 6 (Đo tốc độ máng nghiêng):** Bi lăn có gia tốc $a = g\sin\alpha - \mu g\cos\alpha$. Đi qua cổng quang $A, B$ kích hoạt xung ngắt trên `DIGITAL_TIMER`.
     - **Bài 14 (Rơi tự do):** Nam châm điện `ELECTROMAGNET` nhả bi thép, chuyển động rơi tự do $v = gt$, $s = \frac{1}{2}gt^2$, ngắt cổng quang chốt thời gian rơi $t$.
     - **Bài 21 (Ma sát trượt):** Khối gỗ `WOODEN_BLOCK` liên kết với lực kế `SPRING_BALANCE`. Kéo trượt đều đo $F_{ms} = \mu N$; tăng quả cân gia tải $N = mg$ làm $F_{ms}$ tăng tuyến tính.
     - **Bài 30 (Va chạm đệm khí):** Hai xe trượt `GLIDER_CAR` trên máng đệm khí `AIR_TRACK_BASE`, bảo toàn động lượng $m_1 v_1 + m_2 v_2 = m_1 v'_1 + m_2 v'_2$ khi qua 2 cổng quang.
     - **Bài 38 (Định luật Hooke):** Lò xo xoắn `HELICAL_SPRING` treo quả cân gia tải `MASS_WEIGHT_SET` dao động tắt dần theo Euler-Cromer và hội tụ tại vị trí cân bằng $\Delta l = \frac{mg}{k}$.

3. **Kiểm kê & Vẽ SVG độ nét cao cho Tool IDs Cơ học:**
   - Bổ sung định dạng SVG sprite cho: `AIR_TRACK_BASE`, `GLIDER_CAR`, `ELECTROMAGNET`, `WOODEN_BLOCK`, `SPRING_BALANCE`.

---

## 2. Lộ trình thực hiện đề xuất ($bb-plan)
- **Phase 1:** Toolbox Drawer Filtering (Lọc dụng cụ theo `scenario.toolIds` trong Guided Lab & mở toàn bộ trong Sandbox).
- **Phase 2:** Mechanics Kinematics & Collision Solver (Máng nghiêng, rơi tự do, ma sát trượt, va chạm đệm khí).
- **Phase 3:** High-Resolution SVG Sprites cho trọn bộ 5 bài Cơ học Lớp 10.
- **Phase 4:** Tích hợp telemetry tự động đổ số liệu đo đạc vào `DataTablePanel` và chấm điểm Auto-Grading (30% + 40% + 30%).
