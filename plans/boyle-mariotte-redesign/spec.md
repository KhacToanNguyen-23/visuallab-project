# Đặc Tả Kỹ Thuật (Spec): Thiết Kế Lại Thí Nghiệm Boyle - Mariotte 3D

**Mã bài thí nghiệm:** `sim-boyle-mariotte`  
**Tiêu chuẩn áp dụng:** `/visuallab-standards` & SGK Vật lý 12 GDPT 2018 (Chủ đề Khí lý tưởng - Định luật Boyle)  
**Mục đích:** Đặc tả kiến trúc, luồng dữ liệu, công thức vật lý, tiêu chí chấm điểm và tích hợp nộp bài cho module thí nghiệm Boyle - Mariotte.

---

## 1. Yêu Cầu Chức Năng (Functional Requirements)

### 1.1. Bàn Thí Nghiệm 3D (Three.js Workbench Studio)
1. **Thiết bị mô phỏng 3D**:
   - Khối xi lanh trong suốt nằm ngang/đứng, có các vạch chia vạch $10 \div 50\text{ cm}^3$.
   - Pít-tông kim loại kín khí di chuyển êm ái theo vị trí thể tích $V$.
   - Đồng hồ áp suất số + cơ khí (Áp kế Bourdon 3D) chỉ áp suất $p$ (đơn vị: $\text{bar}$ hoặc $\text{kPa}$).
   - Mô phỏng động học phân tử: Hệ thống hạt khí 3D chuyển động hỗn loạn nhiệt, va chạm đàn hồi với thành bình và pít-tông. Mật độ và tần suất va chạm tỷ lệ nghịch với thể tích $V$.
   - Màn hình thông số HUD: Hiển thị $V$, $p$, $T$ ($25^\circ\text{C}$ cố định), nút Nén nhanh, Nén chậm, Đặt lại, và Ghi số liệu vào bảng.

2. **Mô hình tính toán vật lý (`boyleLabEngine.ts`)**:
   - Trạng thái ban đầu: $V_0 = 40\text{ cm}^3$, $p_0 = 1.0\text{ bar}$.
   - Định luật Boyle: $p(V) = \frac{p_0 \cdot V_0}{V} \cdot (1 + \delta_{\text{noise}})$ với sai số thực nghiệm ngẫu nhiên nhỏ $\delta_{\text{noise}} \in [-0.015, +0.015]$.
   - Nghịch đảo thể tích: $x = \frac{1}{V}\text{ (cm}^{-3}\text{)}$.

---

### 1.2. Phiếu Thực Hành Wizard 3 Bước (`BoyleLabWizardWorksheet.tsx`)

#### Bước 1: Dụng Cụ & Chuẩn Bị (Apparatus & Checklist)
- Giới thiệu mục tiêu bài học: Khảo sát mối quan hệ giữa áp suất $p$ và thể tích $V$ của một lượng khí xác định ở nhiệt độ không đổi.
- Checklist kiểm tra thiết bị:
  - [x] Xi lanh chia độ kín khí
  - [x] Áp kế kết nối với khoang khí
  - [x] Pít-tông di chuyển trơn tru
  - [x] Cảm biến nhiệt độ duy trì trạng thái đẳng nhiệt

#### Bước 2: Thu Thập Số Liệu & Xử Lý Sai Số (Data & Error Processing)
- Bảng số liệu tối thiểu 4-5 lần đo:
  | Lần đo | Thể tích $V\text{ (cm}^3\text{)}$ | Áp suất $p\text{ (bar)}$ | Tích $p \cdot V\text{ (bar}\cdot\text{cm}^3\text{)}$ | Nghịch đảo $1/V\text{ (cm}^{-3}\text{)}$ | Sai số tuyệt đối $|pV - \overline{pV}|$ |
  | :--- | :--- | :--- | :--- | :--- | :--- |
- Nút "Ghi số liệu từ bàn thí nghiệm 3D": Tự động lấy giá trị $V, p$ từ workbench hoặc cho phép nhập tay.
- Khu vực tính toán kết quả:
  - Giá trị trung bình: $\overline{C} = \overline{p \cdot V} = \frac{1}{N} \sum_{i=1}^N (p_i \cdot V_i)$
  - Sai số tuyệt đối trung bình: $\overline{\Delta (pV)} = \frac{1}{N} \sum_{i=1}^N |p_i V_i - \overline{pV}|$
  - Sai số tỉ đối: $\delta(pV) = \frac{\overline{\Delta (pV)}}{\overline{pV}} \times 100\%$

#### Bước 3: Đồ Thị & Trắc Nghiệm Báo Cáo (Graph & Quiz Assessment)
- **Đồ thị tương tác**:
  - Đồ thị 1: $p$ theo $V$ $\to$ Đường cong Hyperbole đẳng nhiệt.
  - Đồ thị 2: $p$ theo $1/V$ $\to$ Đường thẳng tuyến tính đi qua gốc tọa độ ($p = C \cdot \frac{1}{V}$).
