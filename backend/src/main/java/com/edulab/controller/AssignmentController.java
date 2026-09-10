package com.edulab.controller;

import com.edulab.model.Assignment;
import com.edulab.model.StudentAssignmentInstance;
import com.edulab.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody Map<String, Object> body) {
        String classId = (String) body.get("classId");
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String labType = (String) body.get("labType");
        String paramBoundsJson = (String) body.get("paramBoundsJson");
        String targetFormula = (String) body.get("targetFormula");
        String teacherId = (String) body.get("teacherId");
        
        double tolerancePercent = 3.0;
        if (body.containsKey("tolerancePercent")) {
            tolerancePercent = Double.parseDouble(body.get("tolerancePercent").toString());
        }

        if (classId == null || title == null || teacherId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã lớp, tiêu đề và mã giáo viên không được để trống!"));
        }

        Assignment assignment = assignmentService.createAssignment(
                classId, title, description, labType != null ? labType : "PENDULUM",
                paramBoundsJson, targetFormula, tolerancePercent, teacherId
        );

        return ResponseEntity.ok(assignment);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByClass(@PathVariable String classId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByClass(classId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable String id) {
        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/student-instance")
    public ResponseEntity<?> getStudentInstance(
            @PathVariable String id,
            @RequestParam String studentId) {
        try {
            StudentAssignmentInstance instance = assignmentService.getOrCreateStudentInstance(id, studentId);
            return ResponseEntity.ok(instance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
