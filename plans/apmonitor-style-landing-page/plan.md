# Plan: VisualLab Landing Page Refactor (APMonitor Academic Editorial Style)

**Mode:** default  
**Risk:** normal — Frontend landing page visual & structural redesign, zero backend/database impact.  
**Spec:** `plans/apmonitor-style-landing-page/spec.md`  
**Date:** 2026-09-23  
**Status:** Completed  

---

## 1. Executive Summary

Refactor toàn diện giao diện trang chủ `LandingPage.tsx` của VisualLab theo phong cách **Modern Academic & Engineering Editorial** (lấy cảm hứng từ chuẩn mực của APMonitor), tối ưu hóa trải nghiệm cho 2 nhóm đối tượng cốt lõi: **Học sinh THPT (Lớp 10, 11, 12)** và **Giáo viên Vật lý**. 

Trang mới sẽ mang lại cảm giác học thuật, chuẩn mực, độ tin cậy khoa học cao với:
- Header học thuật tích hợp Mega-panel 3 cột và nút kích hoạt nhanh Command Palette.
- Hộp tìm kiếm tức thì `⌘K` / `Ctrl+K` hỗ trợ tìm kiếm bài thí nghiệm theo mã SGK GDPT 2018.
- Hero Split với bảng chỉ mục nhanh 4 nhánh (`01 Học sinh`, `02 Giáo viên`, `03 Dụng cụ ảo`, `04 Thẩm định`).
- Thanh số liệu cam kết chuẩn GDPT 2018.
- Khối phân luồng giá trị cốt lõi Học sinh vs Giáo viên (Dual-track).
- Lab Catalog dạng thẻ phẳng với mã định danh Monospace (`VL10-DH01`, `VL11-DD01`...).
- Live Interactive Workbench Showcase tích hợp mini physics simulation canvas và bảng đặc tả dụng cụ ảo.
- Academic Masthead Footer tinh gọn.

---

## 2. Phase Breakdown

- [x] **Phase 1:** Academic Header & Mega-Panel Navigation (`plans/apmonitor-style-landing-page/phase-01-academic-header-mega-panel.md`)
- [x] **Phase 2:** Command Palette Dialog (`⌘K` / `Ctrl+K`) (`plans/apmonitor-style-landing-page/phase-02-command-palette-search.md`)
- [x] **Phase 3:** Typographic Hero & Proof Rail + Metrics Strip (`plans/apmonitor-style-landing-page/phase-03-hero-proof-rail-and-metrics.md`)
- [x] **Phase 4:** Dual-Track Value & Monospace Lab Catalog (`plans/apmonitor-style-landing-page/phase-04-dual-track-and-lab-catalog.md`)
- [x] **Phase 5:** Live Interactive Workbench Showcase & Academic Footer (`plans/apmonitor-style-landing-page/phase-05-interactive-workbench-and-footer.md`)

---

## 3. Risks & Mitigations

* **Risk 1:** Trùng phím tắt `Ctrl+K` của trình duyệt.  
  * *Mitigation:* Bắt sự kiện `e.preventDefault()` khi nhấn `(e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'`. Đồng thời luôn có nút bấm trực quan trên header.
* **Risk 2:** Hiệu năng Mini Interactive Canvas trên Mobile.  
  * *Mitigation:* Sử dụng `requestAnimationFrame` được quản lý sạch sẽ, pause animation khi component unmount hoặc pause.
* **Risk 3:** Giữ tính tương thích hoàn hảo Dark/Light Theme.  
  * *Mitigation:* Tuân thủ 100% hệ thống CSS variables (`--bg-main`, `--bg-panel`, `--border-color`, `--accent-primary`, `--text-main`, `--text-muted`).

---

## Session Notes

**Last active:** 2026-09-23 23:24  
**Phase in progress:** Completed All Phases  
**Status:** All 5 phases implemented and verified clean build (tsc -b && vite build passed in 682ms).  

### Decisions made this session
- Tạo 8 modular components tại `frontend/src/components/landing/`: `LandingMegaMenu`, `LandingCommandPalette`, `LandingHero`, `LandingMetricsStrip`, `LandingDualTrack`, `LandingLabCatalog`, `LandingLiveWorkbench`, `LandingFooter`.
- Thiết lập phím tắt `Ctrl+K` / `⌘K` toàn cục cho Command Palette tra cứu 14 bài thí nghiệm GDPT 2018.
- Tích hợp 60 FPS live spring-mass oscillator mini canvas với khả năng kéo thả trực tiếp trên trang chủ.

### Next immediate action
- Bàn giao kết quả và walkthrough cho người dùng.
