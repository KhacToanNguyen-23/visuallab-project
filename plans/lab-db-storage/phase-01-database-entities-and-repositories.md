# Phase 1: Database Entities & Repositories

**Objective:** Create PostgreSQL database tables (`labs` and `student_lab_snapshots`), JPA entities, repositories, and seed the initial 6 core physics labs.

## Components & Files

### [NEW] `backend/src/main/java/com/edulab/model/Lab.java`
- JPA Entity mapped to table `labs`.
- Fields: `id`, `title`, `description`, `subject`, `domain`, `grade`, `difficulty`, `route`, `simulationType`, `thumbnailUrl`, `tags`, `status`, `createdBy`, `createdAt`, `updatedAt`.

### [NEW] `backend/src/main/java/com/edulab/model/StudentLabSnapshot.java`
- JPA Entity mapped to table `student_lab_snapshots`.
- Fields: `id`, `studentId`, `labId`, `labTitle`, `screenshotUrl`, `cloudinaryPublicId`, `caption`, `difficulty`, `score`, `createdAt`.

### [NEW] `backend/src/main/java/com/edulab/repository/LabRepository.java`
- `JpaRepository<Lab, String>` with custom query methods: `findByStatus(String status)`, `findByDomain(String domain)`, `findByGrade(String grade)`.

### [NEW] `backend/src/main/java/com/edulab/repository/StudentLabSnapshotRepository.java`
- `JpaRepository<StudentLabSnapshot, String>` with query methods: `findByStudentIdOrderByCreatedAtDesc(String studentId)`.

### [MODIFY] `backend/src/main/java/com/edulab/config/DatabaseInitializer.java`
- Add seed runner to populate 6 core physics labs in `labs` table if table is empty upon application start.

---

## Verification Steps

1. Run `mvn compile` in `backend/`.
2. Start backend and verify `labs` table is seeded with 6 records.
