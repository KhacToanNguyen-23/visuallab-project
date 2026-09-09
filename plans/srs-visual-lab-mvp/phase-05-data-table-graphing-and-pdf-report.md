# Phase 5: Data Table, Automatic Graphing & PDF Report Exporter

**Goal:** Hoàn thiện bảng số liệu tự động tính sai số chuẩn SGK, đồ thị trực quan và xuất file PDF bản tường trình thực hành A4.

---

## Deliverables

1. **`DataTableAndGraph.tsx`**: Bảng điền số liệu đo, tự động tính $\bar{A}$, $\Delta A$, $\delta\%$ và vẽ đồ thị xu hướng ($s - t^2$, $U - I$).
2. **`pdfExport.ts`**: Xuất bản tường trình thực hành PDF khổ A4 đúng mẫu chuẩn GDPT 2018.

---

## Tasks

- [ ] Xây dựng `DataTableAndGraph.tsx` kiểm tra giá trị nhập hợp lệ và vẽ đồ thị.
- [ ] Lập công thức tính sai số tuyệt đối và sai số dụng cụ theo chuẩn SGK.
- [ ] Viết module `pdfExport.ts` sinh file PDF Bản tường trình thực hành khổ A4.
