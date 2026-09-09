# Hướng Dẫn Cấu Hình Google OAuth Client ID Cho EduLab

Lỗi `Error 401: invalid_client` (OAuth client was not found) xảy ra khi ứng dụng sử dụng một Google Client ID chưa được đăng ký trên Google Cloud Console.

---

## 🛠️ Các Bước Tạo Google Client ID Thật:

1. Truy cập vào **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Tạo một Project mới hoặc chọn Project sẵn có (VD: `EduLab-Physics`).
3. Vào phần **APIs & Services** > **Credentials**.
4. Bấm **Create Credentials** > chọn **OAuth client ID**.
5. Chọn Application type là **Web application**.
6. Tại phần **Authorized JavaScript origins**, thêm:
   - `http://localhost:5173`
   - `http://localhost:8080`
7. Bấm **Save** và sao chép mã **Client ID** có dạng:
   `xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`

---

## ✏️ Cập Nhật Vào Dự Án:

Tạo file `.env.local` tại thư mục `frontend/` và dán Client ID của bạn vào:

```env
VITE_GOOGLE_CLIENT_ID=Client_ID_Thật_Của_Bạn.apps.googleusercontent.com
```

---

> 💡 **Mẹo**: Nếu chưa thiết lập Client ID thật trên Google Cloud Console, bạn có thể nhấn nút **"⚡ Đăng ký / Đăng nhập Google Nhanh (Demo Mode)"** ngay bên dưới nút Google để trải nghiệm đầy đủ luồng đăng ký & chọn role.
