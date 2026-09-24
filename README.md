# VisualLab - Virtual Physics Laboratory Platform

Nền tảng phòng thí nghiệm vật lý ảo tương tác và hệ thống quản lý học tập (LMS) tích hợp, phục vụ giảng dạy và thực hành theo chương trình Giáo dục Phổ thông (GDPT) 2018.

---

## 1. Tổng Quan Dự Án

VisualLab là giải pháp công nghệ giáo dục (EdTech) cung cấp môi trường mô phỏng vật lý số học thời gian thực, kết hợp công cụ quản lý lớp học và hệ thống chấm điểm tự động. Hệ thống cho phép học sinh thao tác lắp ráp dụng cụ, khảo sát hiện tượng, thu thập số liệu thực nghiệm và nộp báo cáo thực hành trực tiếp trên trình duyệt web.

---

## 2. Kiến Trúc Hệ Thống

Hệ thống được thiết kế theo mô hình Client-Server phân tầng, tách biệt hoàn toàn giữa giao diện người dùng, bộ động cơ mô phỏng vật lý (Physics Engine) và hệ thống dịch vụ xử lý nghiệp vụ backend.

```text
+-----------------------------------------------------------------------+
|                           CLIENT TIER (Frontend)                      |
|  +------------------------+  +-------------------------------------+  |
|  |   UI / LMS Portal      |  |     Physics Simulation Engine       |  |
|  |   (React 19 + Vite)    |  |  - 2D Canvas Solver (Circuit/Motion)|  |
|  |   (Tailwind CSS v4)    |  |  - 3D Three.js WebGL (Wave/Optics)  |  |
|  |   (Zustand State)      |  |  - Web Audio API / Tone.js Synth    |  |
|  +------------------------+  +-------------------------------------+  |
+-----------------------------------^-----------------------------------+
                                    | REST API / JSON / OAuth2
+-----------------------------------v-----------------------------------+
|                           SERVER TIER (Backend)                       |
|  +-----------------------------------------------------------------+  |
|  |   Spring Boot 3.2.x RESTful Services                            |  |
|  |   - Authentication & RBAC (Spring Security, JWT, Google OAuth2) |  |
|  |   - Classroom, Curriculum & Assignment Services                 |  |
|  |   - Automated Math Verification & Grading Engine                |  |
|  |   - Cloudinary Media & Snapshot Management                      |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------^-----------------------------------+
                                    | JPA / SQL / Redis Protocol
+-----------------------------------v-----------------------------------+
|                           DATA TIER (Storage)                         |
|  +---------------------------------+  +----------------------------+  |
|  |      PostgreSQL Database        |  |        Redis Cache         |  |
|  |  (Users, Classes, Assignments,  |  |   (Tokens, Presets, Cache) |  |
|  |   Submissions, Snapshots JSONB) |  |                            |  |
|  +---------------------------------+  +----------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 3. Yêu Cầu Chức Năng (Functional Requirements)

### 3.1. Phân Hệ Mô Phỏng Vật Lý & Bàn Thực Hành (Simulation Engine & Workbench)
- **Môi trường bàn thực hành 2D (Draggable Workbench Canvas):**
  - Hỗ trợ kéo thả, căn chỉnh tọa độ lưới (Grid Snapping) và kết nối linh kiện/dụng cụ đo.
  - Tích hợp bộ giải mạch điện động (`CircuitSolver`) với khả năng tính toán định luật Ohm, định luật Kirchhoff, công suất tiêu thụ và mô phỏng dòng hạt điện tích chuyển động.
  - Hỗ trợ các bài thí nghiệm cơ học và động lực học với thuật toán tích phân thời gian thực.
- **Môi trường phòng lab 3D (Parameter Concept Studio):**
  - Điều khiển không gian 3 chiều qua camera xoay quỹ đạo ($360^\circ$ OrbitControls).
  - Tích hợp động cơ âm thanh Web Audio / Tone.js mô phỏng sóng âm, dao động và hiện tượng cộng hưởng ống khí.
  - Mô phỏng hiện tượng quang học sóng (giao thoa khe Young) và khúc xạ qua lăng kính.
- **Danh mục bài thí nghiệm tiêu chuẩn GDPT 2018:**
  - *Cơ học:* Đo gia tốc rơi tự do với cổng quang điện, Định luật Hooke với lò xo, Ma sát trượt trên mặt phẳng nghiêng, Va chạm và bảo toàn động lượng, Con lắc đơn.
  - *Điện - Từ học:* Mạch điện một chiều DC, Đo suất điện động và điện trở trong của nguồn, Cảm ứng điện từ.
  - *Nhiệt học:* Định luật Boyle-Mariotte, Nhiệt dung riêng, Nhiệt nóng chảy riêng của nước đá.
  - *Quang học & Sóng:* Khúc xạ ánh sáng, Giao thoa ánh sáng khe Y-âng, Đo tốc độ truyền âm bằng ống cộng hưởng.

### 3.2. Phân Hệ Quản Lý Học Tập & Lớp Học (LMS & Classroom Management)
- **Dành cho Giáo viên:**
  - Tạo lớp học, quản lý mã tham gia lớp (Class Enrollment Code) và danh sách học sinh.
  - Thiết lập và giao bài tập thực hành theo giáo trình định sẵn hoặc cấu hình tùy biến.
  - Cấu hình tiêu chí đánh giá, thời hạn nộp bài (Deadline) và số lần làm bài tối đa.
  - Theo dõi tiến độ học tập, xem lại chi tiết bảng dữ liệu đo lường và ảnh chụp trạng thái thí nghiệm (Snapshot) của học sinh.
- **Dành cho Học sinh:**
  - Tham gia lớp học thông qua mã lớp.
  - Truy cập danh sách bài tập được giao, mở bàn thực hành để tiến hành thí nghiệm.
  - Thu thập, ghi nhận bảng số liệu đo lường trực tiếp vào phiếu báo cáo.
  - Lưu bản nháp trạng thái thí nghiệm và nộp bài báo cáo tổng hợp.

### 3.3. Phân Hệ Tự Động Chấm Điểm & Thẩm Định Dữ Liệu (Automated Verification & Grading)
- Áp dụng công thức đánh giá chuẩn hóa 3 thành phần:
  $$\text{Tổng Điểm} = \text{Điểm Thao Tác (30\%)} + \text{Điểm Sai Số Thực Nghiệm (40\%)} + \text{Điểm Trắc Nghiệm (30\%)}$$
- **Thẩm định thao tác (30%):** Kiểm tra cấu hình sơ đồ thí nghiệm hợp lệ, thứ tự lắp ghép và số lần đo tối thiểu ($N \ge 3$).
- **Đánh giá sai số (40%):** Công cụ `MathVerificationEngine` phân tích độ lệch giữa giá trị thực nghiệm của học sinh và giá trị lý thuyết:
  $$\text{Sai số (\%)} = \frac{|X_{\text{học sinh}} - X_{\text{lý thuyết}}|}{X_{\text{lý thuyết}}} \times 100\%$$
  - Thang điểm tối đa khi sai số $\le 5\%$, trừ điểm tuyến tính khi sai số trong khoảng $5\% - 20\%$.
- **Trắc nghiệm lý thuyết (30%):** Hệ thống tự động chấm câu hỏi trắc nghiệm kiểm tra độ hiểu sau thí nghiệm.

### 3.4. Phân Hệ Xác Thực & Quản Trị Người Dùng (Authentication & RBAC)
- Xác thực đăng nhập qua Email/Password và Đăng nhập một lần (SSO) bằng Google OAuth2.
- Cơ chế bảo mật JWT (Access Token thời hạn ngắn kết hợp Refresh Token lưu trữ kiểm soát trong Database).
- Phân quyền người dùng dựa trên vai trò (Role-Based Access Control):
  - `ROLE_STUDENT`: Thực hiện thí nghiệm, nộp bài, xem lịch sử điểm.
  - `ROLE_TEACHER`: Quản lý lớp học, phân phối bài tập, chấm điểm và xem thống kê.
  - `ROLE_ADMIN`: Quản lý người dùng, quản trị danh mục bài thí nghiệm và nhật ký kiểm toán (Audit Logs).

### 3.5. Phân Hệ Lưu Trữ & Quản Lý Trạng Thái (Snapshot & Cloud Storage)
- Cơ chế tuần tự hóa (Serialization) và giải tuần tự hóa (Deserialization) toàn bộ trạng thái linh kiện, dây nối, tham số vật lý thành cấu trúc JSON lưu trữ vào PostgreSQL (JSONB).
- Tích hợp Cloudinary lưu trữ ảnh chụp màn hình kết quả thực hành phục vụ lưu trữ minh chứng nộp bài.

---

## 4. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 4.1. Hiệu Năng & Khả Năng Đáp Ứng Thời Gian Thực (Performance & Real-Time)
- Vòng lặp dựng hình mô phỏng vật lý đạt tốc độ ổn định 60 khung hình/giây (FPS) trên nền tảng Canvas 2D và WebGL Three.js.
- Thuật toán tích phân số học sử dụng bước nhảy thời gian cố định ($\Delta t$ định sẵn) nhằm ngăn ngừa hiện tượng sai lệch tích lũy (accumulated drift) và sụt khung hình.
- Thời gian phản hồi trung bình của API Backend $\le 200\text{ms}$ đối với các tác vụ truy vấn thông thường.
- Bộ nhớ đệm Redis hỗ trợ giảm tải truy vấn cơ sở dữ liệu đối với dữ liệu danh mục thí nghiệm và phiên xác thực.

### 4.2. Độ Chính Xác & Tính Ổn Định Vật Lý (Physics Accuracy & Determinism)
- Mọi mô hình toán học và vật lý tính toán hoàn toàn trên hệ đơn vị đo lường quốc tế (Hệ SI: mét, kilôgam, giây, ampe, vôn, jun).
- Phân tách tuyệt đối giữa Model (tính toán toán học SI) và View (chuyển đổi tọa độ ánh xạ ra pixel hiển thị).
- Tính tất định (Determinism): Cùng một tập tham số đầu vào và điều kiện ban đầu, mô phỏng luôn trả về kết quả số học nhất quán.

### 4.3. Bảo Mật & Toàn Vẹn Dữ Liệu (Security & Data Integrity)
- Mọi kết nối API được bảo vệ bởi Spring Security, kiểm soát truy cập theo vai trò (RBAC) trên từng endpoint.
- Mã hóa mật khẩu người dùng bằng thuật toán an toàn (BCrypt).
- Chống tấn công CSRF, XSS và ngăn chặn triệt để SQL Injection thông qua Spring Data JPA Parameterized Queries.
- Cơ chế Refresh Token Rotation đảm bảo hạn chế rủi ro lộ token phiên làm việc.

### 4.4. Tính Mở Rộng & Kiến Trúc Mô-đun (Scalability & Extensibility)
- Thiết kế Data-Driven Physics: Toàn bộ tham số vật lý của dụng cụ được định nghĩa qua Schema Descriptor (`IPhysicsParamDescriptor`), nạp động thông qua cấu hình JSONB mà không can thiệp sửa mã nguồn cốt lõi.
- Áp dụng Design Pattern Factory (`InstrumentFactory`) và Interface Segregation (`ICircuitInstrument`, `IMechanicalInstrument`, `IOpticalInstrument`) cho phép mở rộng các bài thí nghiệm mới độc lập.
- Cấu trúc hệ thống hỗ trợ đóng gói Docker Container hóa, sẵn sàng mở rộng ngang (Horizontal Scaling).

### 4.5. Trải Nghiệm & Tính Khả Dụng (Usability & Compatibility)
- Giao diện người dùng tương thích đa thiết bị (Desktop, Laptop, Tablet) với các độ phân giải màn hình phổ biến.
- Hệ thống hỗ trợ song ngữ (tiếng Việt và thuật ngữ quốc tế) trong định danh công cụ đo và tham số.
- Cơ chế xử lý dọn dẹp tài nguyên (Resource Cleanup) nghiêm ngặt khi đóng tab/chuyển trang (`AudioContext.close()`, `WebGLRenderer.dispose()`) nhằm tránh rò rỉ bộ nhớ (Memory Leak).

---

## 5. Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Ngôn ngữ & Nền tảng:** TypeScript 5+, React 19, Vite 8
- **Styling:** Tailwind CSS v4
- **Đồ họa & Mô phỏng:** HTML5 Canvas API, Three.js, `@react-three/fiber`, `@react-three/drei`
- **Âm thanh & Tương tác:** Tone.js, Web Audio API, `@dnd-kit/core`, `@use-gesture/react`
- **Quản lý trạng thái & Routing:** Zustand, React Router DOM v7
- **Xác thực:** `@react-oauth/google`

### Backend
- **Ngôn ngữ & Framework:** Java 17, Spring Boot 3.2.4
- **Bảo mật & Xác thực:** Spring Security, Nimbus JWT, Google API Client
- **Truy cập dữ liệu:** Spring Data JPA, Hibernate
- **Cơ sở dữ liệu:** PostgreSQL (Lưu trữ chính và JSONB), Redis (Cache & Session)
- **Tích hợp bên ngoài:** Cloudinary API (Media storage), Groq AI SDK

---

## 6. Cấu Trúc Thư Mục Dự Án

```text
visuallab-project/
├── backend/
│   ├── src/main/java/com/edulab/
│   │   ├── config/          # Cấu hình Spring Security, CORS, Cloudinary
│   │   ├── controller/      # REST API Controllers (Auth, Class, Lab, Submission)
│   │   ├── model/           # JPA Entities (User, Classroom, Assignment, Lab)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── service/         # Interface định nghĩa nghiệp vụ
│   │   └── service/impl/    # Xử lý logic, MathVerification, OAuth2
│   ├── pom.xml              # Maven dependencies & build configurations
│   └── mvnw / mvnw.cmd      # Maven Wrapper
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components tái sử dụng (Navbar, Sidebar, Modals)
│   │   ├── core/            # Interfaces gốc (ILabInstrument, Factory, Descriptors)
│   │   ├── engine/          # Physics Solver (CircuitSolver, Numerical Engines)
│   │   ├── pages/
│   │   │   ├── admin/       # Trang quản trị hệ thống
│   │   │   ├── teacher/     # Trang nghiệp vụ giảng viên (Lớp, Giao bài, Chấm điểm)
│   │   │   ├── student/     # Trang học sinh (Lớp học, Bài tập, Lịch sử)
│   │   │   └── labs/        # Các module bài thí nghiệm vật lý cụ thể
│   │   ├── store/           # Zustand global state stores
│   │   └── types/           # Định nghĩa kiểu dữ liệu TypeScript
│   ├── package.json         # Node dependencies & scripts
│   └── vite.config.ts       # Cấu hình Vite & Tailwind
│
├── docker-compose.yml       # Khởi tạo dịch vụ PostgreSQL & Redis
└── README.md                # Tài liệu hướng dẫn dự án
```

---

## 7. Hướng Dẫn Thiết Lập & Khởi Chạy (Local Development)

### 7.1. Yêu Cầu Môi Trường
- Docker & Docker Compose
- Java JDK 17 trở lên
- Node.js LTS (Phiên bản 18.x hoặc 20.x trở lên) và npm

### 7.2. Bước 1: Khởi động Cơ sở Dữ liệu & Redis
Tại thư mục gốc dự án, thực thi lệnh:
```bash
docker-compose up -d
```
Lệnh này sẽ khởi tạo hai container:
- `visuallab-postgres`: Cổng `5432` (Database: `visuallab_db`, User/Password: `postgres/postgres`)
- `visuallab-redis`: Cổng `6379`

### 7.3. Bước 2: Khởi chạy Backend Service
Mở terminal, điều hướng vào thư mục `backend` và khởi chạy Spring Boot:

Trên Windows (PowerShell/CMD):
```bash
cd backend
.\mvnw spring-boot:run
```

Trên macOS/Linux:
```bash
cd backend
./mvnw spring-boot:run
```
Backend API sẽ sẵn sàng phục vụ tại: `http://localhost:8080`

### 7.4. Bước 3: Khởi chạy Frontend Application
Mở terminal riêng biệt, điều hướng vào thư mục `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Truy cập giao diện web tại: `http://localhost:5173`

---

## 8. Quy Định Phát Triển & Quản Lý Mã Nguồn

1. Không phát triển mã trực tiếp trên nhánh `main` hoặc `master`.
2. Quy chuẩn tạo nhánh:
   - Tính năng mới: `feature/ten-chuc-nang`
   - Sửa lỗi: `fix/ten-loi`
   - Cải tiến tài liệu/cấu hình: `chore/noi-dung`
3. Quy chuẩn thông điệp Commit (Conventional Commits):
   - `feat: Mô tả chức năng mới`
   - `fix: Mô tả lỗi đã khắc phục`
   - `refactor: Tái cấu trúc mã nguồn`
   - `docs: Cập nhật tài liệu`
4. Mọi nhánh trước khi hợp nhất (Merge) vào nhánh chính phải tạo Pull Request (PR) và được kiểm thử hoàn tất.
