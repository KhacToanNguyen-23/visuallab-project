package com.edulab.repository;

import com.edulab.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, String> {
    Optional<AssignmentSubmission> findByInstanceId(String instanceId);
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(String assignmentId, String studentId);
    List<AssignmentSubmission> findByAssignmentId(String assignmentId);
}
