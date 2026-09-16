# Phase 01: Database Entity, Repository & Token Service

**Parent Plan:** `plans/auth-session-management/plan.md`  
**Stories Covered:** FR-01, P1

---

## Objective
Xây dựng cấu trúc dữ liệu lưu trữ Refresh Token trong cơ sở dữ liệu PostgreSQL và dịch vụ mã hóa / phát sinh token phục vụ xác thực an toàn.

---

## Detailed Tasks

1. **Tạo JPA Entity `RefreshToken`:**
   - File: `backend/src/main/java/com/edulab/model/RefreshToken.java`
   - Cột: `id` (UUID string hoặc BigInt), `userId` (String, indexed), `tokenHash` (String, indexed), `expiresAt` (Instant/LocalDateTime), `revoked` (boolean), `createdAt` (Instant), `userAgent` (String), `ipAddress` (String).

2. **Tạo `RefreshTokenRepository`:**
   - File: `backend/src/main/java/com/edulab/repository/RefreshTokenRepository.java`
   - Các phương thức:
     - `Optional<RefreshToken> findByTokenHash(String tokenHash)`
     - `List<RefreshToken> findByUserIdAndRevokedFalse(String userId)`
     - `void revokeAllByUserId(String userId)`
     - `void deleteByExpiresAtBefore(Instant now)` (dọn rác token cũ)

3. **Nâng cấp `JwtTokenProvider`:**
   - Rút ngắn thời hạn Access Token xuống **15 phút** (900 giây thay vì 86400 giây).
   - Bổ sung hàm tạo chuỗi ngẫu nhiên bảo mật cao cho Refresh Token (SecureRandom Base64Url).
   - Bổ sung hàm hash SHA-256 để lưu token dạng hash vào DB.

4. **Tạo `RefreshTokenService` & `RefreshTokenServiceImpl`:**
   - Tạo token mới, hash và lưu vào DB với thời hạn 7 ngày.
   - Xác thực token: kiểm tra hash trong DB, kiểm tra `revoked == false` và `expiresAt > now`.
   - Token Rotation: Thu hồi token cũ và phát hành token mới.
   - Phát hiện Token Reuse: Nếu token gửi lên có trong DB nhưng `revoked == true`, lập tức thu hồi toàn bộ token của `userId` đó.

---

## Verification
- Compile backend bằng lệnh `mvn test-compile` hoặc `./mvnw compile`.
- Kiểm tra các unit tests hoặc logic service kiểm tra token rotation.
