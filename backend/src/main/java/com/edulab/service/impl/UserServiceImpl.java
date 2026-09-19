package com.edulab.service.impl;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
import com.edulab.auth.dto.PendingRegistration;
import com.edulab.model.User;
import com.edulab.repository.ClassEnrollmentRepository;
import com.edulab.repository.ClassroomRepository;
import com.edulab.repository.UserRepository;
import com.edulab.service.EmailService;
import com.edulab.service.GoogleAuthService;
import com.edulab.service.RegistrationStagingService;
import com.edulab.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleAuthService googleAuthService;
    private final RegistrationStagingService stagingService;
    private final EmailService emailService;
    private final ClassroomRepository classroomRepository;
    private final ClassEnrollmentRepository enrollmentRepository;
    private final String frontendUrl;

    public UserServiceImpl(
            UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider,
            GoogleAuthService googleAuthService,
            RegistrationStagingService stagingService,
            EmailService emailService,
            ClassroomRepository classroomRepository,
            ClassEnrollmentRepository enrollmentRepository,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.googleAuthService = googleAuthService;
        this.stagingService = stagingService;
        this.emailService = emailService;
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public AuthResponse register(AuthRequest request) {
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email không được để trống!");
        }

        if (userRepository.findByEmail(request.email().toLowerCase()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại trên hệ thống!");
        }

        User newUser = new User(
            "u-" + UUID.randomUUID().toString().substring(0, 8),
            request.email().toLowerCase(),
            request.password() != null ? request.password() : "oauth_default_password",
            request.fullName() != null ? request.fullName() : "Học viên EduLab",
            request.role() != null ? request.role() : "STUDENT",
            request.school() != null ? request.school() : "Trường THPT EduLab",
            "LOCAL",
            null,
            "ACTIVE",
            true
        );

        userRepository.save(newUser);
        String token = jwtTokenProvider.generateToken(newUser.getId(), newUser.getEmail());
        return new AuthResponse(token, newUser, "Đăng ký tài khoản thành công!", newUser.getStatus(), newUser.getEmail(), newUser.isOnboardingCompleted());
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        if (request.email() == null) {
            throw new IllegalArgumentException("Email không được để trống!");
        }

        Optional<User> userOpt = userRepository.findByEmail(request.email().toLowerCase());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác!");
        }

        User user = userOpt.get();
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalArgumentException("Tài khoản của bạn đang ở trạng thái: " + user.getStatus() + ". Vui lòng liên hệ quản trị viên.");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user, "Đăng nhập thành công!", user.getStatus(), user.getEmail(), user.isOnboardingCompleted());
    }

    @Override
    public AuthResponse loginWithGoogle(AuthRequest request) {
        String email = request.email();
        String fullName = request.fullName();
        String googleId = null;

        // If ID Token is present, verify with Google Auth Service
        if (request.googleIdToken() != null && !request.googleIdToken().isBlank()) {
            GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.googleIdToken());
            if (payload != null && payload.getEmail() != null) {
                email = payload.getEmail();
                googleId = payload.getSubject();
                if (fullName == null || fullName.isBlank()) {
                    fullName = (String) payload.get("name");
                }
            }
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Thông tin Google Token không hợp lệ!");
        }

        email = email.toLowerCase().trim();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
                throw new IllegalArgumentException("Tài khoản của bạn đang ở trạng thái: " + user.getStatus() + ". Vui lòng liên hệ quản trị viên.");
            }

            if (googleId != null && (user.getGoogleId() == null || user.getGoogleId().isBlank())) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }

            String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
            return new AuthResponse(token, user, "Đăng nhập Google thành công!", user.getStatus(), user.getEmail(), user.isOnboardingCompleted());
        }

        // Unregistered user -> Stage pending registration in Redis and send verification email
        PendingRegistration pendingData = new PendingRegistration(
                email,
                googleId != null ? googleId : ("mock-gid-" + UUID.randomUUID().toString().substring(0, 8)),
                fullName != null ? fullName : "Học sinh EduLab",
                null,
                System.currentTimeMillis()
        );

        String stagingToken = stagingService.stageRegistration(pendingData);
        String verificationUrl = frontendUrl + "/verify-registration?token=" + stagingToken;
        emailService.sendVerificationEmail(email, fullName, verificationUrl);

        return new AuthResponse(
                null,
                null,
                "Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản.",
                "PENDING_VERIFICATION",
                email,
                false
        );
    }

    @Override
    public AuthResponse verifyRegistration(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Mã xác thực không hợp lệ!");
        }

        PendingRegistration reg = stagingService.getAndValidateToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Liên kết xác thực không hợp lệ hoặc đã hết hạn!"));

        String email = reg.getEmail().toLowerCase().trim();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User user;
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
                throw new IllegalArgumentException("Tài khoản đang bị khóa hoặc vô hiệu hóa.");
            }
        } else {
            // Create official active Student user in PostgreSQL
            user = new User(
                    "gg-" + UUID.randomUUID().toString().substring(0, 8),
                    email,
                    "google_authenticated_oauth_secret",
                    reg.getFullName() != null && !reg.getFullName().isBlank() ? reg.getFullName() : "Học sinh EduLab",
                    "STUDENT", // Role strictly enforced
                    "Chưa cập nhật trường học",
                    "GOOGLE",
                    reg.getGoogleId(),
                    "ACTIVE",
                    false // Needs onboarding
            );
            user = userRepository.save(user);
        }

        // Clean up Redis staging keys
        stagingService.invalidate(token, email);

        String jwtToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(
                jwtToken,
                user,
                "Xác thực email thành công! Chào mừng bạn đến với EduLab.",
                user.getStatus(),
                user.getEmail(),
                user.isOnboardingCompleted()
        );
    }

    @Override
    public void resendVerification(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống!");
        }

        String normalizedEmail = email.toLowerCase().trim();
        Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);
        if (existingUser.isPresent() && "ACTIVE".equalsIgnoreCase(existingUser.get().getStatus())) {
            throw new IllegalArgumentException("Tài khoản này đã được kích hoạt. Bạn có thể đăng nhập ngay.");
        }

        String newToken = stagingService.resendRegistration(normalizedEmail);
        String verificationUrl = frontendUrl + "/verify-registration?token=" + newToken;
        emailService.sendVerificationEmail(normalizedEmail, null, verificationUrl);
    }

    @Override
    public User completeOnboarding(String userId, String school) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("User ID không hợp lệ!");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(userId.toLowerCase().trim());
        }
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Người dùng không tồn tại!");
        }

        User user = userOpt.get();
        if (school != null && !school.isBlank()) {
            user.setSchool(school.trim());
        }
        user.setOnboardingCompleted(true);
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserByToken(String token) {
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return Optional.empty();
        }
        String email = jwtTokenProvider.getEmailFromToken(token);
        return userRepository.findByEmail(email.toLowerCase());
    }

    @Override
    public Optional<User> getUserById(String userId) {
        if (userId == null || userId.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        if (email == null || email.isBlank()) return Optional.empty();
        return userRepository.findByEmail(email.toLowerCase().trim());
    }

    @Override
    public User updateProfile(String userId, String fullName, String school) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(userId.toLowerCase());
        }
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Người dùng không tồn tại!");
        }

        User user = userOpt.get();
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (school != null && !school.isBlank()) {
            user.setSchool(school.trim());
        }

        User savedUser = userRepository.save(user);

        if ("TEACHER".equalsIgnoreCase(savedUser.getRole()) && classroomRepository != null) {
            var classes = classroomRepository.findByTeacherId(savedUser.getId());
            for (var c : classes) {
                c.setTeacherName(savedUser.getFullName());
                classroomRepository.save(c);

                if (enrollmentRepository != null) {
                    var roster = enrollmentRepository.findByClassId(c.getId());
                    for (var enr : roster) {
                        enr.setTeacherName(savedUser.getFullName());
                        enrollmentRepository.save(enr);
                    }
                }
            }
        }

        return savedUser;
    }
}
