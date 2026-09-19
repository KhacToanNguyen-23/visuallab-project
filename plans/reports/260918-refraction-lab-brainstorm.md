# Brainstorm Report: Thiết Kế Lại Thí Nghiệm Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần (Refraction & Total Internal Reflection Lab)

**Date:** 2026-09-18
**Standard:** VisualLab Standards & SGK GDPT 2018 Vật Lý 11 (Bài 21: Hiện tượng khúc xạ ánh sáng - Bài 22: Hiện tượng phản xạ toàn phần)
**Target Route:** `http://localhost:5173/lab/refraction`

---

## 1. Ideas Explored
1. **2D Canvas vs 3D Three.js Studio**:
   - *2D Canvas*: Đơn giản kiểu PhET 2D cũ, khó cảm nhận chiều sâu quang học 3D của đĩa tròn chia độ và khối bán nguyệt trụ.
   - *3D Three.js Parameter Studio (Chosen)*: Khối bán nguyệt trụ thủy tinh quang học (Semi-cylindrical lens) trong suốt PBR đặt trên đĩa tròn chia độ $0 - 360^\circ$ xoay quanh trục thẳng đứng, nguồn phát chùm Laser đơn sắc có thể điều chỉnh góc xoay $0^\circ \to 90^\circ$, tia khúc xạ và tia phản xạ phát sáng chân thực (Fresnel intensity reflectance).
2. **Chiều truyền ánh sáng**:
   - Chiều 1: Không khí $\to$ Bán trụ ($n_1 < n_2$) $\implies$ Tia khúc xạ lệch lại gần pháp tuyến ($r < i$).
   - Chiều 2: Bán trụ $\to$ Không khí ($n_1 > n_2$) $\implies$ Hiện tượng góc khúc xạ $r = 90^\circ$ tại $i = i_{\text{gh}}$ và phản xạ toàn phần khi $i > i_{\text{gh}}$.
3. **Danh mục môi trường vật liệu**:
   - Không khí ($n=1.000$), Nước ($n=1.333$), Thủy tinh Crown ($n=1.520$), Thủy tinh Flint ($n=1.660$), Kim cương ($n=2.417$), và Khối bí ẩn $X$ ($n_x \in [1.40, 1.80]$ được sinh ngẫu nhiên).
4. **Quy trình 3 Nhiệm vụ chuẩn SGK GDPT 2018**:
   - **Nhiệm Vụ 1: Khảo Sát Định Luật Khúc Xạ (Không khí $\to$ Thủy tinh)**: Đo 5 góc tới $i \in [15^\circ, 75^\circ]$, đo góc khúc xạ $r$, tính tỉ số $\frac{\sin i}{\sin r} = \text{const} \approx n_{21}$.
   - **Nhiệm Vụ 2: Khảo Sát Phản Xạ Toàn Phần (Thủy tinh $\to$ Không khí)**: Tìm góc tới giới hạn $i_{\text{gh}}$, quan sát sự biến mất của tia khúc xạ và độ sáng cực đại của tia phản xạ khi $i \ge i_{\text{gh}}$.
   - **Nhiệm Vụ 3: Xác Định Chiết Suất & Danh Tính Khối Bí Ẩn $X$**: Đo các cặp $(\sin i, \sin r)$, vẽ đường hồi quy tuyến tính $\sin i = n \cdot \sin r$, ngoại suy tìm $n_x$ và tra cứu phân loại chất liệu.

---

## 2. User's Direction
- Sử dụng mô hình 3D Three.js khối bán nguyệt trụ quang học trên đĩa tròn chia độ $360^\circ$.
- Hỗ trợ đầy đủ 2 chiều chiếu sáng (Khúc xạ thông thường $n_1 < n_2$ và Phản xạ toàn phần $n_1 > n_2$).
- Tích hợp chế độ "Khối vật liệu bí ẩn $n_x$" để học sinh tự đo đạc tỉ số $\sin i / \sin r$ và tìm ra tên chất.

---

## 3. Risks & Open Questions
- **Độ chính xác đo góc**: Cần vạch chia độ rõ nét và thước ngắm kim quang học (optical loupe / cursor line) để học sinh đọc góc $r$ chính xác đến $0.5^\circ$.
- **Đồ thị $\sin i - \sin r$**: Hỗ trợ hiển thị đồ thị tuyến tính $\sin i$ theo $\sin r$ với hệ số góc bằng chiết suất tỉ đối $n_{21}$, tính $R^2 \ge 0.99$.
- **Chấm điểm tự động**: 30% Thao tác (3 nhiệm vụ), 40% Độ chính xác sai số chiết suất $\delta n \le 3\%$, 30% Trắc nghiệm GDPT 2018.
