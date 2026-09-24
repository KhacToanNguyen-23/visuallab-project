# Implementation Plan: Bài thực hành Khảo sát chuyển động rơi tự do (Vật lý 10) - PhET Architecture
Mode: auto
Risk: normal — multi-file, testable, no auth/data/infra risk

## Overview
Xây dựng bài rơi tự do sử dụng SceneryStack của PhET. Mọi object trong mô phỏng sẽ được quản lý bởi `axon.Property` và vẽ bằng `scenery`. Đồng bộ dữ liệu sang React bằng `zustand`.

## Phases
- [x] Phase 1: SceneryStack Core & Fixed-Time Step Loop
- [x] Phase 2: Lab Components (Ball, Rail, Photogates)
- [x] Phase 3: React Zustand Bridge & UI Shell

## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** 2026-09-23 12:31
**Phase in progress:** COMPLETED
**Status:** passing

### Decisions made this session
- Tích hợp thành công `SceneryRenderer` lõi.
- Viết Unit Test cho Velocity Verlet tích phân (sai số < 0.1).
- Hoàn thành `FreeFallBall`, `Photogate`, và `FreeFallScene` giao tiếp qua `useFreeFallStore`.

### Next immediate action
(Cook hoàn tất) Chờ user xác nhận kiểm thử.
