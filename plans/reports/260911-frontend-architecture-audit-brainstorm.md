# Brainstorm Report: Frontend Architecture Audit & Refactoring (Mở Rộng Sâu)

**Date:** 2026-09-11 (Cập nhật phiên thảo luận mở rộng)

## Executive Summary
Báo cáo rà soát và phân tích sâu 360 độ toàn bộ hệ thống Frontend (`frontend/src`). Ngoài 5 tiêu chí cốt lõi (Kiến trúc, File rác, Hardcoded data, Phân quyền Role, Naming), báo cáo mở rộng thêm 4 khía cạnh nâng cao: **Hiệu năng & Bundle Optimization**, **Quản lý bộ nhớ 3D/Audio Labs**, **Tái sử dụng Design System**, và **Xử lý sự cố Error Boundaries**.

---

## 1. Thống kê Chi tiết theo 5 Tiêu chí Cốt lõi

### 📊 Thống kê Tổng quan Số lượng File
- **Tổng số tệp nguồn (`frontend/src`)**: 88 tệp
- **Tệp TypeScript (`.ts`/`.tsx`)**: 83 tệp
- **Tệp JavaScript (`.js`/`.jsx`)**: 5 tệp (cần xóa hoặc chuyển đổi)

---

### 🚨 Tiêu chí 1: Đánh giá Chuẩn Kiến trúc Công nghiệp
- **Điểm đánh giá hiện tại**: **60 / 100 (Chưa đạt chuẩn Production Enterprise)**.
- **Vấn đề tồn tại**:
  1. **Tệp lai tạp JS & TS**: Còn 5 tệp `.jsx` đan xem trong dự án TypeScript.
  2. **Thiếu HTTP Client / Interceptor tập trung**: Các service (`assignmentService.ts`, `classService.ts`, `labService.ts`) và `AuthContext.tsx` tự gọi `fetch` thủ công, lặp lại logic đính kèm `Bearer token` và không xử lý tập trung lỗi 401/403/500.
  3. **Tổ chức thư mục chưa đồng nhất**: Tách thành 2 thư mục `components/simulation` và `components/simulations`. Thư mục `src/layouts` chứa file mồ côi (`LabLayout.jsx`, `PortalLayout.jsx`), trong khi Layouts chính lại nằm ở `src/components/admin/AdminLayout.tsx`, `src/components/teacher/TeacherLayout.tsx`, `src/components/student/StudentLayout.tsx`.

---

### 🗑️ Tiêu chí 2: Thống kê File Rác / Thừa / Mồ côi (Junk & Orphan Files)
1. **`src/App.jsx`**: Tệp proxy 3 dòng (`import App from './App.tsx'`), dư thừa.
2. **`src/main.jsx`**: Tệp proxy 2 dòng (`import './main.tsx'`), dư thừa.
3. **`src/layouts/LabLayout.jsx`**: Tệp mồ côi (Orphan file), không import ở bất kỳ đâu.
4. **`src/layouts/PortalLayout.jsx`**: Tệp mồ côi (Orphan file), không import ở bất kỳ đâu.
5. **`src/pages/LabWorkspace.jsx`**: Tệp mồ côi (Orphan file), không import ở bất kỳ đâu.
6. **`src/assets/react.svg` & `src/assets/vite.svg`**: Logo mặc định Vite dư thừa.
7. **`src/App.css`**: CSS mặc định Vite dư thừa (dự án dùng Tailwind CSS trong `index.css`).

---

### 📌 Tiêu chí 3: Thống kê File đang Fix Cứng (Hardcoded Endpoints)
1. **`src/context/AuthContext.tsx`**: Fix cứng `http://localhost:8080/api/auth/...` trong 5 hàm API.
2. **`src/services/assignmentService.ts`**: Fix cứng `const API_BASE = 'http://localhost:8080/api'`.
3. **`src/services/classService.ts`**: Fix cứng `const API_BASE = 'http://localhost:8080/api/classes'`.
4. **`src/services/labService.ts`**: Fallback `http://localhost:8080/api` và mảng mock data `DEFAULT_PUBLIC_LABS`.
5. **`src/main.tsx`**: Fix cứng Google Client ID dự phòng `76484117439-or3q8h67eki0j95d7r5t9kji3u2ljt0v.apps.googleusercontent.com`.

---

### 🛡️ Tiêu chí 4: Vấn đề Phân Vai & Bảo Mật Route (Role Security Vulnerabilities)
- **Lỗ hổng phân quyền tại `ProtectedRoute.tsx`**:
  - `ProtectedRoute` chỉ kiểm tra `if (!token)`. **HOÀN TOÀN KHÔNG kiểm tra `allowedRoles`**.
  - **Hệ quả**: Một tài khoản `STUDENT` sau khi đăng nhập có thể gõ trực tiếp URL `/admin`, `/admin/users`, `/teacher/grading` để vào giao diện Admin hoặc Giáo viên.

