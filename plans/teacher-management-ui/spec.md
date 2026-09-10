# Spec: Full-Width Zero-Emoji Platform Redesign

**Date:** 2026-09-09  
**Status:** Approved  

---

## Problem Statement
Trang Dashboard và Thư viện Thí nghiệm hiện tại có 3 vấn đề lớn:
1. Cột Sidebar bên trái (`SidebarNav`) chiếm 256px diện tích không cần thiết, làm hẹp không gian chính.
2. Bộ lọc `KHỐI LỚP` (Lớp 10, 11, 12) vẫn còn hiển thị rườm rà.
3. Thư viện bài thí nghiệm bên dưới vẫn dùng dạng Thẻ Card cồng kềnh.

Cần chuyển toàn bộ giao diện sang **Màn hình Tràn Viền (Full-Width)**, loại bỏ cột trái, xóa bộ lọc Khối Lớp, và chuyển toàn bộ Thư viện Thí nghiệm sang dạng **Bảng dữ liệu nén mật độ cao (High-Density Table)**.

---

## User Stories

- **[P1]** As a User, I want a full-width header navigation without a left sidebar so that 100% of horizontal space is dedicated to data and tools.  
  *Accepted when:* Loại bỏ `SidebarNav`, chuyển logo và điều hướng lên Header thanh ngang 100% full-width.

- **[P1]** As a User, I want the filter bar to remove grade-level groupings so that filtering focuses purely on Physics Knowledge Domains.  
  *Accepted when:* Dòng `KHỐI LỚP` bị xóa hoàn toàn khỏi `PhETFilterBar`, chỉ còn thanh Tìm kiếm và bộ lọc Mạch Kiến Thức.

- **[P1]** As a User, I want the Simulation Library to render in a High-Density Table so that I can see 10-15 experiments per screen.  
  *Accepted when:* Thẻ Card thí nghiệm được thay bằng Bảng phẳng (`Mạch Kiến Thức | Tên Bài | Mô Tả | [Khởi Chạy →]`).

---

## Functional Requirements

1. **FR-01 (Full-Width Layout):** Xóa `SidebarNav` 256px, đưa navigation lên Header 100% full-width.
2. **FR-02 (PhET Filter Simplification):** Xóa bộ lọc `KHỐI LỚP`, chỉ giữ lọc theo Mạch Kiến Thức (`[ĐIỆN HỌC]`, `[CƠ HỌC]`, `[SÓNG - NHIỆT]`, `[QUANG HỌC]`).
3. **FR-03 (High-Density Simulation Table):** Thay thế `<SimCard>` grid bằng `<table className="w-full text-left text-xs">`.

---

## Success Criteria

- [ ] 100% chiều rộng màn hình được khai thác (không có sidebar bên trái).
- [ ] 0 bộ lọc khối lớp rườm rà.
- [ ] Thư viện bài thí nghiệm hiển thị dạng Bảng phẳng 1 hàng/bài.
- [ ] `npm run build` thành công 100%.
