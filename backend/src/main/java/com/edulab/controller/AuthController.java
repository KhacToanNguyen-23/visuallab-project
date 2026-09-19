package com.edulab.controller;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
import com.edulab.auth.dto.OnboardingRequest;
import com.edulab.auth.dto.ResendVerificationRequest;
import com.edulab.model.User;
import com.edulab.service.RefreshTokenService;
import com.edulab.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${cookie.secure:false}")
    private boolean isCookieSecure;

    private static final String COOKIE_NAME = "edulab_refresh_token";
    private static final long REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

    public AuthController(UserService userService, RefreshTokenService refreshTokenService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        try {
            AuthResponse response = userService.register(request);
            String rawRefreshToken = refreshTokenService.createRefreshToken(
                    response.user().getId(),
                    getUserAgent(httpRequest),
                    getClientIp(httpRequest)
            );
            ResponseCookie cookie = createCookie(rawRefreshToken, REFRESH_TOKEN_MAX_AGE);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        try {
            AuthResponse response = userService.login(request);
            String rawRefreshToken = refreshTokenService.createRefreshToken(
                    response.user().getId(),
                    getUserAgent(httpRequest),
                    getClientIp(httpRequest)
            );
            ResponseCookie cookie = createCookie(rawRefreshToken, REFRESH_TOKEN_MAX_AGE);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        try {
            AuthResponse response = userService.loginWithGoogle(request);
            if ("PENDING_VERIFICATION".equalsIgnoreCase(response.status()) || response.user() == null) {
                return ResponseEntity.ok(response);
            }

            String rawRefreshToken = refreshTokenService.createRefreshToken(
                    response.user().getId(),
                    getUserAgent(httpRequest),
                    getClientIp(httpRequest)
            );
            ResponseCookie cookie = createCookie(rawRefreshToken, REFRESH_TOKEN_MAX_AGE);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestParam("token") String token, HttpServletRequest httpRequest) {
        try {
            AuthResponse response = userService.verifyRegistration(token);
            String rawRefreshToken = refreshTokenService.createRefreshToken(
                    response.user().getId(),
                    getUserAgent(httpRequest),
                    getClientIp(httpRequest)
            );
            ResponseCookie cookie = createCookie(rawRefreshToken, REFRESH_TOKEN_MAX_AGE);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "error", "TOKEN_INVALID_OR_EXPIRED"));
        }
    }

    @GetMapping("/registration-status")
    public ResponseEntity<?> getRegistrationStatus(@RequestParam("email") String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống!"));
        }
        String normalizedEmail = email.toLowerCase().trim();
        Optional<User> userOpt = userService.getUserByEmail(normalizedEmail);
        if (userOpt.isPresent() && "ACTIVE".equalsIgnoreCase(userOpt.get().getStatus())) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                    "status", "ACTIVE",
                    "user", user,
                    "onboardingCompleted", user.isOnboardingCompleted()
            ));
        }
        return ResponseEntity.ok(Map.of("status", "PENDING"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequest request) {
        try {
            userService.resendVerification(request.email());
            return ResponseEntity.ok(Map.of("message", "Email xác thực mới đã được gửi thành công!", "cooldownSeconds", 60));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(429).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(
            @RequestBody OnboardingRequest request,
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu đăng nhập để hoàn tất thông tin!"));
        }
        String token = authHeader.substring(7);
        var userOpt = userService.getUserByToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Phiên làm việc không hợp lệ!"));
        }

        try {
            User updatedUser = userService.completeOnboarding(userOpt.get().getId(), request.school());
            return ResponseEntity.ok(Map.of(
                    "user", updatedUser,
                    "message", "Hoàn tất thông tin cá nhân thành công!"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = COOKIE_NAME, required = false) String rawRefreshToken,
            HttpServletRequest httpRequest
    ) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("message", "Refresh token không tồn tại!"));
        }

        var rotationOpt = refreshTokenService.rotateRefreshToken(
                rawRefreshToken,
                getUserAgent(httpRequest),
                getClientIp(httpRequest)
        );

        if (rotationOpt.isEmpty()) {
            ResponseCookie clearCookie = createCookie("", 0);
            return ResponseEntity.status(401)
                    .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                    .body(Map.of("message", "Refresh token đã hết hạn hoặc không hợp lệ!"));
        }

        var rotation = rotationOpt.get();
        Optional<User> userOpt = userService.getUserById(rotation.userId());
        if (userOpt.isEmpty()) {
            ResponseCookie clearCookie = createCookie("", 0);
            return ResponseEntity.status(401)
                    .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        User user = userOpt.get();
        String newAccessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        ResponseCookie newCookie = createCookie(rotation.rawRefreshToken(), REFRESH_TOKEN_MAX_AGE);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                .body(new AuthResponse(newAccessToken, user, "Refresh token thành công!", user.getStatus(), user.getEmail(), user.isOnboardingCompleted()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = COOKIE_NAME, required = false) String rawRefreshToken
    ) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            refreshTokenService.revokeToken(rawRefreshToken);
        }
        ResponseCookie clearCookie = createCookie("", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .body(Map.of("message", "Đăng xuất thành công!"));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<?> logoutAll(
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu đăng nhập!"));
        }
        String token = authHeader.substring(7);
        var userOpt = userService.getUserByToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Token không hợp lệ!"));
        }

        refreshTokenService.revokeAllUserTokens(userOpt.get().getId());
        ResponseCookie clearCookie = createCookie("", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .body(Map.of("message", "Đã đăng xuất khỏi tất cả các thiết bị!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu token xác thực!"));
        }
        String token = authHeader.substring(7);
        Optional<User> userOpt = userService.getUserByToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Token không hợp lệ hoặc đã hết hạn!"));
        }
        return ResponseEntity.ok(userOpt.get());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            String email = body.get("email");
            String fullName = body.get("fullName");
            String school = body.get("school");

            String identifier = (userId != null && !userId.isBlank()) ? userId : email;
            if (identifier == null || identifier.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Thiếu định danh người dùng (userId hoặc email)!"));
            }

            User updatedUser = userService.updateProfile(identifier, fullName, school);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private ResponseCookie createCookie(String value, long maxAgeSeconds) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(isCookieSecure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax")
                .build();
    }

    private String getUserAgent(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        return ua != null ? ua : "Unknown";
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip != null ? ip : "127.0.0.1";
    }
}
