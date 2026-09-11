# Spec: Student-Friendly 3D Free Fall Laboratory Upgrade

**Slug:** relatable-free-fall-lab
**Status:** APPROVED
**Created:** 2026-09-11

## 1. Overview
Nâng cấp phòng thí nghiệm 3D Rơi Tự Do trở nên gần gũi, trực quan và cuốn hút học sinh THPT (Lớp 10 - GDPT 2018) qua các tính năng tương tác thực tế đời sống, thí nghiệm Galilei chân không và công cụ tua chậm.

## 2. Key Features

### 🍎 1. Bộ Chọn Vật Thể Rơi Đa Dạng (Droppable Objects)
Học sinh chọn 1 trong các vật thể 3D:
- 🍎 **Quả Táo (Apple):** Khối lượng 0.15kg, đường kính 7cm.
- 🏀 **Quả Bóng Rổ (Basketball):** Khối lượng 0.62kg, đường kính 24cm.
- 🎱 **Viên Bi Thép (Steel Ball):** Khối lượng 0.05kg, đường kính 5cm (Chuẩn SGK).
- 🪶 **Lông Chim (Feather):** Khối lượng 0.005kg (Dùng cho thí nghiệm Chân không).

### 🌬 2. Chế Độ Hút Chân Không & Sức Cản Không Khí (Galileo Vacuum Chamber)
- Công tắc **[Hút Chân Không: BẬT / TẮT]**.
- Khi **TẮT Chân Không:** Sức cản không khí  = \frac{1}{2} \rho v^2 C_d A$ làm lông chim rơi chậm, chao đảo.
- Khi **BẬT Chân Không:** Sức cản bằng 0 ( = 0$), Lông chim và Quả táo rơi chạm đất **cùng lúc**.

### 🐢 3. Chế Độ Tua Chậm (Slow-Motion Engine)
- Chọn tốc độ mô phỏng: **1.0x (Thường)** | **0.25x (Chậm)** | **0.1x (Siêu chậm)**.
- Giúp học sinh quan sát rõ từng khoảng khắc vật rơi cắt qua Cổng Quang E và F.

### 🏹 4. Trực Quan Hóa Vector Lực (3D Force Vectors)
- Mũi tên Trọng lực $\vec{P}$ (Màu đỏ, chỉ xuống).
- Mũi tên Sức cản không khí $\vec{F}_c$ (Màu xanh lá, chỉ lên, biến thiên theo vận tốc).

## 3. UI/UX Refinement
- Thêm Bảng Thách Thức / Câu Hỏi Đố Vui ngắn ở góc trên.
- Đồng bộ bảng điều khiển Dark Mode mượt mà với 3D canvas.
