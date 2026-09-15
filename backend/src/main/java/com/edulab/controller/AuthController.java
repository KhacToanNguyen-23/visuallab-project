package com.edulab.controller;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
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
                    .body(Map.of("message", "Phiên đăng nhập không hợp lệ hoặc đã bị thu hồi!"));
        }

        var result = rotationOpt.get();
        Optional<User> userOpt = userService.getUserById(result.userId());
        if (userOpt.isEmpty()) {
            ResponseCookie clearCookie = createCookie("", 0);
            return ResponseEntity.status(401)
                    .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        User user = userOpt.get();
        String newAccessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        ResponseCookie newCookie = createCookie(result.rawRefreshToken(), REFRESH_TOKEN_MAX_AGE);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                .body(new AuthResponse(newAccessToken, user, "Làm mới token thành công!"));
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
            @RequestHeader(value = "Authorization", required = false) String bearerToken,
            @CookieValue(name = COOKIE_NAME, required = false) String rawRefreshToken
    ) {
        String userId = null;
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            Optional<User> userOpt = userService.getUserByToken(token);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
            }
        }

        if (userId == null && rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            userId = refreshTokenService.getUserIdByRawToken(rawRefreshToken).orElse(null);
        }

        if (userId != null) {
            refreshTokenService.revokeAllUserTokens(userId);
        }

        ResponseCookie clearCookie = createCookie("", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearCookie.toString())
                .body(Map.of("message", "Đã đăng xuất khỏi tất cả các thiết bị!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Token xác thực không hợp lệ!"));
        }

        String token = bearerToken.substring(7);
        return userService.getUserByToken(token)
                .map(user -> ResponseEntity.ok((Object) user))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("message", "Phiên làm việc đã hết hạn!")));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String email = body.get("email");
        String fullName = body.get("fullName");
        String school = body.get("school");

        String targetId = (userId != null && !userId.isBlank()) ? userId : email;
        if (targetId == null || targetId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã người dùng hoặc email không hợp lệ!"));
        }

        try {
            var updatedUser = userService.updateProfile(targetId, fullName, school);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private ResponseCookie createCookie(String value, long maxAge) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(isCookieSecure)
                .path("/api/auth")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
    }

    private String getUserAgent(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        return ua != null ? (ua.length() > 500 ? ua.substring(0, 500) : ua) : "Unknown";
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
