# Phase 2: Command Palette Dialog (`⌘K` / `Ctrl+K`)

**Spec Stories Covered:** [P1]  
**Deliverable:** Command Palette Modal hỗ trợ tìm kiếm nhanh theo mã bài học GDPT và từ khóa.

---

## Scope of Work

1. **Global Keyboard Listener:**
   - Lắng nghe `Ctrl+K` (Windows/Linux) hoặc `Cmd+K` (Mac) để mở modal.
   - Hỗ trợ phím `Escape` để đóng modal tức thì.
2. **Search Index & Keyword Matching:**
   - Dữ liệu tra cứu bao gồm: Mã bài (`VL10-DH01`, `VL11-DD01`...), Tên bài học, Khối lớp (10, 11, 12), Chủ đề (Cơ, Nhiệt, Điện, Quang, Hạt nhân), Dụng cụ đo.
3. **Interactive Navigation:**
   - Điều hướng danh sách kết quả bằng phím `ArrowUp`, `ArrowDown` và chọn bằng `Enter`.
   - Hiển thị badge trạng thái số lượng kết quả tìm được (`X bài thí nghiệm phù hợp`).
