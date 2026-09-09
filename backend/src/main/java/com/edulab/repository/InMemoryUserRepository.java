package com.edulab.repository;

import com.edulab.model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

// Secondary fallback repository when PostgreSQL is not connected
public class InMemoryUserRepository {

    private final Map<String, User> userMap = new ConcurrentHashMap<>();

    public InMemoryUserRepository() {
        User demoTeacher = new User("u-1", "teacher@edulab.vn", "123456", "Thầy Nguyễn Văn A", "TEACHER", "THPT Chuyên Hà Nội - Amsterdam", "LOCAL");
        User demoStudent = new User("u-2", "student@edulab.vn", "123456", "Học sinh Trần Văn B", "STUDENT", "THCS Lê Quý Đôn", "LOCAL");
        userMap.put(demoTeacher.getEmail().toLowerCase(), demoTeacher);
        userMap.put(demoStudent.getEmail().toLowerCase(), demoStudent);
    }

    public User save(User user) {
        userMap.put(user.getEmail().toLowerCase(), user);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return Optional.ofNullable(userMap.get(email.toLowerCase()));
    }

    public Optional<User> findById(String id) {
        return userMap.values().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }
}
