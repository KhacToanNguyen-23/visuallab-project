# Brainstorm: Persistence for Lab Catalog & Student Screenshot "My Storage"

**Date:** 2026-09-11

## Ideas Explored
1. **Lab Catalog Storage**:
   - *Option 1 (Chosen)*: Database Metadata (`labs` JPA Entity table in PostgreSQL). Admin/Teacher can manage labs dynamically; lightweight schema storing metadata (title, domain, grade, difficulty level, description, route, tags, status).
   - *Option 2*: Storing full JSON simulation configurations inside DB. Dismissed for MVP as frontends handle interactive physics engines locally.

2. **Screenshot Storage Architecture**:
   - *Option A (Direct Client Cloudinary Upload)*: Frontend uploads canvas image directly using Cloudinary Unsigned Upload Preset. (Dismissed: exposes unsigned preset key).
   - *Option B (Server Proxy Upload - SELECTED)*: Frontend captures canvas, sends Base64 / Multipart to Spring Boot backend (`/api/storage/upload`). Spring Boot uploads to Cloudinary using API Key & Secret from `application.properties`.
     - ✓ Secure API credentials, validated user tokens, backend logs screenshot URL in PostgreSQL directly.

3. **Student "My Storage" Layout**:
   - *Option 1 (Chosen)*: Timeline History Journal (Nhật ký thực hành theo mốc thời gian). Grouped by date, displaying screenshot preview, lab name, difficulty badge (`Dễ`, `Trung bình`, `Nâng cao`), notes/reflections, and completion score.
   - *Option 2*: Grid Gallery. Dismissed in favor of timeline journal to track student progress over time.

## User's Direction
- **Lab Metadata in DB**: Store lab catalog metadata in PostgreSQL (`labs` table) including difficulty level (`EASY`, `MEDIUM`, `HARD`).
- **Cloudinary Free Tier via Server Proxy (Option B)**: Upload screenshots through Spring Boot backend proxy (`/api/storage/upload`) to Cloudinary and save media URL + metadata in PostgreSQL.
- **Timeline Journal ("My Storage")**: Display screenshots, difficulty badges, and lab notes chronologically in a dedicated student storage page.

## Open Questions
1. Should screenshot capture be automatically triggered upon lab completion/submission or strictly manually triggered by student button click?
2. Should teacher be able to view students' "My Storage" screenshots when grading lab assignments?

## Risks
1. **Cloudinary Rate Limit / Free Tier Quota**: Exceeding 25 GB bandwidth or transformation limits. *Mitigation*: Compress images to JPEG/WebP on client before uploading.
2. **Orphaned Media Files**: Screenshots saved to Cloudinary but failed to save in PostgreSQL. *Mitigation*: Transactional database save upon successful Cloudinary response.
