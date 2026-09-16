# Plan: Tái Cấu Trúc Thí Nghiệm Ảo Cảm Ứng Điện Từ (Induction Lab Redesign)

**Module**: `/lab/induction` (SGK Vật lý 12 GDPT 2018 - Cảm ứng điện từ & Định luật Faraday - Lenz)  
**Spec**: [spec.md](file:///d:/6_OJT/EduLab/plans/induction-lab-redesign/spec.md)  
**Standard**: `/visuallab-standards`  
**Mode**: normal  
**Risk**: normal — Multi-component frontend lab upgrade, zero backend schema risk

---

## 1. Overview & Architecture

Thiết kế lại toàn bộ mô-đun `/lab/induction` theo chuẩn của **Boyle - Mariotte** và **Latent Heat**:
- **3D Three.js Parameter Studio**: Cuộn dây Solenoid ($N = 100, 200, 400$), thanh nam châm N-S kéo thả chuột tự do hoặc chuyển động bước tự động, đường sức từ 3D động, đèn LED phát sáng theo dòng cảm ứng.
- **Hybrid Meters Display**: Điện kế Galvanometer kim lệch tức thời theo chiều dòng điện cảm ứng kết hợp Màn hình số LED hiển thị $e_c$ (mV).
- **HUD Dock**: Điều chỉnh số vòng $N$, nút Đảo Cực (Flip Pole), nút Đưa Vào / Rút Ra tự động, Đặt Lại, Ghi Số Liệu.
- **3-Step Wizard Worksheet**: 3 nhiệm vụ đề bài độc lập, bảng số liệu, kiểm chứng Faraday/Lenz, nhận xét thực nghiệm với chips gợi ý nhanh, 3 câu trắc nghiệm SGK.
- **3-Tier Auto Grading & Submission Sync**: Chấm điểm tự động $30\%$ Thao tác $+ 40\%$ Độ chính xác định luật $+ 30\%$ Trắc nghiệm $\to 10.0$, chỉ tính điểm khi nhấn Nộp bài, đồng bộ `FloatingAssignmentDrawer`.

---

## 2. Phase Breakdown

| Phase | Description | Key Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Physics Engine & Worksheet Schemas | `inductionLabEngine.ts`, `worksheetSchemas.ts` (`sim-induction`) |
| **Phase 2** | 3D Three.js Studio & HUD Dock | `InductionWorkbench3D.tsx`, `InductionWorkbenchHudDock.tsx` |
| **Phase 3** | 3-Step Wizard Worksheet & SGK Quiz | `InductionLabWizardWorksheet.tsx` |
| **Phase 4** | Container, Drawer Sync & Verification | `InductionLab.tsx`, `FloatingAssignmentDrawer.tsx`, `npm run build` |

---

## 3. Success Criteria & Verification Plan

1. **Vật lý Faraday - Lenz**:
   - $e_c = -N \frac{\Delta \Phi}{\Delta t}$ phản hồi nhạy bén và tức thời khi di chuyển nam châm qua cuộn dây.
   - Khi nam châm dừng ($v = 0$), $e_c = 0$ và kim điện kế trở về 0.
   - Khi đảo cực, dấu của $e_c$ và chiều lệch kim đảo ngược.
2. **Kéo thả chuột**:
   - Kéo chuột mượt mà 60 FPS, không gây xung đột với OrbitControls.
3. **Chấm điểm & Nộp bài**:
   - Hoàn thành 3 nhiệm vụ đề bài, nộp bài tính điểm 3 tầng chính xác và đồng bộ Drawer nộp bài tập.
4. **Build**:
   - `npm run build` đạt $0$ lỗi TypeScript/Vite bundle.
