package com.edulab.service;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.model.RefreshToken;
import com.edulab.repository.RefreshTokenRepository;
import com.edulab.service.impl.RefreshTokenServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class RefreshTokenServiceTest {

    private RefreshTokenRepository refreshTokenRepository;
    private JwtTokenProvider jwtTokenProvider;
    private RefreshTokenService refreshTokenService;

    @BeforeEach
    void setUp() {
        refreshTokenRepository = Mockito.mock(RefreshTokenRepository.class);
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", "TestSecretKey12345678901234567890TestSecret");
        refreshTokenService = new RefreshTokenServiceImpl(refreshTokenRepository, jwtTokenProvider);
    }

    @Test
    void testCreateRefreshToken() {
        String rawToken = refreshTokenService.createRefreshToken("u-test-1", "TestAgent", "127.0.0.1");
        assertNotNull(rawToken);
        assertFalse(rawToken.isBlank());
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void testRotateRefreshToken_Success() {
        String rawToken = jwtTokenProvider.generateRawRefreshToken();
        String hash = jwtTokenProvider.hashToken(rawToken);

        RefreshToken existing = new RefreshToken(
                "token-id-1",
                "u-test-1",
                hash,
                Instant.now().plus(7, ChronoUnit.DAYS),
                false,
                Instant.now(),
                "Mozilla/5.0",
                "127.0.0.1"
        );

        when(refreshTokenRepository.findByTokenHash(hash)).thenReturn(Optional.of(existing));

        var resultOpt = refreshTokenService.rotateRefreshToken(rawToken, "Mozilla/5.0", "127.0.0.1");
        assertTrue(resultOpt.isPresent());
        assertEquals("u-test-1", resultOpt.get().userId());
        assertNotEquals(rawToken, resultOpt.get().rawRefreshToken());
        assertTrue(existing.isRevoked());
        verify(refreshTokenRepository, atLeastOnce()).save(any(RefreshToken.class));
    }

    @Test
    void testTokenReuseDetection_RevokesAllSessions() {
        String rawToken = jwtTokenProvider.generateRawRefreshToken();
        String hash = jwtTokenProvider.hashToken(rawToken);

        // An already revoked token
        RefreshToken revokedToken = new RefreshToken(
                "token-id-2",
                "u-test-attacker",
                hash,
                Instant.now().plus(7, ChronoUnit.DAYS),
                true, // revoked!
                Instant.now(),
                "AttackerAgent",
                "10.0.0.1"
        );

        when(refreshTokenRepository.findByTokenHash(hash)).thenReturn(Optional.of(revokedToken));

        var resultOpt = refreshTokenService.rotateRefreshToken(rawToken, "AttackerAgent", "10.0.0.1");
        assertTrue(resultOpt.isEmpty());
        // Verify all user tokens revoked
        verify(refreshTokenRepository, times(1)).revokeAllByUserId("u-test-attacker");
    }

    @Test
    void testAccessTokenGenerationAndValidation() {
        String token = jwtTokenProvider.generateToken("u-123", "student@edulab.vn");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("student@edulab.vn", jwtTokenProvider.getEmailFromToken(token));
    }
}
