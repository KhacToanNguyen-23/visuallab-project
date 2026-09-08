# VisualLab Project

Dự án VisualLab bao gồm Frontend (React + Vite + Tailwind v4) và Backend (Spring Boot + Java 17 + PostgreSQL + Redis). 
Tài liệu này hướng dẫn các thành viên trong nhóm cách thiết lập môi trường và chạy ứng dụng trên máy local.

## 🛠 Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, máy tính của bạn cần cài đặt sẵn:
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Hoặc Docker Engine & Docker Compose)
2. [Java JDK 17](https://adoptium.net/temurin/releases/?version=17)
3. [Node.js](https://nodejs.org/en) (Bản LTS 18.x hoặc 20.x trở lên)

---

## 🚀 Hướng dẫn khởi chạy dự án (Local Development)

### Bước 1: Khởi động Database & Redis bằng Docker
Để không phải cài đặt thủ công, dự án sử dụng `docker-compose` để chạy PostgreSQL và Redis.
Mở terminal tại thư mục gốc của dự án (`visuallab-project`) và chạy lệnh:

```bash
docker-compose up -d
```
*(Lệnh này sẽ tải image và chạy ngầm 2 container: `visuallab-postgres` ở port 5432 và `visuallab-redis` ở port 6379)*

---

### Bước 2: Khởi chạy Backend (Spring Boot)
Backend đã được cấu hình sẵn để kết nối tới Postgres và Redis vừa chạy ở Bước 1.

Mở một terminal mới, chuyển vào thư mục `backend` và chạy ứng dụng:
```bash
cd backend

# Dành cho Windows:
.\mvnw spring-boot:run

# Dành cho macOS/Linux:
./mvnw spring-boot:run
```
Backend sẽ khởi chạy thành công và lắng nghe tại: **http://localhost:8080**

---

### Bước 3: Khởi chạy Frontend (React + Vite)
Mở một terminal khác, chuyển vào thư mục `frontend` để cài đặt thư viện và chạy:
```bash
cd frontend

# Cài đặt các gói thư viện
npm install

# Khởi chạy server phát triển
npm run dev
```
Mở trình duyệt và truy cập vào đường dẫn hiển thị trên terminal (thường là **http://localhost:5173**).

---

## 💡 Ghi chú cấu hình & Database

- **Database Info:**
  - Host: `localhost`, Port: `5432`
  - Database: `visuallab_db`
  - User: `postgres`, Password: `postgres`
- **Redis Info:** Chạy tại `localhost:6379` không cần mật khẩu.
- Khi muốn tắt Docker (Tạm dừng làm việc), mở terminal ở thư mục gốc và chạy: `docker-compose down` (hoặc `docker-compose down -v` nếu muốn reset trắng database).

---

## 🌿 Hướng dẫn quản lý Git (Dành cho Team)

1. **Không code trực tiếp trên nhánh `master` / `main`**
2. **Khi bắt đầu một task mới:**
   ```bash
   git checkout -b feature/ten-chuc-nang
   # hoặc
   git checkout -b fix/ten-loi-can-sua
   ```
3. **Khi làm xong:**
   ```bash
   git add .
   git commit -m "feat: Thêm chức năng abc" # Sử dụng chuẩn Conventional Commits
   git push origin feature/ten-chuc-nang
   ```
4. **Tạo Pull Request (PR)** trên GitHub để review trước khi merge vào nhánh chính.
