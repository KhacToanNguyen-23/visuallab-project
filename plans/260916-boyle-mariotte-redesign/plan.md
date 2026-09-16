# Kế Hoạch Triển Khai: Redesign Thí Nghiệm Boyle - Mariotte 3D (Vật Lý 12)

Mode: Hard  
Risk: normal — multi-component frontend simulation and worksheet with state sync, fully testable, zero backend breaking change.  
Spec: [plans/boyle-mariotte-redesign/spec.md](file:///d:/6_OJT/EduLab/plans/boyle-mariotte-redesign/spec.md)  
Brainstorm: [plans/reports/260916-boyle-mariotte-redesign-brainstorm.md](file:///d:/6_OJT/EduLab/plans/reports/260916-boyle-mariotte-redesign-brainstorm.md)

---

## 1. Tổng Quan Kiến Trúc

Nâng cấp bài thực hành `/lab/boyle-mariotte` đạt chuẩn `/visuallab-standards` bao gồm:
1. **Nhiệt động học & Phân tử Engine (`boyleLabEngine.ts`)**: Tính toán $p(V) = \frac{p_0 V_0}{V}$, tạo độ nhiễu thực tế $\pm 1\%$, phân tích sai số $\Delta (pV)$ và sinh tọa độ các phân tử khí lý tưởng 3D chuyển động nhiệt.
2. **Bàn thí nghiệm 3D Three.js (`BoyleWorkbench3D.tsx` & `BoyleWorkbenchHudDock.tsx`)**: Xi lanh thủy tinh chia vạch, pít-tông di chuyển tịnh tiến, áp kế kim & điện tử, hệ hạt khí va chạm thành bình, thanh công cụ điều khiển thông số.
3. **Phiếu thực hành Wizard 3 Bước (`BoyleLabWizardWorksheet.tsx`)**:
   - Bước 1: Dụng cụ & Chuẩn bị.
   - Bước 2: Bảng thu thập số liệu ($N \ge 4$), tính $\overline{p \cdot V}$, sai số tuyệt đối & tương đối.
   - Bước 3: Đồ thị kép ($p-V$ Hyperbole & $p-1/V$ Tuyến tính) + 3 câu trắc nghiệm SGK GDPT 2018.
4. **Auto-Grading & Nộp bài**:
   - Chấm điểm 3 tầng: Thao tác (3.0đ) + Sai số (4.0đ) + Trắc nghiệm (3.0đ).
   - Đăng ký `sim-boyle-mariotte` trong `worksheetSchemas.ts` và lưu kết quả đồng bộ với `FloatingAssignmentDrawer.tsx` để xác nhận nộp bài 1 chạm.

---

## 2. Các Phase Thực Hiện

- [Phase 1: Physics Engine & Worksheet Schema Registration](file:///d:/6_OJT/EduLab/plans/260916-boyle-mariotte-redesign/phase-01-engine-and-schema.md)
- [Phase 2: 3D Three.js Parameter Studio & HUD Dock](file:///d:/6_OJT/EduLab/plans/260916-boyle-mariotte-redesign/phase-02-workbench-3d.md)
- [Phase 3: 3-Step Wizard Worksheet & 3-Tier Auto-Grading Engine](file:///d:/6_OJT/EduLab/plans/260916-boyle-mariotte-redesign/phase-03-wizard-worksheet.md)
- [Phase 4: Main Lab Integration, Drawer Sync & Verification](file:///d:/6_OJT/EduLab/plans/260916-boyle-mariotte-redesign/phase-04-integration-and-verification.md)

---

## 3. Quản Lý Rủi Ro (Risks & Mitigations)
- **Hiệu năng Three.js với hạt khí 3D**: Sử dụng `InstancedMesh` hoặc `BufferGeometry` điểm với 60-100 phân tử để đảm bảo mượt mà 60fps trên mọi thiết bị.
- **Đồng bộ Telemetry giữa 3D Workbench và Worksheet**: Sử dụng callback state tập trung và Custom Event channel, đảm bảo khi bấm "Ghi số liệu" ở HUD thì Worksheet lập tức nhận đúng cặp $(V, p)$.
- **Xác nhận nộp bài trong Drawer**: Lưu trực tiếp vào `localStorage.getItem('edulab_boyle_grade_result')` đồng bộ hoàn toàn với schema của `FloatingAssignmentDrawer`.
