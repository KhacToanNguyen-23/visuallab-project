package com.edulab.repository;

import com.edulab.model.ClassEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassEnrollmentRepository extends JpaRepository<ClassEnrollment, String> {
    List<ClassEnrollment> findByClassId(String classId);
    List<ClassEnrollment> findByStudentId(String studentId);
    Optional<ClassEnrollment> findByClassIdAndStudentId(String classId, String studentId);
    boolean existsByClassIdAndStudentId(String classId, String studentId);
}
