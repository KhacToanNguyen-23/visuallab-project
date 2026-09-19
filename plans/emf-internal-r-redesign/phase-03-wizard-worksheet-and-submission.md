# Phase 3: Wizard Worksheet & Integration (Đo Suất Điện Động & Điện Trở Trong)

**Goal:** Xây dựng phiếu báo cáo 3-tab Wizard Worksheet, vẽ đồ thị ngoại suy tuyến tính $U = \mathcal{E} - I \cdot r$, tích hợp trắc nghiệm GDPT 2018 và kết nối route `/lab/emf-internal-r`.

## Deliverables
- `frontend/src/components/simulations/emf-internal-r/EmfInternalRLabWizardWorksheet.tsx`:
  - Tab 1: 3 Thẻ nhiệm vụ trực quan, huy hiệu trạng thái & nút ghi nhận số liệu.
  - Tab 2: Bảng số liệu $(R, I, U)$ & Đồ thị phân tán $U - I$ có đường hồi quy tuyến tính $U = \mathcal{E} - I \cdot r$ hiển thị $\mathcal{E}, r, R^2$.
  - Tab 3: 3 câu trắc nghiệm GDPT 2018, bảng điểm tự động thang 10.0 và nộp bài EduLab.
- `frontend/src/components/simulations/emf-internal-r/EmfInternalRLab.tsx`: Component container điều phối toàn bộ luồng.
- `frontend/src/main.tsx`: Cập nhật route `/lab/emf-internal-r` trỏ sang `EmfInternalRLab`.
