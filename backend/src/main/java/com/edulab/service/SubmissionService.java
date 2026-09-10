package com.edulab.service;

import com.edulab.model.AssignmentSubmission;

import java.util.List;
import java.util.Optional;

public interface SubmissionService {
    AssignmentSubmission submitAssignment(String instanceId, String studentId, String studentName, String submittedAnswersJson, String explanation);
    Optional<AssignmentSubmission> getSubmissionByInstance(String instanceId);
    List<AssignmentSubmission> getSubmissionsByAssignment(String assignmentId);
    Optional<AssignmentSubmission> getStudentSubmissionForAssignment(String assignmentId, String studentId);
}
