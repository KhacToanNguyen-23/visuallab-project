# Phase 2: Cloudinary Service & REST Controller API

**Objective:** Implement secure server-side proxy upload service to Cloudinary and REST endpoints for Lab Catalog & Student Storage.

## Components & Files

### [MODIFY] `backend/src/main/resources/application.properties`
- Add Cloudinary properties:
  - `cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME:demo}`
  - `cloudinary.api-key=${CLOUDINARY_API_KEY:123456789}`
  - `cloudinary.api-secret=${CLOUDINARY_API_SECRET:secret}`

### [NEW] `backend/src/main/java/com/edulab/service/CloudinaryService.java` & `CloudinaryServiceImpl.java`
- Upload Base64 / Multipart image to Cloudinary API using RestTemplate or Cloudinary Java SDK.
- Delete image from Cloudinary using `cloudinaryPublicId`.

### [NEW] `backend/src/main/java/com/edulab/controller/LabController.java`
- `GET /api/labs`: Return list of published labs from PostgreSQL.
- `GET /api/labs/{id}`: Return single lab detail.
- `POST /api/labs`: Admin/Teacher lab creation endpoint.

### [NEW] `backend/src/main/java/com/edulab/controller/StorageController.java`
- `POST /api/storage/upload`: Server Proxy Endpoint receiving `{ labId, labTitle, imageBase64, caption, difficulty }`, uploading to Cloudinary, saving snapshot to DB, returning snapshot DTO.
- `GET /api/storage/my-snapshots`: Return current student's snapshot timeline.
- `DELETE /api/storage/snapshots/{id}`: Delete snapshot from DB & Cloudinary.

---

## Verification Steps

1. Run `mvn test` in `backend/`.
2. Test `/api/labs` via curl or Postman.
