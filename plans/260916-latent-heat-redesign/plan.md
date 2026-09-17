# Kế Hoạch Triển Khai: Redesign Thí Nghiệm Nhiệt Nóng Chảy Riêng 3D (Vật Lý 12)

Mode: Hard  
Risk: normal — multi-component frontend simulation and worksheet with state sync, fully testable, zero backend breaking change.  
Spec: [plans/latent-heat-redesign/spec.md](file:///d:/6_OJT/EduLab/plans/latent-heat-redesign/spec.md)  
Brainstorm: [plans/reports/260916-latent-heat-redesign-brainstorm.md](file:///d:/6_OJT/EduLab/plans/reports/260916-latent-heat-redesign-brainstorm.md)

---

## 1. Tổng Quan Kiến Trúc

Nâng cấp bài thực hành `/lab/latent-heat` đạt chuẩn `/visuallab-standards` bao gồm:
1. **Engine nhiệt học (`latentHeatLabEngine.ts`)**: Tính toán $t_{cb}$, nhiệt lượng tỏa ra và thu vào, phân tích sai số $\lambda$, sinh dữ liệu cân bằng nhiệt $T(t)$.
2. **Bàn thí nghiệm 3D Three.js (`LatentHeatWorkbench3D.tsx` & `LatentHeatWorkbenchHudDock.tsx`)**: Bình nhiệt lượng kế 3D, nước ấm, đá viên tan dần, que khuấy, nhiệt kế số LED, cân điện tử.
3. **Phiếu thực hành Wizard 3 Bước (`LatentHeatLabWizardWorksheet.tsx`)**:
   - Bước 1: 3 Nhiệm vụ đề bài khối lượng đá ($m_{\text{đá}} = 20\text{g}, 35\text{g}, 50\text{g}$).
   - Bước 2: Bảng đo số liệu, tính $\lambda$, sai số $\Delta \lambda$, nhận xét hiện tượng của học sinh.
   - Bước 3: Đồ thị $T(t)$, 3 câu trắc nghiệm SGK GDPT 2018, nút "Nộp Bài & Tính Điểm Thí Nghiệm".
4. **Auto-Grading & Nộp Bài**:
   - Chấm điểm 3 tầng: Thao tác (3.0đ) + Sai số (4.0đ) + Trắc nghiệm (3.0đ) $\to$ Thang 10.0.
   - Đăng ký `sim-latent-heat` trong `worksheetSchemas.ts` và `FloatingAssignmentDrawer.tsx`.

---

## 2. Các Phase Thực Hiện

- [Phase 1: Physics Engine & Worksheet Schema Registration](file:///d:/6_OJT/EduLab/plans/260916-latent-heat-redesign/phase-01-engine-and-schema.md)
- [Phase 2: 3D Three.js Parameter Studio & HUD Dock](file:///d:/6_OJT/EduLab/plans/260916-latent-heat-redesign/phase-02-workbench-3d.md)
- [Phase 3: 3-Step Wizard Worksheet & 3-Tier Auto-Grading Engine](file:///d:/6_OJT/EduLab/plans/260916-latent-heat-redesign/phase-03-wizard-worksheet.md)
- [Phase 4: Main Lab Integration, Drawer Sync & Verification](file:///d:/6_OJT/EduLab/plans/260916-latent-heat-redesign/phase-04-integration-and-verification.md)
