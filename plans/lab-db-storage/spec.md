# Feature Specification: Lab Catalog Database & Student Screenshot "My Storage"

**Slug:** lab-db-storage
**Status:** APPROVED
**Created:** 2026-09-11
**Last Updated:** 2026-09-11

---

## 1. Overview

EduLab requires persistent storage for the Lab Catalog in PostgreSQL and a dedicated **"My Storage" (Kho lưu trữ thí nghiệm)** timeline for students. Students performing virtual physics labs can capture high-resolution screenshots of their simulation states, upload them to Cloudinary via a secure Spring Boot Server Proxy (`/api/storage/upload`), and store records with timestamps, notes, difficulty badges, and lab metadata in PostgreSQL.

---

## 2. User Stories & Scope

### P1 (Core MVP)
- **As an Admin/System**, I can store and query the Lab Catalog metadata from PostgreSQL (`labs` table) including difficulty level, grade, domain, and simulation type.
- **As a Student**, I can click a "Chụp ảnh màn hình & Lưu kho" button inside any Lab Workspace to capture the current simulation canvas and send it via Spring Boot backend proxy to Cloudinary.
- **As a Student**, I can view my personal **"My Storage" (Kho lưu trữ thí nghiệm)** formatted as a chronological timeline journal (grouped by date) showing screenshots, lab names, timestamps, notes, difficulty badges (`DỄ`, `TRUNG BÌNH`, `NÂNG CAO`), and direct full-screen modal preview.
- **As a Student**, I can delete or edit caption notes of my stored lab screenshots in "My Storage".

### P2 (Enhancements)
- **As a Teacher**, I can view attached screenshots from a student's storage when grading their lab assignment submissions.
- **As a Student**, I can filter my stored screenshots by difficulty level (`EASY`, `MEDIUM`, `HARD`) or physics domain.

---

## 3. Database Schema

### Table 1: `labs` (Lab Catalog Metadata)
- `id` (VARCHAR 64, PK): Unique identifier (e.g., `sim-dc-circuit`, `sim-free-fall`)
- `title` (VARCHAR 255): Lab title
- `description` (TEXT): Lab description & objectives
- `subject` (VARCHAR 100): Subject (e.g., "Vật lý")
- `domain` (VARCHAR 100): Domain (e.g., "Điện & Từ Học", "Cơ Học & Năng Lượng", "Quang Học")
- `grade` (VARCHAR 50): Target grade (e.g., "Lớp 10", "Lớp 11", "Lớp 12")
- `difficulty` (VARCHAR 20): Difficulty level (`EASY`, `MEDIUM`, `HARD` / `DỄ`, `TRUNG BÌNH`, `NÂNG CAO`)
- `route` (VARCHAR 100): Frontend routing path (e.g., `/simulation`, `/srs-lab`)
- `simulation_type` (VARCHAR 50): Engine type (`CUSTOM_CANVAS`, `PHET_EMBED`, `STEP_WORKFLOW`)
- `thumbnail_url` (VARCHAR 500): Cover image URL
- `tags` (VARCHAR 255): Comma-separated or JSON array of tags
- `status` (VARCHAR 20): `PUBLISHED`, `DRAFT`, `ARCHIVED`
- `created_by` (VARCHAR 64): Admin / Teacher User ID
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Table 2: `student_lab_snapshots` (Student My Storage Timeline)
- `id` (VARCHAR 64, PK): Unique snapshot ID
- `student_id` (VARCHAR 64, FK -> users.id): Student user ID
- `lab_id` (VARCHAR 64, FK -> labs.id): Associated lab ID
- `lab_title` (VARCHAR 255): Snapshot lab title
- `screenshot_url` (VARCHAR 500): Cloudinary image URL returned by Spring Boot upload service
- `cloudinary_public_id` (VARCHAR 255): Cloudinary public ID for deletion
- `caption` (TEXT): Student optional notes / reflections
- `difficulty` (VARCHAR 20): Lab difficulty snapshot
- `score` (DOUBLE): Optional linked assignment score
- `created_at` (TIMESTAMP): Time of snapshot capture

---

## 4. Technical Architecture & Component Flow (Server Proxy Upload)

1. **Backend (Spring Boot JPA + Cloudinary SDK)**:
   - Entities: `Lab` and `StudentLabSnapshot`.
   - `CloudinaryService`: Accepts Multipart / Base64 image payload from authenticated student request, uploads securely to Cloudinary using `application.properties` credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), and persists snapshot record in PostgreSQL.
   - REST Endpoints:
     - `GET /api/labs` - Query lab catalog with filters (grade, domain, difficulty)
     - `POST /api/labs` - CRUD create lab (Admin/Teacher)
     - `POST /api/storage/upload` - Secure Proxy Upload: Receives image, uploads to Cloudinary, saves snapshot record to PostgreSQL, returns URL & snapshot metadata
     - `GET /api/storage/my-snapshots` - Fetch student's timeline snapshots
     - `DELETE /api/storage/snapshots/{id}` - Delete snapshot from DB & Cloudinary

2. **Frontend (React + HTML5 Canvas + Tailwind)**:
   - Screenshot trigger inside Lab Workspace (`.toDataURL('image/png')` or `html2canvas`).
   - Screenshot Confirmation Dialog (Add optional caption note).
   - POST Base64 image payload to `/api/storage/upload`.
   - **Student "My Storage" Page / Tab**: Vertical timeline grouped by date, showing thumbnail, lab name, difficulty badge, notes, and Lightbox preview.

---

## 5. Success Criteria

- **Measurable Benchmark 1**: Lab catalog queries support filtering by `difficulty` and return PostgreSQL results in < 100ms.
- **Measurable Benchmark 2**: Server Proxy upload to Cloudinary completes in < 2 seconds with authenticated token validation and secret masking.
- **Measurable Benchmark 3**: Timeline view correctly displays difficulty badges (`Dễ`, `Trung bình`, `Nâng cao`) for each stored item.

---

## 6. Config Requirements

- `[CLOUDINARY CONFIG]` Spring Boot `application.properties` requires:
  - `cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME:demo}`
  - `cloudinary.api-key=${CLOUDINARY_API_KEY:123456}`
  - `cloudinary.api-secret=${CLOUDINARY_API_SECRET:secret}`