---

### 📁 Tiêu chí 5: File Không Đúng / Sai Quy Chuẩn (Naming & Structure)
1. **Sai tên thư mục**: `src/components/simulation` (số ít) vs `src/components/simulations` (số nhiều).
2. **Đặt sai vị trí Layout**: Layouts chính (`AdminLayout`, `TeacherLayout`, `StudentLayout`) nằm trong `src/components/` thay vì `src/layouts/`.

---

## 2. Thảo Luận Mở Rộng 4 Khía Cảnh Nâng Cao (Extended Deep-Dive)

### ⚡ 1. Hiệu Năng Tải Trang & Code Splitting (Bundle Optimization)
- **Hiện trạng**: Trong `src/main.tsx`, 100% trang và lab engine (bao gồm Three.js, Tone.js, Rapier Physics) đều được import **đồng bộ (synchronous import)**.
- **Hệ quả**: Tệp Bundle ban đầu (Initial JS Bundle) cực kỳ nặng, người dùng vào Landing Page cũng phải tải toàn bộ thư viện 3D/Audio của các bài Lab.
- **Giải pháp**: Áp dụng `React.lazy()` + `React.Suspense` kết hợp `Vite manualChunks` để tách các Lab 3D/Physics thành các Dynamic Chunks riêng biệt.

### 🧹 2. Quản Lý Bộ Nhớ 3D & Web Audio (Memory Leak Prevention)
- **Hiện trạng**: Các bài Lab phức tạp như `SoundResonanceLab.tsx` (dùng Web Audio API) và `FreeFallCanvas.tsx` khởi tạo WebGL Canvas & AudioContext.
- **Rủi ro**: Nếu người dùng liên tục chuyển trang qua lại giữa các bài Lab mà không hủy `AudioContext.close()` hay `cancelAnimationFrame`, bộ nhớ RAM trình duyệt sẽ tăng đột biến (Memory Leak).
- **Giải pháp**: Chuẩn hóa custom hooks `useAudioEngine` và `useThreeCanvas` tự động cleanup tài nguyên khi unmount.

### 🧩 3. Design System & Tái Sử Dụng UI Components
- **Hiện trạng**: Các nút bấm (`button`), ô nhập liệu (`input`), thẻ Lab (`SimCard`), Modal/Drawer sử dụng nhiều mã màu Tailwind fix cứng (`bg-slate-900`, `text-indigo-400`) lặp đi lặp lại ở hơn 40 tệp UI.
- **Giải pháp**: Xây dựng thư mục `src/components/ui/` chứa các UI Primitives (`Button`, `Input`, `Modal`, `Badge`, `Select`) chuẩn hóa theo ThemeContext.

### 🛡️ 4. Xử Lý Lỗi Runtime & Error Boundaries
- **Hiện trạng**: Dự án thiếu `ErrorBoundary` ở cấp độ Route và cấp độ Lab Engine.
- **Rủi ro**: Nếu trình duyệt người dùng không hỗ trợ WebGL hoặc xảy ra lỗi tính toán vật lý (NaN/Divide by zero), toàn bộ ứng dụng sẽ bị ngắt và hiển thị màn hình trắng (White Screen of Death).
- **Giải pháp**: Thêm `LabErrorBoundary` hiển thị thông báo lỗi thân thiện kèm nút "Reset Bài Thí Nghiệm".

---

## 3. Các Phương Án Lộ Trình Thực Hiện (Actionable Options)

### Option A: Sửa Lỗi Cấp Bách & Dọn Dẹp (Quick Fix - 1 Ngày)
1. Xóa 5 file rác `.jsx` và 3 file assets mặc định.
2. Nâng cấp `ProtectedRoute.tsx` hỗ trợ `allowedRoles`.
3. Đưa tất cả `http://localhost:8080/api` về `src/config/api.ts`.

### Option B (Khuyên dùng): Tái Cấu Trúc Toàn Diện & Tối Ưu Hiệu Năng (Full Refactor - 2-3 Ngày)
1. Thực hiện toàn bộ Option A.
2. Xây dựng `src/services/apiClient.ts` (HTTP Client tập trung có Token Interceptor).
3. Đưa `AdminLayout`, `TeacherLayout`, `StudentLayout` về `src/layouts/`.
4. Gom thư mục `components/simulation` và `components/simulations`.
5. Áp dụng `React.lazy()` cho toàn bộ các Route Lab và Sub-Pages.
6. Thêm `LabErrorBoundary` để bảo vệ ứng dụng khỏi crash WebGL/Physics.

---

## Open Questions
1. Bạn muốn triển khai theo **Option A** (Sửa gấp lỗi phân quyền & file rác) hay **Option B** (Tái cấu trúc toàn diện + Code Splitting + Error Boundaries)?
2. Bạn có muốn thêm Axios hay giữ lại `fetch` chuẩn native với wrapper custom `apiClient.ts`?
