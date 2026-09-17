# Báo Cáo Brainstorm: Thiết Kế Lại Thí Nghiệm Boyle - Mariotte (Vật Lý 12)

**Ngày thực hiện:** 26/09/2026  
**Chủ đề:** Tái cấu trúc module thí nghiệm Quá trình đẳng nhiệt (Định luật Boyle - Mariotte) theo tiêu chuẩn `/visuallab-standards` & SGK Vật lý 12 GDPT 2018.  
**Trạng thái:** Đã hoàn thành brainstorm, chuyển sang giai đoạn đặc tả (`spec.md`).

---

## 1. Bối cảnh & Mục tiêu

- **Mục tiêu**: Nâng cấp toàn diện bài thực hành `/lab/boyle-mariotte` từ mô hình 2D đơn giản sang **3D Three.js Parameter Studio** với phiếu thực hành dạng **Wizard 3 bước**, tích hợp hệ thống telemetry, tự động chấm điểm theo thang điểm 10 chuẩn `visuallab-standards` (Thao tác 30% - Sai số 40% - Trắc nghiệm 30%), và kết nối trực tiếp với ngăn kéo nộp bài `FloatingAssignmentDrawer`.
- **Chương trình chuẩn**: SGK Vật lý 12 GDPT 2018 - Chủ đề: Khí lý tưởng, Bài thực hành Quá trình đẳng nhiệt (Định luật Boyle).

---

## 2. Kiến trúc & Quyết định Thiết kế

### 2.1. Phân hệ Mô Phỏng 3D (Three.js Workbench Studio)
- **Thiết bị thí nghiệm 3D**:
  - Xi lanh thủy tinh trong suốt có vạch chia thể tích ($V = 10 \div 50\text{ cm}^3$ hoặc $\text{mL}$).
  - Pít-tông kim loại kín khí có thể tịnh tiến mượt mà (điều khiển qua thanh trượt hoặc kéo thả 3D).
  - Đồng hồ đo áp suất (Áp kế Bourdon 3D + Mặt đồng hồ kỹ thuật số LED hiển thị áp suất $p$ theo đơn vị $\text{bar}$ hoặc $\text{kPa}$).
  - Động học phân tử khí: Hiệu ứng hạt phân tử khí lý tưởng 3D chuyển động Brownian và va chạm thành xi lanh; tần suất va chạm và mật độ hạt tăng khi thể tích giảm.
  - Cảm biến nhiệt độ kỹ thuật số ($T = 298\text{ K} = 25^\circ\text{C} = \text{const}$) có đèn báo trạng thái đẳng nhiệt.
- **Tương tác & Telemetry**:
  - Giao tiếp qua `boyleLabEngine.ts` để tính toán chính xác $p = \frac{p_0 \cdot V_0}{V} + \epsilon_{\text{noise}}$ (với nhiễu sai số thực nghiệm thực tế $\pm 0.5\% \div 1.5\%$).
  - Truyền phát sự kiện telemetry (`TELEMETRY_SAMPLE_RECORDED`) cho phiếu thực hành.

### 2.2. Phiếu Báo Cáo Thực Hành Wizard 3 Bước (`BoyleLabWizardWorksheet.tsx`)
- **Bước 1: Chuẩn bị & Dụng cụ thí nghiệm (Equipment Check)**
  - Giới thiệu mục tiêu bài học, nguyên lý định luật Boyle ($p \cdot V = \text{const}$).
  - Danh mục dụng cụ: Xi lanh có chia độ, pít-tông kín, áp kế, cảm biến nhiệt độ.
  - Danh sách kiểm tra trước khi tiến hành (Checklist an toàn và kín khí).
- **Bước 2: Thu thập số liệu & Xử lý sai số (Data Table & Error Processing)**
  - Đo tối thiểu 4 - 5 trạng thái với các giá trị thể tích $V$ khác nhau (ví dụ: $40, 35, 30, 25, 20\text{ cm}^3$).
  - Bảng số liệu tự động/học sinh điền: $V$, $p$, tính tích $p \cdot V$, nghịch đảo $1/V$.
  - Tính giá trị trung bình $\overline{C} = \overline{p \cdot V}$, sai số tuyệt đối $\Delta(pV)$, sai số tương đối $\delta(pV)$.
- **Bước 3: Đồ thị & Trắc nghiệm báo cáo (Graph & Multiple Choice Quiz)**
  - Đồ thị kép: Đường cong đẳng nhiệt Hyperbole $(p - V)$ và đường thẳng tuyến tính qua gốc tọa độ $(p - \frac{1}{V})$.
  - 3 câu hỏi trắc nghiệm kiến thức cốt lõi SGK 12 GDPT 2018:
    1. Bản chất của quá trình đẳng nhiệt và định luật Boyle.
    2. Dạng đồ thị biểu diễn định luật Boyle trong hệ tọa độ $(p, V)$ và $(p, 1/V)$.
    3. Ý nghĩa vật lý khi tích $p \cdot V$ không đổi ở nhiệt độ không đổi.

### 2.3. Công thức Tự Động Chấm Điểm 3 Tầng (`visuallab-standards`)
- **Thao tác thí nghiệm (3.0 điểm)**:
  - Đủ ít nhất 4 lần đo ở các thể tích phân bố đều: 1.5 điểm.
  - Tốc độ nén phù hợp đảm bảo đẳng nhiệt ($T$ ổn định): 1.5 điểm.
- **Độ chính xác & Sai số (4.0 điểm)**:
  - Sai số tương đối của tích $p \cdot V$ nhỏ hơn $5\%$: 2.0 điểm.
  - Tính đúng $\overline{p \cdot V}$ và sai số $\Delta (pV)$: 2.0 điểm.
- **Trắc nghiệm hiểu bài (3.0 điểm)**:
  - 3 câu trắc nghiệm (mỗi câu 1.0 điểm): 3.0 điểm.
- **Tổng điểm**: Thang 10.0. Tự động lưu `edulab_boyle_grade_result` vào `localStorage` và đồng bộ với ngăn kéo `FloatingAssignmentDrawer` để xác nhận nộp bài 1 chạm.

---

## 3. Cấu trúc Thư mục Đề Xuất

```
frontend/src/
├── components/
│   └── simulations/
│       └── boyle-mariotte/
│           ├── BoyleMariotteLab.tsx           # Container chính tích hợp 3D + Wizard
│           ├── BoyleWorkbench3D.tsx           # Canvas Three.js mô phỏng 3D Xi lanh pít-tông
│           ├── BoyleWorkbenchHudDock.tsx      # Thanh công cụ HUD điều khiển tham số
│           ├── BoyleLabWizardWorksheet.tsx    # Phiếu thực hành Wizard 3 bước + Auto-grading
│           ├── boyleLabEngine.ts              # Engine vật lý nhiệt động học & phân tử khí
│           └── DigitalPressureGauge.tsx       # Component đồng hồ áp kế kỹ thuật số
├── utils/
│   └── worksheetSchemas.ts                    # Bổ sung schema sim-boyle-mariotte (LAB_BOYLE_MARIOTTE)
```

---

## 4. Handoff & Bước Tiếp Theo

Tiến hành tạo file đặc tả chi tiết `plans/boyle-mariotte-redesign/spec.md` và chuyển sang lệnh `$bb-plan` để lập kế hoạch triển khai chi tiết.
