---
name: deep-verify
description: "Thẩm định sâu đa tầng (Code diff, Build/Test, API contract, Run logs, UI & Routing) đối với các thay đổi và kết quả công việc đã thực hiện trước khi công bố hoàn thành. Sử dụng khi người dùng yêu cầu 'kiểm tra sâu', 'audit công việc', 're-verify', 'nghiệm thu', 'kiểm tra lại những gì đã làm', 'deep verify', hoặc khi kết thúc một task/phase lớn."
---

# Deep Verify - Thẩm Định Sâu Kết Quả Công Việc Đã Thực Hiện

Skill này hướng dẫn quy trình kiểm tra và nghiệm thu kỹ thuật đa tầng đối với toàn bộ các chỉnh sửa code, cấu hình, build và luồng hoạt động của hệ thống.

---

## Quy Trình 6 Bước Thẩm Định Sâu

### Bước 1: Audit Code Diff & Phạm Vi Thay Đổi (Git Audit)
- Kiểm tra toàn bộ danh sách file đã chỉnh sửa hoặc tạo mới bằng các lệnh kiểm tra VCS (`git status`, `git diff`).
- Đảm bảo:
  - Không còn file rác, file tạm hay console log/debug thừa.
  - Không vô tình xóa bớt comment, logic không liên quan.
  - Tuân thủ nguyên tắc YAGNI và KISS.

### Bước 2: Thẩm Định Biên Dịch & Static Type Check
- **Frontend**: Chạy kiểm tra kiểu dữ liệu và cú pháp:
  ```bash
  npx tsc --noEmit
  ```
- **Backend (Spring Boot / Java)**: Kiểm tra biên dịch backend:
  ```bash
  mvn test-compile
  ```
- **Yêu cầu**: Kết quả biên dịch phải đạt **0 error**.

### Bước 3: Thẩm Định Log Runtime & Service Health
- Đọc log hoạt động thực tế của backend và dev server frontend (Console logs / Terminal outputs).
- Tìm kiếm các dấu hiệu bất thường ngầm:
  - `NullPointerException`, `ClassCastException`, `500 Internal Server Error`.
  - Cảnh báo CORS, `404 Not Found`, v.v.
- Đảm bảo các dịch vụ daemon/server vẫn đang hoạt động ổn định.

### Bước 4: Thẩm Định Hợp Đồng API & Dữ Liệu (API Contract)
- Kiểm tra sự khớp giữa Frontend Service (endpoint URL, DTO fields, query params) và Backend Controller/Entity.
- Xác nhận các kiểu dữ liệu `JSON` được mã hóa/giải mã đúng chuẩn.

### Bước 5: Thẩm Định Luồng Điều Hướng & UI (Routing & UX)
- Kiểm tra tính đúng đắn của React Router (`main.tsx`, `Routes`):
  - Mỗi thẻ/nút điều hướng phải trỏ đúng URL riêng biệt.
  - Không dùng fallback `/simulation` hoặc trỏ nhầm giao diện mẫu khi bấm vào bài tập/tính năng cụ thể.
- Kiểm tra màu sắc và layout theo đúng chuẩn hệ thống thiết kế VisualLab (UI Rules).

### Bước 6: Đánh Giá Tác Dụng Phụ (Regression & Edge Cases)
- Rà soát xem thay đổi mới có gây hỏng hóc hoặc xung đột tới các màn hình/tính năng liên quan không.

---

## Báo Cáo Thẩm Định (Verification Report)

Sau khi thực hiện quy trình 6 bước, xuất báo cáo ngắn gọn theo cấu trúc sau:

```markdown
# 📋 Báo Cáo Thẩm Định Sâu (Deep Verify Report)

### 1. Phạm Vi Kiểm Tra
- Các file đã thay đổi: [Danh sách file/component]
- Luồng tính năng: [Tên tính năng/quy trình]

### 2. Kết Quả Kiểm Tra Đa Tầng
| Tầng kiểm tra | Trạng thái | Bằng chứng / Ghi chú |
| :--- | :---: | :--- |
| **Git & Code Diff** | 🟢 PASS | Code sạch, đúng định dạng, không còn log thừa |
| **Biên Dịch (Build/Type)** | 🟢 PASS | `npx tsc --noEmit` / `mvn` thành công 0 lỗi |
| **Log Runtime** | 🟢 PASS | Server hoạt động ổn định, 0 lỗi 500/NPE |
| **API Contract** | 🟢 PASS | URL & Payload tương thích |
| **UI & Routing** | 🟢 PASS | Điều hướng chính xác |
| **Regression** | 🟢 PASS | Không ảnh hưởng tính năng cũ |

### 3. Kết Luận
- **Trạng thái**: ĐẠT GIỜ NGHIỆM THU (Ready for completion)
- **Lưu ý (nếu có)**: [Các lưu ý vận hành hoặc bước tiếp theo]
```
