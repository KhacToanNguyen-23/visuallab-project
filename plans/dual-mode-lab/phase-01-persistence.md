# Phase 1: Data Models & Persistence

## Goal
Thiết lập schema DB lưu trữ Sandbox state (JSONB) và thiết lập Zustand store ở client để quản lý cấu hình các objects trong lab.

## Stories Covered
- **[P1]** As a Admin, I want to quản lý nội dung bài lab và cấu hình hệ thống.
- **[P2]** As a Học sinh, I want to lưu lại thí nghiệm sandbox của mình.

## File Ownership
- Backend DB: `backend/src/models/` (Prisma/TypeORM schemas)
- Client State: `frontend/src/store/` (Zustand)

## Proposed Changes
1. **Database Schema (Backend)**
   - Sử dụng cột `JSONB` **đã có sẵn trong database** (theo xác nhận của user) để lưu trữ `stateData` (lưu mảng entities, physics settings, etc.) của bài Sandbox. Không cần thiết kế bảng mới từ đầu.
2. **Zustand Store (Frontend)**
   - Tạo `useLabStore.ts`
   - State bao gồm: `entities: Record<string, LabEntity>`, `mode: 'sandbox' | 'guided'`
   - Type `LabEntity` = `{ id: string, type: ToolID, config: any, initialTransform: {x, y, rotation} }`
   - Actions: `addEntity`, `removeEntity`, `updateEntityConfig`, `loadState`, `saveState`

## Tests to Write First
- Test Zustand `addEntity` và `updateEntityConfig` không mutate state trực tiếp.
- Test endpoint lưu và tải state JSONB từ backend (đảm bảo serialization đúng).
