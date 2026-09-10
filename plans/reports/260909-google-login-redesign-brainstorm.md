# Brainstorm: Redesign Google Login Button & Auth Portal Layout

**Date:** 2026-09-09

## Ideas Explored
1. **Full-width Standard Google Button (Chuẩn Google Identity 100% Width)**: Cấu hình `<GoogleLogin width="100%" />` hoặc custom full-width button đồng bộ tông màu xám/trắng viền bo `rounded-lg` 100% chiều rộng khung form auth.
2. **Modern Flat Bento / Segmented UI**: Nút Google 100% full-width, gộp nút "Google Demo Mode" xuống chân trang cùng nhóm quick demo accounts. Thay thế Role Selector icon emoji thô bằng Segmented Control 3 tab phẳng nhẹ nhàng.
3. **Smart Unified Auth Portal**: Tự động hợp nhất nút Google thật và Demo Mode thành 1 nút duy nhất có logic fallback thông minh, kết hợp dropdown vai trò gọn gàng.

## User's Direction
- Cần khắc phục triệt để việc nút Google nằm co ngắn/lệch so với chiều rộng form (phải full-width 100%).
- Cần sửa lỗi hiển thị màu/icon trên trang đăng ký (`RoleSelector`) khi chuyển đổi theme (Light Mode bị chìm chữ và icon thô).
- Tái bố cục auth portal gọn gàng, liền mạch.

## Open Questions
1. Nên hiển thị nút "Google (Demo Mode)" thành một dòng link nhạt phía dưới nút Google hay di chuyển hẳn xuống phần "Dùng thử nhanh tài khoản demo"?

## Risks
1. `@react-oauth/google` `<GoogleLogin />` mặc định render iframe từ Google API có thể giới hạn style width trên một số màn hình nếu không wrap container flex full width chuẩn.