- **3 Câu hỏi trắc nghiệm SGK GDPT 2018**:
  1. *Câu 1:* Quá trình biến đổi trạng thái của một lượng khí xác định khi nhiệt độ không đổi được gọi là:
     - A. Quá trình đẳng áp
     - B. **Quá trình đẳng nhiệt (Đúng)**
     - C. Quá trình đẳng tích
     - D. Quá trình đoạn nhiệt
  2. *Câu 2:* Trong hệ toạ độ $(p, 1/V)$, đường đẳng nhiệt có dạng là:
     - A. Đường cong Hyperbole
     - B. **Đường thẳng kéo dài đi qua gốc toạ độ (Đúng)**
     - C. Đường thẳng song song trục hoành
     - D. Đường tròn
  3. *Câu 3:* Khi nén đẳng nhiệt một khối khí lý tưởng làm thể tích giảm đi 2 lần thì áp suất của khối khí sẽ:
     - A. Giảm đi 2 lần
     - B. **Tăng lên 2 lần (Đúng)**
     - C. Không đổi
     - D. Tăng lên 4 lần

---

### 1.3. Công Thức Tự Động Chấm Điểm 3 Tầng (Auto-Grading Formula)

Theo chuẩn `/visuallab-standards`:
$$\text{Total Score} = \text{Score}_{\text{Thao tác}} (30\%) + \text{Score}_{\text{Sai số}} (40\%) + \text{Score}_{\text{Trắc nghiệm}} (30\%)$$

1. **Điểm Thao Tác ($\max = 3.0$ điểm)**:
   - Thu thập đủ $\ge 4$ mẫu đo khác nhau: $+1.5$ điểm.
   - Thể tích trải rộng tối thiểu $15\text{ cm}^3$ giữa giá trị lớn nhất và nhỏ nhất: $+1.5$ điểm.
2. **Điểm Sai Số ($\max = 4.0$ điểm)**:
   - Sai số tương đối $\delta(pV) \le 5\%$: $+2.0$ điểm (nếu $\le 10\%$: $+1.0$ điểm).
   - Điền/Tính đúng giá trị $\overline{p \cdot V}$ và sai số trong biên độ cho phép: $+2.0$ điểm.
3. **Điểm Trắc Nghiệm ($\max = 3.0$ điểm)**:
   - Mỗi câu đúng: $+1.0$ điểm $\times 3$ câu $= 3.0$ điểm.
4. **Tiêu chuẩn Đạt (Pass/Fail)**:
   - $\text{Total Score} \ge 5.0 / 10.0 \implies \text{ĐẠT YÊU CẦU}$.

---

### 1.4. Tích Hợp Nộp Bài & Lưu Kết Quả

- Kết quả chấm điểm được lưu vào `localStorage.setItem('edulab_boyle_grade_result', JSON.stringify({ result, details }))`.
- Tương thích hoàn toàn với `FloatingAssignmentDrawer.tsx` và `StudentLabAssignmentView.tsx`.
- Khi học sinh bấm mở ngăn kéo nộp bài hoặc bấm "Nộp bài", hệ thống tự động tải điểm số (Thao tác, Sai số, Trắc nghiệm, Tổng điểm) và nộp lên Backend API `/api/student/assignments/{id}/submit`.

---

## 2. Kế Hoạch File Triển Khai

| File | Hành động | Mục đích |
| :--- | :--- | :--- |
| `frontend/src/utils/worksheetSchemas.ts` | MODIFY | Đăng ký schema `sim-boyle-mariotte` (`LAB_BOYLE_MARIOTTE`) |
| `frontend/src/components/assignment/FloatingAssignmentDrawer.tsx` | MODIFY | Hỗ trợ đọc kết quả lưu của `sim-boyle-mariotte` |
| `frontend/src/components/simulations/boyle-mariotte/boyleLabEngine.ts` | NEW | Engine vật lý phân tử khí, định luật Boyle và tính toán sai số |
| `frontend/src/components/simulations/boyle-mariotte/BoyleWorkbench3D.tsx` | NEW | Môi trường 3D Three.js: Xi lanh, pít-tông, áp kế, hạt khí chuyển động nhiệt |
| `frontend/src/components/simulations/boyle-mariotte/BoyleWorkbenchHudDock.tsx` | NEW | Thanh điều khiển tham số HUD cho phòng thí nghiệm 3D |
| `frontend/src/components/simulations/boyle-mariotte/BoyleLabWizardWorksheet.tsx` | NEW | Phiếu thực hành Wizard 3 bước chuẩn GDPT 2018 + Auto-grading |
| `frontend/src/components/simulations/boyle-mariotte/BoyleMariotteLab.tsx` | NEW | Container tích hợp 3D Studio và Wizard Worksheet |
| `frontend/src/components/simulations/BoyleMariotteLab.tsx` | MODIFY | Forward / Re-export sang module mới |

---

## 3. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
1. **Giao diện 3D**: Chạy mượt mà, xoay OrbitControls, xi lanh pít-tông co giãn chính xác theo $V$, áp kế hiển thị số $p$ nhảy theo $1/V$, hạt khí chuyển động và đổi mật độ tương ứng.
2. **Worksheet Wizard 3 bước**: Chuyển bước mượt mà, ghi số liệu tự động từ 3D workbench, tính đúng $p \cdot V$, vẽ 2 đồ thị ($p-V$ và $p-1/V$).
3. **Chấm điểm & Nộp bài**: Chấm chính xác điểm Thao tác (3đ), Sai số (4đ), Trắc nghiệm (3đ). Khi mở Drawer nộp bài, hiện ngay huy hiệu Đạt/Điểm số và xác nhận nộp thành công về backend.
