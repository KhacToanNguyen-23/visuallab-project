package com.edulab.service;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
import com.edulab.auth.dto.PendingRegistration;
import com.edulab.model.User;
import com.edulab.repository.ClassEnrollmentRepository;
import com.edulab.repository.ClassroomRepository;
import com.edulab.repository.UserRepository;
import com.edulab.service.impl.UserServiceImpl;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceGoogleAuthTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private GoogleAuthService googleAuthService;

    @Mock
    private RegistrationStagingService stagingService;

    @Mock
    private EmailService emailService;

    @Mock
    private ClassroomRepository classroomRepository;

    @Mock
    private ClassEnrollmentRepository enrollmentRepository;

    private UserServiceImpl userService;
    private final String frontendUrl = "http://localhost:5173";

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(
                userRepository,
                jwtTokenProvider,
                googleAuthService,
                stagingService,
                emailService,
                classroomRepository,
                enrollmentRepository,
                frontendUrl
        );
    }

    @Test
    @DisplayName("loginWithGoogle for unregistered user stages pending registration in Redis and dispatches email")
    void loginWithGoogle_Unregistered_StagesInRedis() {
        String email = "new_student@gmail.com";
        String googleId = "gid-123456";
        String fullName = "Nguyễn Văn Mới";

        GoogleIdToken.Payload mockPayload = new GoogleIdToken.Payload();
        mockPayload.setEmail(email);
        mockPayload.setSubject(googleId);
        mockPayload.set("name", fullName);

        when(googleAuthService.verifyToken("valid_google_token")).thenReturn(mockPayload);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(stagingService.stageRegistration(any(PendingRegistration.class))).thenReturn("staging_token_abc");

        AuthRequest request = new AuthRequest(null, null, null, null, null, "valid_google_token");
        AuthResponse response = userService.loginWithGoogle(request);

        assertEquals("PENDING_VERIFICATION", response.status());
        assertNull(response.token());
        assertEquals(email, response.email());
        assertFalse(response.onboardingCompleted());

        verify(stagingService).stageRegistration(argThat(data ->
                data.getEmail().equals(email) && data.getGoogleId().equals(googleId) && data.getFullName().equals(fullName)
        ));
        verify(emailService).sendVerificationEmail(eq(email), eq(fullName), eq("http://localhost:5173/verify-registration?token=staging_token_abc"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("loginWithGoogle for active user issues token directly without email dispatch")
    void loginWithGoogle_ActiveUser_DirectLogin() {
        String email = "active_student@gmail.com";
        User existingUser = new User("gg-1", email, "secret", "Nguyễn Văn Active", "STUDENT", "THPT Chuyên", "GOOGLE", "gid-999", "ACTIVE", true);

        GoogleIdToken.Payload mockPayload = new GoogleIdToken.Payload();
        mockPayload.setEmail(email);
        mockPayload.setSubject("gid-999");
        mockPayload.set("name", "Nguyễn Văn Active");

        when(googleAuthService.verifyToken("valid_google_token")).thenReturn(mockPayload);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));
        when(jwtTokenProvider.generateToken("gg-1", email)).thenReturn("jwt_access_token_xyz");

        AuthRequest request = new AuthRequest(null, null, null, null, null, "valid_google_token");
        AuthResponse response = userService.loginWithGoogle(request);

        assertEquals("ACTIVE", response.status());
        assertEquals("jwt_access_token_xyz", response.token());
        assertEquals(existingUser, response.user());
        assertTrue(response.onboardingCompleted());

        verify(emailService, never()).sendVerificationEmail(anyString(), any(), anyString());
        verify(stagingService, never()).stageRegistration(any());
    }

    @Test
    @DisplayName("loginWithGoogle for suspended user throws security exception")
    void loginWithGoogle_SuspendedUser_ThrowsException() {
        String email = "banned@gmail.com";
        User suspendedUser = new User("gg-2", email, "secret", "Banned User", "STUDENT", "THPT", "GOOGLE", "gid-000", "SUSPENDED", true);

        GoogleIdToken.Payload mockPayload = new GoogleIdToken.Payload();
        mockPayload.setEmail(email);
        mockPayload.setSubject("gid-000");

        when(googleAuthService.verifyToken("token_banned")).thenReturn(mockPayload);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(suspendedUser));

        AuthRequest request = new AuthRequest(null, null, null, null, null, "token_banned");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> userService.loginWithGoogle(request));
        assertTrue(ex.getMessage().contains("SUSPENDED"));
    }

    @Test
    @DisplayName("verifyRegistration activates STUDENT user in DB with onboardingCompleted=false and invalidates token")
    void verifyRegistration_Success() {
        String token = "valid_verify_token";
        PendingRegistration reg = new PendingRegistration("verify_me@gmail.com", "gid-888", "Trần Thị B", null, System.currentTimeMillis());

        when(stagingService.getAndValidateToken(token)).thenReturn(Optional.of(reg));
        when(userRepository.findByEmail("verify_me@gmail.com")).thenReturn(Optional.empty());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(userCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.generateToken(anyString(), eq("verify_me@gmail.com"))).thenReturn("new_jwt_token");

        AuthResponse response = userService.verifyRegistration(token);

        assertNotNull(response.token());
        assertEquals("ACTIVE", response.status());
        assertFalse(response.onboardingCompleted());

        User savedUser = userCaptor.getValue();
        assertEquals("verify_me@gmail.com", savedUser.getEmail());
        assertEquals("STUDENT", savedUser.getRole()); // Strictly enforced
        assertEquals("ACTIVE", savedUser.getStatus());
        assertFalse(savedUser.isOnboardingCompleted());

        verify(stagingService).invalidate(token, "verify_me@gmail.com");
    }

    @Test
    @DisplayName("verifyRegistration with invalid token throws exception")
    void verifyRegistration_InvalidToken() {
        when(stagingService.getAndValidateToken("bad_token")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> userService.verifyRegistration("bad_token"));
    }

    @Test
    @DisplayName("completeOnboarding updates school and flags onboardingCompleted=true")
    void completeOnboarding_Success() {
        User user = new User("gg-3", "student@gmail.com", "secret", "Học sinh", "STUDENT", null, "GOOGLE", "gid-1", "ACTIVE", false);

        when(userRepository.findById("gg-3")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.completeOnboarding("gg-3", "THPT Lê Hồng Phong");

        assertEquals("THPT Lê Hồng Phong", updated.getSchool());
        assertTrue(updated.isOnboardingCompleted());
    }
}
