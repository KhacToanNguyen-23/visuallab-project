# Brainstorm: Thiết Kế Lại Thí Nghiệm Đo Suất Điện Động & Điện Trở Trong (EMF & Internal Resistance Lab)

**Date:** 2026-09-18
**Curriculum:** SGK GDPT 2018 Vật Lý 11 - Chủ đề Dòng Điện Không Đổi (Bài thực hành đo suất điện động và điện trở trong)
**Standards:** `/visuallab-standards`

## Ideas Explored
1. **3D Three.js Studio Scene**: Hộp nguồn pin, biến trở con chạy cơ học trượt dọc thanh điện trở, khóa K bật/đóng mạch điện, Vôn kế và Ampe kế hỗ trợ cả chế độ kim vạch (analog) và hiện số điện tử (digital).
2. **Đồ thị ngoại suy tuyến tính $U = \mathcal{E} - I \cdot r$**: Hồi quy tuyến tính tìm điểm cắt trục $U$ ($\mathcal{E}$) và độ dốc ($-r$) cùng hệ số $R^2$.
3. **3 Nhiệm vụ khảo sát**:
   - M1: Đo Pin đơn 1.5V ($r \approx 0.5\Omega$).
   - M2: Đo Bộ 2 Pin nối tiếp 3.0V ($r \approx 1.0\Omega$).
   - M3: Đo Pin cũ chai ($r \ge 2.5\Omega$).
4. **Worksheet 3 bước chuẩn**: 1. Nhiệm Vụ, 2. Số Liệu (bảng + đồ thị $U-I$), 3. Nộp Bài (Trắc nghiệm GDPT 2018 + Chấm điểm thang 10.0 + Nộp EduLab).

## User's Direction
- Chọn 3D Three.js với hộp pin, biến trở con chạy, Vôn kế, Ampe kế, khóa K.
- Cho phép kéo trực tiếp con chạy biến trở bằng chuột trên 3D hoặc qua slider HUD.
- Hỗ trợ chuyển đổi giữa đồng hồ kim vạch analog và hiển thị số digital.
- Vẽ đồ thị ngoại suy tuyến tính tự động xác định $\mathcal{E}$ và $r$.

## Open Questions for Planning
1. Module structure: `emfInternalREngine.ts`, `EmfInternalRWorkbench3D.tsx`, `EmfInternalRWorkbenchHudDock.tsx`, `EmfInternalRLabWizardWorksheet.tsx`, `EmfInternalRLab.tsx`.
2. Map route `/lab/emf-internal-r` in `main.tsx`.

## Risks
1. Tính ổn định của thuật toán hồi quy tuyến tính khi học sinh chỉ đo ít điểm $\rightarrow$ Cần yêu cầu tối thiểu 3-4 điểm đo ở các giá trị biến trở khác nhau.
