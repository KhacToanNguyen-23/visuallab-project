# VisualLab Frontend UI Guidelines (Workspace Rule)

**MỤC ĐÍCH:**
Quy tắc này nhằm ép buộc tất cả các Agent (bao gồm bb-cook, bb-plan, v.v.) phải tuân thủ tuyệt đối hệ thống thiết kế (Design System) của VisualLab khi tạo mới hoặc chỉnh sửa bất kỳ component giao diện nào (React/Tailwind v4).

**BẠN PHẢI TUÂN THỦ CÁC QUY TẮC SAU KHI VIẾT CODE FRONTEND:**

1. **Màu Nền (Background):**
   - Nền chính của toàn ứng dụng: Phải dùng `bg-slate-50`.
   - Nền vùng mô phỏng (Canvas) hoặc bảng điều khiển (Panel): Phải dùng `bg-white`.

2. **Màu Tương Tác Chủ Đạo (Primary):**
   - Các nút bấm chính (Primary Action): Dùng `bg-blue-600` (Hover: `bg-blue-700`).
   - Trạng thái đang chọn (Active/Selected Tab): Dùng nền `bg-blue-50` kết hợp chữ `text-blue-700`.

3. **Màu Chữ (Typography):**
   - Tiêu đề: Dùng `text-slate-900`.
   - Chữ thông thường: Dùng `text-slate-700`.
   - Chú thích, placeholder: Dùng `text-slate-500`.
   - TUYỆT ĐỐI KHÔNG dùng đen tuyền (`text-black`).

4. **MÀU QUY ƯỚC VẬT LÝ (BẮT BUỘC):** 
   - Lực, Vận tốc, Nguồn nhiệt, Điện (+): Phải dùng `red-500` (Ví dụ: `bg-red-500` hoặc `text-red-500`).
   - Gia tốc, Phản hồi làm đúng: Phải dùng `emerald-500`.
   - Nước, Điện (-): Phải dùng `sky-500`.
   - Năng lượng, Thế năng, Động năng, Vật thể: Phải dùng `amber-500`.
   - Đường quỹ đạo, thước đo: Phải dùng `slate-400`.

5. **Style & Layout (Kiểu dáng):**
   - Tránh sử dụng viền thô cứng (`border`). Hãy dùng bóng mờ `shadow-sm` hoặc `shadow-md` để phân tách các khu vực.
   - Bo góc: Nút và Input dùng `rounded-lg`. Thẻ (Card) và Panel dùng `rounded-xl`.
   - Ẩn thanh cuộn nếu không cần thiết, ưu tiên giao diện tập trung (Focus Mode).

**CẢNH BÁO:** Nếu bạn tự ý sử dụng mã màu ngoài quy chuẩn này hoặc vi phạm các quy tắc trên, người dùng sẽ từ chối kết quả của bạn.
