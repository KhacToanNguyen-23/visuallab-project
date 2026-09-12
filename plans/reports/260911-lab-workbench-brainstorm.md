# Brainstorm: Universal Physics Workbench (Bàn Làm Việc Thí Nghiệm Vật Lý Tự Do PhET SceneryStack)

**Date:** 2026-09-11
**Author:** EduLab Agentic Pair
**Status:** Approved Direction

---

## Ideas Explored

1. **Direction A: SceneryStack Dynamic Component Graph & Snap-Port Engine (Selected)**
   - Sandbox tự do 100%, kéo thả linh kiện từ Palette vào SceneryStack Canvas.
   - Mỗi linh kiện sở hữu các điểm kết nối từ tính (`SnapPort` / `CircuitTerminal`). Khi kéo gần ($<15\text{px}$), tự động từ tính hút dính (Magnetic Snap) và khởi tạo liên kết vật lý (Cơ học: móc lò xo/dây treo; Điện học: nối dây điện/bóng đèn/pin; Quang học: tia laser/thấu kính).
   - Render mượt mà 60 FPS chuẩn PhET SceneryStack.

2. **Direction B: Fixed Grid Anchor Workbench (Dismissed)**
   - Chia mặt bàn thí nghiệm thành các điểm neo lưới cố định (breadboard style).
   - Bị hạn chế khả năng sáng tạo không gian tự do của học sinh.

---

## User's Direction

- **Lựa chọn**: **Direction A** (Dynamic Snap-Port Engine).
- **Phạm vi lĩnh vực**: Hỗ trợ đồng thời cả **3 mảng Vật lý (Cơ học + Điện học + Quang học)** trong phiên bản MVP.
- **Trải nghiệm mong muốn**: Linh hoạt, kéo thả mượt mà, ghép nối tự nhiên như thực hành thực tế ngoài đời (móc quả nặng vào lò xo/dây, nối dây điện vào pin/bóng đèn, chiếu laser qua thấu kính).

---

## Architecture & Tech Stack

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │            UNIVERSAL PHYSICS WORKBENCH                 │
                                  └────────────────────────────────────────────────────────┘
                                                              │
             ┌────────────────────────────────────────────────┼────────────────────────────────────────────────┐
             ▼                                                ▼                                                ▼
   ⚙️ MECHANICS SOLVER                              ⚡ ELECTRICAL SOLVER                             🔦 OPTICS SOLVER
  (Hooke's Law & Euler-Cromer)                     (Nodal Analysis & Kirchhoff)                   (Snell's Law & Ray Tracing)
  - Lò xo, Dây treo, Quả nặng                      - Pin, Bóng đèn, Điện trở, Công tắc            - Đèn Laser, Thấu kính hội tụ/phân kỳ,
  - Ghép nối tiếp/song song                         - Mạch nối tiếp, song song, hỗn hợp             Thước đo góc 360°
             │                                                │                                                │
             └────────────────────────────────────────────────┼────────────────────────────────────────────────┘
                                                              ▼
                                             🎨 SCENERYSTACK SCENEGRAPH ENGINE
                                            (Display, Node, Path, SnapPort, Axon)
```

---

## Open Questions for Implementation Plan (`$bb-plan`)

1. Cấu trúc state serialization: Làm thế nào để lưu/tải (Save/Load JSON) toàn bộ sơ đồ bài lab custom của học sinh vào Cloudinary/LocalStorage?
2. Giới hạn số lượng linh kiện đồng thời trên canvas để luôn giữ mượt 60 FPS trên máy cấu hình trung bình.

---

## Key Risks & Mitigation

1. **Risk: Xung đột tính toán khi ghép mạch điện phức tạp hoặc hệ cơ học đa vật thể.**
   - *Mitigation*: Viết Solver tính toán dạng ma trận đơn giản (Nodal Analysis cho điện; Spring-Mass Chain solver cho cơ) có giới hạn vòng lặp đệ quy tối đa.
2. **Risk: Thao tác kéo thả bị giậtlag khi có nhiều node.**
   - *Mitigation*: Sử dụng `Scenery.DragListener` kết hợp `scenerystack/axon` `Property` cập nhật tọa độ thay vì re-render toàn bộ React component tree.
