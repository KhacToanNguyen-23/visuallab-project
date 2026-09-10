package com.edulab.repository;

import com.edulab.model.StudentAssignmentInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAssignmentInstanceRepository extends JpaRepository<StudentAssignmentInstance, String> {
    Optional<StudentAssignmentInstance> findByAssignmentIdAndStudentId(String assignmentId, String studentId);
    List<StudentAssignmentInstance> findByAssignmentId(String assignmentId);
}
