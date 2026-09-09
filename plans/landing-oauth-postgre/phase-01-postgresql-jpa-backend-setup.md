# Phase 1: PostgreSQL & Spring Data JPA Database Setup (Backend)

**Goal:** Chuyển đổi dữ liệu tài khoản người dùng từ In-Memory sang PostgreSQL Database chuẩn doanh nghiệp bằng Spring Data JPA.

---

## Deliverables

1. `backend/pom.xml`: Thêm PostgreSQL driver & Spring Data JPA Starter.
2. `backend/src/main/resources/application.properties` / `application.yml`: Cấu hình PostgreSQL (`jdbc:postgresql://localhost:5432/edulab`) kèm fallback H2 database cho dev test.
3. `User.java`: Annotations `@Entity`, `@Table(name = "users")`, bổ sung trường `role` (`STUDENT`/`TEACHER`) & `authProvider` (`LOCAL`/`GOOGLE`).
4. `UserRepository.java`: Chuyển đổi sang `JpaRepository<User, String>`.

---

## Tasks

- [ ] Cập nhật `pom.xml` thêm dependencies cho JPA & PostgreSQL.
- [ ] Cấu hình datasource connection string.
- [ ] Cập nhật Entity `User` với đầy đủ annotations và trường dữ liệu.
- [ ] Chuyển đổi `UserRepository` interface.
- [ ] Kiểm thử build `mvn clean test-compile`.
