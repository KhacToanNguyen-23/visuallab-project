package com.edulab.service;

import com.edulab.auth.dto.PendingEmailIndex;
import com.edulab.auth.dto.PendingRegistration;
import com.edulab.service.impl.RegistrationStagingServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationStagingServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    private ObjectMapper objectMapper;
    private RegistrationStagingServiceImpl stagingService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        stagingService = new RegistrationStagingServiceImpl(redisTemplate, objectMapper);
    }

    @Test
    @DisplayName("stageRegistration should save token & email index to Redis with TTL")
    void stageRegistration_Success() {
        PendingRegistration reg = new PendingRegistration("student@example.com", "google-123", "Nguyễn Văn A", null, 0);

        when(valueOperations.get("pending:registration:email:student@example.com")).thenReturn(null);

        String token = stagingService.stageRegistration(reg);

        assertNotNull(token);
        assertFalse(token.isBlank());
        verify(valueOperations).set(eq("pending:registration:" + token), eq(reg), eq(Duration.ofMinutes(15)));
        verify(valueOperations).set(eq("pending:registration:email:student@example.com"), any(PendingEmailIndex.class), eq(Duration.ofMinutes(15)));
    }

    @Test
    @DisplayName("stageRegistration should invalidate existing token when same email is staged again")
    void stageRegistration_InvalidatesOldToken() {
        PendingRegistration reg = new PendingRegistration("student@example.com", "google-123", "Nguyễn Văn A", null, 0);
        PendingEmailIndex oldIndex = new PendingEmailIndex("old_token_xyz", 0, System.currentTimeMillis() - 30_000);

        when(valueOperations.get("pending:registration:email:student@example.com")).thenReturn(oldIndex);

        String newToken = stagingService.stageRegistration(reg);

        assertNotNull(newToken);
        assertNotEquals("old_token_xyz", newToken);
        verify(redisTemplate).delete("pending:registration:old_token_xyz");
    }

    @Test
    @DisplayName("getAndValidateToken should return payload when valid token exists")
    void getAndValidateToken_Found() {
        String token = "valid_token_123";
        PendingRegistration reg = new PendingRegistration("student@example.com", "google-123", "Nguyễn Văn A", null, System.currentTimeMillis());

        when(valueOperations.get("pending:registration:" + token)).thenReturn(reg);

        Optional<PendingRegistration> result = stagingService.getAndValidateToken(token);

        assertTrue(result.isPresent());
        assertEquals("student@example.com", result.get().getEmail());
        assertEquals("Nguyễn Văn A", result.get().getFullName());
    }

    @Test
    @DisplayName("getAndValidateToken should return empty when token does not exist in Redis")
    void getAndValidateToken_NotFound() {
        when(valueOperations.get("pending:registration:invalid_token")).thenReturn(null);

        Optional<PendingRegistration> result = stagingService.getAndValidateToken("invalid_token");

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("canResend should enforce 60s cooldown correctly")
    void canResend_CooldownCheck() {
        String email = "student@example.com";

        // Case 1: No pending registration -> cannot resend
        when(valueOperations.get("pending:registration:email:" + email)).thenReturn(null);
        assertFalse(stagingService.canResend(email));

        // Case 2: Sent 10s ago -> cannot resend yet
        PendingEmailIndex recentIndex = new PendingEmailIndex("token1", 1, System.currentTimeMillis() - 10_000);
        when(valueOperations.get("pending:registration:email:" + email)).thenReturn(recentIndex);
        assertFalse(stagingService.canResend(email));
        assertTrue(stagingService.getRemainingCooldownSeconds(email) > 0);

        // Case 3: Sent 65s ago -> can resend
        PendingEmailIndex readyIndex = new PendingEmailIndex("token1", 1, System.currentTimeMillis() - 65_000);
        when(valueOperations.get("pending:registration:email:" + email)).thenReturn(readyIndex);
        assertTrue(stagingService.canResend(email));
        assertEquals(0, stagingService.getRemainingCooldownSeconds(email));
    }

    @Test
    @DisplayName("resendRegistration should invalidate old token and create new one when eligible")
    void resendRegistration_Success() {
        String email = "student@example.com";
        PendingEmailIndex readyIndex = new PendingEmailIndex("token_old", 1, System.currentTimeMillis() - 65_000);
        PendingRegistration reg = new PendingRegistration(email, "google-123", "Nguyễn Văn A", null, System.currentTimeMillis() - 65_000);

        when(valueOperations.get("pending:registration:email:" + email)).thenReturn(readyIndex);
        when(valueOperations.get("pending:registration:token_old")).thenReturn(reg);

        String newToken = stagingService.resendRegistration(email);

        assertNotNull(newToken);
        assertNotEquals("token_old", newToken);
        verify(redisTemplate).delete("pending:registration:token_old");
        verify(valueOperations).set(eq("pending:registration:" + newToken), eq(reg), eq(Duration.ofMinutes(15)));
    }
}
