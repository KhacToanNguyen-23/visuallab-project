package com.edulab.controller;

import com.edulab.model.AssignmentSubmission;
import com.edulab.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<?> submitAssignment(@RequestBody Map<String, String> body) {
        String instanceId = body.get("instanceId");
        String studentId = body.get("studentId");
        String studentName = body.get("studentName");
        String submittedAnswersJson = body.get("submittedAnswersJson");
        String explanation = body.get("explanation");

        if (instanceId == null || studentId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Instance ID và mã học sinh không được để trống!"));
        }

        try {
            AssignmentSubmission submission = submissionService.submitAssignment(
                    instanceId, studentId, studentName, submittedAnswersJson, explanation
            );
            return ResponseEntity.ok(submission);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<AssignmentSubmission>> getSubmissionsByAssignment(@PathVariable String assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/assignment/{assignmentId}/student/{studentId}")
    public ResponseEntity<?> getStudentSubmissionForAssignment(
            @PathVariable String assignmentId,
            @PathVariable String studentId) {
        return submissionService.getStudentSubmissionForAssignment(assignmentId, studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
