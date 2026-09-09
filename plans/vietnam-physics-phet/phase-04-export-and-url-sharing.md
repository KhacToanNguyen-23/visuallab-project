# Phase 4: Export PNG/SVG & State Sharing via URL

**Goal:** Triển khai tính năng chụp ảnh sơ đồ Canvas và mã hóa trạng thái mô phỏng ra URL query string.

---

## Deliverables

1. **PNG/SVG Exporter (`src/utils/exportImage.ts`)**:
   - Cho phép xuất hình ảnh sơ đồ thí nghiệm sắc nét dạng PNG hoặc SVG.
2. **URL State Encoder/Decoder (`src/utils/urlState.ts`)**:
   - Nén trạng thái linh kiện và vị trí trên sơ đồ thành chuỗi nén Base64 trên tham số `?simState=...`.
   - Khôi phục nguyên vẹn mô phỏng khi người dùng mở link chia sẻ.

---

## Tasks

- [ ] Tạo nút Export Screenshot xuất ảnh PNG từ Canvas context.
- [ ] Xây dựng hàm `serializeCircuitState` và `deserializeCircuitState`.
- [ ] Thêm nút "Chia sẻ bài thí nghiệm" (Copy Share Link).
- [ ] Kiểm tra mở thử nghiệm link chia sẻ trên cửa sổ mới.
