# Brainstorm Report: Immersive Realistic Physical Lab Workspace UX/UI

**Date:** 2026-09-12
**Method:** Sequential Thinking & Brainstorm

## Executive Summary
Báo cáo thiết kế và chuẩn hóa giao diện Không Gian Phòng Lab Ảo Hóa Thực Tế (Immersive Physical Lab Workspace). Đảm bảo giao diện bài thí nghiệm khi người dùng click vào sẽ **mở Toàn Màn Hình (100% Viewport)**, sử dụng hình ảnh bàn thí nghiệm thực tế, đo lường kỹ thuật chuẩn PhET + SGK GDPT 2018, đồng nhất Font chữ web và loại bỏ hoàn toàn các UI bịa dữ liệu/khó nhìn.

---

## 💡 Phân Tích Chuẩn Thiết Kế UX/UI Theo 5 Yêu Cầu Cốt Lõi

### 1. 🏛️ Giao Diện Không Gian Thật & Gần Gũi (Physical Lab Atmosphere)
- **Cảm giác Chân thực**: Không gian bàn thí nghiệm (Lab Table Mat) có texture bề mặt chống lóa (Slate/Wood Lab Mat), kết hợp quầng sáng dịu nhẹ (Soft Ambient Light).
- **Hỗ trợ Kỹ thuật Đo lường**: Tích hợp các bảng đo lường chuyên nghiệp (Đồng hồ số chia $0.001\text{s}$, Vôn kế/Ampe kế kim quay chuẩn, Thước milimét di động, Đồ thị dao động Oscilloscope).

### 2. 🖥️ Chế Độ Màn Hình Toàn Cảnh (100% Immersive Fullscreen)
- Khi người dùng bấm vào bất kỳ bài lab nào (từ Thư viện hay Dashboard):
  - Giao diện mở ra ở định dạng **Toàn màn hình (`w-screen h-screen overflow-hidden`)**.
  - Loại bỏ hoàn toàn Header/Footer của trang tin tức/portal để dành 100% diện tích trải nghiệm.
  - Tích hợp nút thanh công cụ góc trên: `[ ⬅️ Trở về thư viện ]`, `[ ⛶ Mở rộng Fullscreen ]`, `[ 🧹 Reset bài thí nghiệm ]`.

### 3. 🎯 Thông Số Vật Lý PhET Chuẩn Khung Cây GDPT 2018 (`spec.md`)
- Mọi hằng số và khoảng biến thiên tham số tuân theo chuẩn PhET & SGK GDPT 2018:
  - **Cơ học**: $g = 9.81\text{ m/s}^2$, chiều dài $l \in [0.1, 2.0]\text{m}$, khối lượng $m \in [0.05, 1.0]\text{kg}$, độ cứng lò xo $k \in [10, 100]\text{N/m}$.
  - **Điện học**: Nguồn $E \in [1.5, 12]\text{V}$, điện trở trong $r \in [0, 5]\Omega$, biến trở $R \in [0, 100]\Omega$.
  - **Quang & Âm học**: Bước sóng $\lambda \in [380, 750]\text{nm}$, chiết suất $n \in [1.0, 1.7]$, tần số $f \in [100, 2000]\text{Hz}$.

### 4. 🔤 Font Chữ Đồng Nhất Với Web (`font-sans`)
- Sử dụng 100% font chữ chuẩn web (`font-sans` - Inter/System UI).
- Đảm bảo chuẩn tiếng Việt có dấu, độ tương phản sắc nét (`text-slate-100` / `text-slate-900`), không dùng font chữ dị biệt hay font vẽ tay gây khó đọc.

### 5. 🚫 Loại Bỏ UI Bịa Dữ Liệu / Sai Thực Tế
- **Không dùng icon emoji nhếch nhác hay thiết bị giả tưởng**.
- Mọi linh kiện và núm vặn trên giao diện phải khớp 100% với danh mục Mã Dụng Cụ UI (`PHOTOGATE_SENSOR`, `VOLTMETER_DC`, `RESONANCE_TUBE`,...) trong skill `visuallab-standards`.

---

## 🚀 Các Bước Thực Thi Đề Xuất (Actionable Plan)

1. **Chuẩn hóa Layout Lab Base (`LabLayout.tsx` / `ImmersiveLabShell.tsx`)**: Tạo khung vỏ bọc Toàn màn hình chuẩn cho tất cả các bài thí nghiệm.
2. **Cập nhật Font & Theme**: Đồng nhất `font-sans` và bảng màu Slate/Indigo/Cyan cho toàn bộ Inspector Panels và Toolbars.
3. **Cập nhật dữ liệu bài lab**: Áp dụng dải hằng số PhET & SGK 2018 cho tất cả các bài lab.
