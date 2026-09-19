package com.edulab.service.impl;

import com.edulab.auth.dto.PendingEmailIndex;
import com.edulab.auth.dto.PendingRegistration;
import com.edulab.service.RegistrationStagingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RegistrationStagingServiceImpl implements RegistrationStagingService {

    private static final Logger log = LoggerFactory.getLogger(RegistrationStagingServiceImpl.class);

    private static final String TOKEN_PREFIX = "pending:registration:";
    private static final String EMAIL_PREFIX = "pending:registration:email:";
    private static final Duration TTL = Duration.ofMinutes(15);
    private static final long TTL_MS = 15 * 60 * 1000L;
    private static final long RESEND_COOLDOWN_MS = 60_000L; // 60 seconds
    private static final int MAX_RESEND_COUNT = 5;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    // In-memory fallback map if Redis is not running in local environment
    private final Map<String, PendingRegistrationEntry> memoryTokenStore = new ConcurrentHashMap<>();
    private final Map<String, PendingEmailIndexEntry> memoryEmailStore = new ConcurrentHashMap<>();

    private record PendingRegistrationEntry(PendingRegistration data, long expiresAt) {}
    private record PendingEmailIndexEntry(PendingEmailIndex data, long expiresAt) {}

    public RegistrationStagingServiceImpl(RedisTemplate<String, Object> redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public String stageRegistration(PendingRegistration data) {
        if (data == null || data.getEmail() == null || data.getEmail().isBlank()) {
            throw new IllegalArgumentException("Dữ liệu đăng ký tạm thời không hợp lệ!");
        }

        String email = data.getEmail().trim().toLowerCase();
        String emailKey = EMAIL_PREFIX + email;
        String token = UUID.randomUUID().toString().replace("-", "");
        String tokenKey = TOKEN_PREFIX + token;
        data.setCreatedAt(System.currentTimeMillis());
        PendingEmailIndex emailIndex = new PendingEmailIndex(token, 0, System.currentTimeMillis());

        try {
            // Check & Invalidate old token from Redis
            Object existingIndexObj = redisTemplate.opsForValue().get(emailKey);
            if (existingIndexObj != null) {
                PendingEmailIndex oldIndex = convertTo(existingIndexObj, PendingEmailIndex.class);
                if (oldIndex != null && oldIndex.getToken() != null) {
                    redisTemplate.delete(TOKEN_PREFIX + oldIndex.getToken());
                    log.info("Invalidated old registration token for email {}", data.getEmail());
                }
            }

            redisTemplate.opsForValue().set(tokenKey, data, TTL);
            redisTemplate.opsForValue().set(emailKey, emailIndex, TTL);
            log.info("Staged pending registration in Redis for email {} with token {} (TTL 15m)", email, token);
            return token;
        } catch (Exception e) {
            log.warn("Redis unavailable ({}), falling back to in-memory staging for email: {}", e.getMessage(), email);
            long now = System.currentTimeMillis();
            long expiresAt = now + TTL_MS;

            // Invalidate old in-memory token
            PendingEmailIndexEntry oldEntry = memoryEmailStore.get(email);
            if (oldEntry != null && oldEntry.data() != null && oldEntry.data().getToken() != null) {
                memoryTokenStore.remove(oldEntry.data().getToken());
            }

            memoryTokenStore.put(token, new PendingRegistrationEntry(data, expiresAt));
            memoryEmailStore.put(email, new PendingEmailIndexEntry(emailIndex, expiresAt));
            return token;
        }
    }

    @Override
    public Optional<PendingRegistration> getAndValidateToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        String cleanedToken = token.trim();
        String tokenKey = TOKEN_PREFIX + cleanedToken;

        try {
            Object obj = redisTemplate.opsForValue().get(tokenKey);
            if (obj != null) {
                PendingRegistration reg = convertTo(obj, PendingRegistration.class);
                return Optional.ofNullable(reg);
            }
        } catch (Exception e) {
            log.warn("Redis read error ({}), checking in-memory store", e.getMessage());
        }

        // Fallback check memory
        PendingRegistrationEntry entry = memoryTokenStore.get(cleanedToken);
        if (entry != null) {
            if (System.currentTimeMillis() > entry.expiresAt()) {
                memoryTokenStore.remove(cleanedToken);
                return Optional.empty();
            }
            return Optional.of(entry.data());
        }

        return Optional.empty();
    }

    @Override
    public void invalidate(String token, String email) {
        if (token != null && !token.isBlank()) {
            String cleanedToken = token.trim();
            memoryTokenStore.remove(cleanedToken);
            try {
                redisTemplate.delete(TOKEN_PREFIX + cleanedToken);
            } catch (Exception ignored) {}
        }
        if (email != null && !email.isBlank()) {
            String cleanedEmail = email.trim().toLowerCase();
            memoryEmailStore.remove(cleanedEmail);
            try {
                redisTemplate.delete(EMAIL_PREFIX + cleanedEmail);
            } catch (Exception ignored) {}
        }
    }

    @Override
    public boolean canResend(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String cleanedEmail = email.trim().toLowerCase();
        PendingEmailIndex index = getEmailIndex(cleanedEmail);
        if (index == null) return false;

        if (index.getResendCount() >= MAX_RESEND_COUNT) {
            return false;
        }

        long elapsed = System.currentTimeMillis() - index.getLastSentAt();
        return elapsed >= RESEND_COOLDOWN_MS;
    }

    @Override
    public long getRemainingCooldownSeconds(String email) {
        if (email == null || email.isBlank()) return 0;
        String cleanedEmail = email.trim().toLowerCase();
        PendingEmailIndex index = getEmailIndex(cleanedEmail);
        if (index == null) return 0;

        long elapsed = System.currentTimeMillis() - index.getLastSentAt();
        if (elapsed >= RESEND_COOLDOWN_MS) return 0;
        return (RESEND_COOLDOWN_MS - elapsed + 999) / 1000;
    }

    @Override
    public String resendRegistration(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không hợp lệ!");
        }

        String cleanedEmail = email.trim().toLowerCase();
        PendingEmailIndex index = getEmailIndex(cleanedEmail);
        if (index == null) {
            throw new IllegalStateException("Yêu cầu đăng ký đã hết hạn hoặc không tồn tại. Vui lòng đăng ký lại bằng Google.");
        }

        long elapsed = System.currentTimeMillis() - index.getLastSentAt();
        if (elapsed < RESEND_COOLDOWN_MS) {
            long remaining = (RESEND_COOLDOWN_MS - elapsed + 999) / 1000;
            throw new IllegalStateException("Vui lòng đợi " + remaining + " giây trước khi yêu cầu gửi lại email.");
        }

        if (index.getResendCount() >= MAX_RESEND_COUNT) {
            throw new IllegalStateException("Bạn đã vượt quá số lần yêu cầu gửi lại email tối đa (" + MAX_RESEND_COUNT + " lần).");
        }

        Optional<PendingRegistration> regOpt = getAndValidateToken(index.getToken());
        if (regOpt.isEmpty()) {
            throw new IllegalStateException("Yêu cầu đăng ký đã hết hạn. Vui lòng đăng ký lại.");
        }
        PendingRegistration reg = regOpt.get();

        String oldToken = index.getToken();
        String newToken = UUID.randomUUID().toString().replace("-", "");
        index.setToken(newToken);
        index.setResendCount(index.getResendCount() + 1);
        index.setLastSentAt(System.currentTimeMillis());

        try {
            redisTemplate.delete(TOKEN_PREFIX + oldToken);
            redisTemplate.opsForValue().set(TOKEN_PREFIX + newToken, reg, TTL);
            redisTemplate.opsForValue().set(EMAIL_PREFIX + cleanedEmail, index, TTL);
        } catch (Exception e) {
            log.warn("Redis error on resend ({}), updating in-memory store", e.getMessage());
            long expiresAt = System.currentTimeMillis() + TTL_MS;
            memoryTokenStore.remove(oldToken);
            memoryTokenStore.put(newToken, new PendingRegistrationEntry(reg, expiresAt));
            memoryEmailStore.put(cleanedEmail, new PendingEmailIndexEntry(index, expiresAt));
        }

        log.info("Resent registration for email {} with new token {} (Attempt {})", email, newToken, index.getResendCount());
        return newToken;
    }

    private PendingEmailIndex getEmailIndex(String cleanedEmail) {
        String emailKey = EMAIL_PREFIX + cleanedEmail;
        try {
            Object emailObj = redisTemplate.opsForValue().get(emailKey);
            if (emailObj != null) {
                return convertTo(emailObj, PendingEmailIndex.class);
            }
        } catch (Exception e) {
            log.warn("Redis read error for email index ({}), checking in-memory store", e.getMessage());
        }

        PendingEmailIndexEntry entry = memoryEmailStore.get(cleanedEmail);
        if (entry != null) {
            if (System.currentTimeMillis() > entry.expiresAt()) {
                memoryEmailStore.remove(cleanedEmail);
                return null;
            }
            return entry.data();
        }
        return null;
    }

    private <T> T convertTo(Object obj, Class<T> targetClass) {
        if (obj == null) return null;
        if (targetClass.isInstance(obj)) {
            return targetClass.cast(obj);
        }
        try {
            return objectMapper.convertValue(obj, targetClass);
        } catch (Exception e) {
            log.error("Failed to convert Redis object to {}: {}", targetClass.getSimpleName(), e.getMessage());
            return null;
        }
    }
}
