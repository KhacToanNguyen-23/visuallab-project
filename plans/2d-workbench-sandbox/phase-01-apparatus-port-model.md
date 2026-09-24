# Phase 1: Core Data Model & Port-Socket Architecture

**File:** `plans/2d-workbench-sandbox/phase-01-apparatus-port-model.md`  
**Story Mapping:** `workbench-magnetic-port-snapping` [P1]  

---

## 1. Objective
Xây dựng mô hình dữ liệu TypeScript cho toàn bộ dụng cụ thí nghiệm (`LabApparatus`), định nghĩa hệ thống Cổng (`ApparatusPort`) và Bộ quản lý liên kết (`ConstraintManager`) để các dụng cụ tự động hút và liên kết với nhau mà không cần sửa code.

---

## 2. Proposed Changes

### `frontend/src/engine/workbench/types.ts` [NEW]
- Khai báo các interface:
  - `PortType`: `'MECHANICAL_HOOK' | 'MECHANICAL_SOCKET' | 'ELECTRICAL_POSITIVE' | 'ELECTRICAL_NEGATIVE' | 'OPTICAL_INPUT' | 'OPTICAL_OUTPUT'`
  - `ApparatusPort`: `{ id: string; type: PortType; relativePos: { x: number; y: number }; connectedTo?: { apparatusId: string; portId: string } }`
  - `PhysicsProperties`: `{ mass?: number; springConstantK?: number; restLength?: number; frictionMu?: number }`
  - `ApparatusInstance`: `{ id: string; templateId: string; name: string; x: number; y: number; width: number; height: number; rotation: number; isFixed: boolean; ports: ApparatusPort[]; properties: PhysicsProperties; state: Record<string, any> }`

### `frontend/src/engine/workbench/ConstraintManager.ts` [NEW]
- Thuật toán `findNearestCompatiblePort(draggedApparatus, allApparatus, maxRadius = 25)`
- `connectPorts(appAId, portAId, appBId, portBId)`
- `disconnectPort(appId, portId)`
- `getConnectedCluster(rootApparatusId)`: Trả về cây liên kết để tính tổng khối lượng $m_{\text{tổng}}$ hoặc xác định chuỗi nối tiếp.

---

## 3. Verification Criteria
- Unit test kiểm tra:
  - Khi đặt Quả cân cách Móc lò xo $15\text{px} \le 25\text{px}$, `findNearestCompatiblePort` phát hiện chính xác cổng mục tiêu.
  - Khi gọi `connectPorts`, liên kết 2 chiều được xác lập.
  - Khi ngắt kết nối (`disconnectPort`), các thuộc tính quay về độc lập.
