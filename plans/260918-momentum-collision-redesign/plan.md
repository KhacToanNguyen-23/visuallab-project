# Plan: Tái Cấu Trúc Thí Nghiệm Va Chạm & Bảo Toàn Động Lượng (Momentum Collision Lab)

**Module**: `/lab/momentum-collision` (SGK Vật lý 10 GDPT 2018 - Động lượng & Định luật bảo toàn động lượng)  
**Spec**: [spec.md](file:///d:/6_OJT/EduLab/plans/momentum-collision-redesign/spec.md)  
**Standard**: `/visuallab-standards`  
**Mode**: normal  
**Risk**: normal — Multi-component frontend lab upgrade, zero backend schema risk

---

## 1. Overview & Architecture

Thiết kế lại toàn bộ mô-đun `/lab/momentum-collision` theo chuẩn của **Boyle - Mariotte**, **Latent Heat**, và **Induction**:
- **3D Three.js Parameter Studio**: Máng đệm không khí (Air Track) nằm ngang, 2 xe trượt $G_1, G_2$ có cờ chắn sáng $d = 2\text{ cm}$, quả cân gắn thêm ($m_1, m_2 \in [100\text{g}, 300\text{g}]$), thanh kéo lò xo phóng xe $1$ ($v_0 \in [0.5, 2.0]\text{ m/s}$), 2 cổng quang điện và đồng hồ kỹ thuật số LED 3D đặt trực tiếp trên mặt bàn thí nghiệm.
- **HUD Dock**: Điều chỉnh khối lượng $m_1, m_2$, chế độ va chạm Đàn hồi / Mềm, thanh trượt lực phóng lò xo, nút "▶ Phóng Xe 1", "↺ Đặt Lại", "+ Ghi Số Liệu".
- **3-Step Wizard Worksheet**: 3 nhiệm vụ đề bài độc lập, bảng số liệu thực nghiệm, tính toán động lượng $p_{\text{trước}}, p_{\text{sau}}, \delta p\%$, nhận xét thực nghiệm với chips gợi ý nhanh, 3 câu trắc nghiệm SGK.
- **3-Tier Auto Grading & Submission Sync**: Chấm điểm tự động $30\%$ Thao tác $+ 40\%$ Độ chính xác bảo toàn $+ 30\%$ Trắc nghiệm $\to 10.0$, chỉ tính điểm khi nhấn Nộp bài, đồng bộ `FloatingAssignmentDrawer`.

---

## 2. Phase Breakdown

| Phase | Description | Key Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Physics Engine & Worksheet Schemas | `momentumCollisionEngine.ts`, `worksheetSchemas.ts` (`sim-momentum-collision`) |
| **Phase 2** | 3D Three.js Studio & HUD Dock | `MomentumWorkbench3D.tsx`, `MomentumWorkbenchHudDock.tsx` |
| **Phase 3** | 3-Step Wizard Worksheet & SGK Quiz | `MomentumLabWizardWorksheet.tsx` |
| **Phase 4** | Container, Drawer Sync & Verification | `MomentumCollisionLab.tsx`, `FloatingAssignmentDrawer.tsx`, `npm run build` |

---

## 3. Success Criteria & Verification Plan

1. **Vật lý Va chạm**:
   - Vận tốc đo qua cổng quang $v = d / \Delta t$ chính xác.
   - Định luật bảo toàn động lượng thỏa mãn với sai số $\delta p\% \le 5\%$.
   - Va chạm mềm: 2 xe dính nhau di chuyển cùng vận tốc $v' = \frac{m_1 v_1}{m_1 + m_2}$.
2. **Hiển Thị 3D**:
   - Đồng hồ thời gian LED 3D hiển thị rõ nét trên mặt bàn, cập nhật thời gian tức thì khi xe đi qua cổng quang.
   - Thanh trượt lò xo nén lại và bung ra đẩy xe 1 chuyển động 60 FPS mượt mà.
3. **Báo Cáo & Chấm Điểm**:
   - Hoàn thành 3 nhiệm vụ đề bài, nộp bài tính điểm 3 tầng chính xác và đồng bộ Drawer nộp bài tập.
4. **Build**:
   - `npm run build` đạt $0$ lỗi TypeScript/Vite bundle.
