# Quy Chuẩn Phát Triển Bài Thí Nghiệm EduLab (PhET SceneryStack Standard)

**MỤC ĐÍCH:**
Quy tắc này bắt buộc tất cả các Agent và Lập trình viên khi tạo mới hoặc nâng cấp bất kỳ bài thí nghiệm Vật lý / Khoa học tương tác (Virtual Physics Lab) nào trong dự án EduLab đều phải tuân thủ chuẩn công nghệ **PhET SceneryStack Hybrid Architecture**.

---

## 1. Quy Định Sử Dụng Engine Mô Phỏng (`scenerystack`)

- **BẮT BUỘC**: Sử dụng trực tiếp bộ thư viện **PhET SceneryStack** (`scenerystack/scenery`, `scenerystack/dot`, `scenerystack/kite`, `scenerystack/axon`) làm lõi mô phỏng tương tác.
- **TUYỆT ĐỐI KHÔNG**: Tự viết mã lệnh vẽ thủ công 2D Context (`CanvasRenderingContext2D` / `ctx.beginPath()`, `ctx.arc()`) từ đầu cho bài thí nghiệm mới.
- **Thư viện chuẩn**:
  - `Display` từ `scenerystack/scenery`: Gắn trực tiếp vào DOM container React (`containerRef.current`).
  - `Node`, `Path`, `Circle`, `Rectangle`, `Line`, `Text` từ `scenerystack/scenery`: Xây dựng cây SceneGraph vật thể.
  - `Vector2` từ `scenerystack/dot`: Quản lý vị trí, vận tốc, lực và thiết lập tọa độ `setCenter(new Vector2(x, y))` / `translation`.
  - `Shape` từ `scenerystack/kite`: Khởi tạo đường cong, xoắn lò xo, tia sáng, quỹ đạo chuyển động.
  - `Property`, `DerivedProperty`, `Multilink` từ `scenerystack/axon`: Quản lý state vật lý và lắng nghe sự thay đổi biến real-time.

---

## 2. Kiến Kiến Trúc Hybrid Tiêu Chuẩn Cho Bài Lab (Hybrid Architecture)

Mọi bài thí nghiệm trong EduLab được chuẩn hóa theo 3 lớp công nghệ kết hợp:

1. **Lớp Mô phỏng Core (Interactive Core)**:
   - Dùng **SceneryStack SceneGraph** quản lý giá treo, vật thể, thước đo, đường vị trí cân bằng, các nút kéo thả.
2. **Lớp Trực Quan Hóa Đồ Thị (Physics Analytics)**:
   - Dùng **`Chart.js`** hoặc **`Bamboo`** vẽ đồ thị thời gian thực ($x-t$, $v-t$, $a-t$, $U-I$).
3. **Lớp Toán Học & Công Thức Chuyên Sâu (Pedagogical UI)**:
   - Dùng **`KaTeX`** hiển thị công thức chuẩn SGK Việt Nam (GDPT 2018).
   - Dùng **`Math.js`** cho các bài toán đại số tuyến tính, phương trình vi phân, ma trận xoay chiều.

---

## 3. Quy Tắc Vận Hành & Quản Lý Bộ Nhớ (Memory Safety)

- **Cleanup lifecycle bắt buộc**: Trong React `useEffect`, khi unmount phải gọi `display.dispose()` và gán `displayRef.current = null;`.
- **Đúng định dạng Vector2**: Không truyền 2 tham số rời rạc vào `setCenter(x, y)`, phải truyền đối tượng `new Vector2(x, y)`.
- **Tích hợp tính năng EduLab Standard**:
  - Tab chọn chế độ học tập (Khám phá, So sánh, Dự đoán, Đo đạc, Đồ thị, AI Thử thách).
  - Nút **📸 Chụp Ảnh & Lưu Kho** kết hợp Cloudinary Snapshot Storage.
  - Bảng ghi số liệu đo đạc thực nghiệm.
