package com.edulab.service.impl;

import com.edulab.auth.JwtTokenProvider;
import com.edulab.auth.dto.AuthRequest;
import com.edulab.auth.dto.AuthResponse;
import com.edulab.model.User;
import com.edulab.repository.UserRepository;
import com.edulab.service.GoogleAuthService;
import com.edulab.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.edulab.repository.ClassEnrollmentRepository;
import com.edulab.repository.ClassroomRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final GoogleAuthService googleAuthService;
    private final ClassroomRepository classroomRepository;
    private final ClassEnrollmentRepository enrollmentRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider,
            GoogleAuthService googleAuthService,
            ClassroomRepository classroomRepository,
            ClassEnrollmentRepository enrollmentRepository
    ) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.googleAuthService = googleAuthService;
        this.classroomRepository = classroomRepository;
        this.enrollmentRepository = enrollmentRepository;
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
            "LOCAL"
        );

        userRepository.save(newUser);
        String token = jwtTokenProvider.generateToken(newUser.getId(), newUser.getEmail());
        return new AuthResponse(token, newUser, "Đăng ký tài khoản thành công!");
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
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user, "Đăng nhập thành công!");
    }

    @Override
    public AuthResponse loginWithGoogle(AuthRequest request) {
        String email = request.email();
        String fullName = request.fullName();

        // If ID Token is present, verify with Google Auth Service
        if (request.googleIdToken() != null && !request.googleIdToken().isBlank()) {
            GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.googleIdToken());
            if (payload != null && payload.getEmail() != null) {
                email = payload.getEmail();
                if (fullName == null || fullName.isBlank()) {
                    fullName = (String) payload.get("name");
                }
            }
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Thông tin Google Token không hợp lệ!");
        }

        email = email.toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            // Preserve existing user's custom fullName and school if already present in database
            if (request.role() != null) user.setRole(request.role());
            if ((user.getSchool() == null || user.getSchool().isBlank() || user.getSchool().startsWith("Chưa cập nhật")) && request.school() != null && !request.school().isBlank()) {
                user.setSchool(request.school());
            }
            if ((user.getFullName() == null || user.getFullName().isBlank()) && fullName != null && !fullName.isBlank()) {
                user.setFullName(fullName);
            }
            userRepository.save(user);
        } else {
            // Auto-create new account via Google Login
            user = new User(
                "gg-" + UUID.randomUUID().toString().substring(0, 8),
                email,
                "google_authenticated_oauth_secret",
                fullName != null ? fullName : "Người dùng Google",
                request.role() != null ? request.role() : "STUDENT",
                request.school() != null ? request.school() : "Chưa cập nhật trường học",
                "GOOGLE"
            );
            userRepository.save(user);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user, "Đăng nhập Google thành công!");
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
