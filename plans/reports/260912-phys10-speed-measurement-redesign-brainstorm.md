# Brainstorm: Tối Ưu UX/UI & Thiết Kế Wizard Báo Cáo Đo Tốc Độ (Vật Lý 10 - Bài 6)

**Date:** 2026-09-12
**Slug:** `phys10-speed-measurement-redesign`
**Curriculum Standard:** SGK Vật lý 10 - GDPT 2018 (Chương II: Động học - Bài 6)
**UI Matrix Standard:** `DRAGGABLE_WORKBENCH` (Compact HUD + Wizard Worksheet)

---

## 1. Problem & Pain Points Identified
1. **Thao tác bị phân mảnh:** Bảng điều khiển (nút Thả bi, Đặt lại, Đồng hồ số) nằm tách biệt phía dưới Canvas khiến người dùng phải cuộn trang hoặc đảo mắt liên tục giữa việc xem viên bi lăn và bấm nút điều khiển.
2. **Worksheet khó hiểu & khô cứng:** Bảng 5 dòng tĩnh và các ô tính toán rời rạc bên dưới gây bối rối, thiếu công thức gợi ý và tiến trình từng bước rõ ràng cho học sinh.

---

## 2. Solutions Explored & User Decisions
- **Unified Canvas HUD Bar (No-Scroll Viewport):**
  - Đưa cụm điều khiển (Nút Thả Bi, Nút Đặt lại, Đèn LED trạng thái, Màn hình LCD mini đồng hồ hiện số) thành thanh công cụ nổi (HUD Floating Dock) gắn liền ngay trong/dưới Canvas.
  - Người dùng có thể vừa nhìn viên bi lăn vừa nhấn nút Thả bi / Đặt lại ở cùng một tầm nhìn mà không cần cuộn trang.
- **Wizard Step-by-Step Worksheet (Quy trình báo cáo 3 bước trực quan):**
  - **Bước 1: Thu thập số liệu (Data Collection):** Đo $N \ge 3$ lần với thẻ tiến độ (Lần 1, Lần 2, Lần 3), hỗ trợ nút *"Lấy số từ đồng hồ vào dòng"* hoặc gõ tay.
  - **Bước 2: Xử lý số liệu & Sai số (Analysis & Formulas):** Hiển thị công thức toán học tường minh ($\bar{t} = \frac{\sum t_i}{N}$, $\bar{v} = \frac{s}{\bar{t}}$), kèm gợi ý từng ô tính.
  - **Bước 3: Trắc nghiệm thu hoạch & Đánh giá (Quiz & Auto-grading):** 3 câu hỏi trắc nghiệm và bảng kết quả chấm điểm 3 tầng (30% Thao tác + 40% Sai số + 30% Trắc nghiệm).

---

## 3. Risks & Mitigations
- **Không gian hiển thị trên màn hình nhỏ:** Đảm bảo HUD nổi có độ co giãn responsive, không che khuất máng nghiêng hoặc cổng quang.
- **Tính toán sai số linh hoạt:** Chấp nhận cả định dạng dấu phẩy `,` và dấu chấm `.` khi học sinh nhập số thập phân.
