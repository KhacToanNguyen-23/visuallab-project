package com.edulab.controller;

import com.edulab.model.ClassEnrollment;
import com.edulab.model.Classroom;
import com.edulab.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<?> createClassroom(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String description = body.get("description");
        String teacherId = body.get("teacherId");
        String teacherName = body.get("teacherName");

        if (name == null || name.trim().isEmpty() || teacherId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên lớp và mã giáo viên không được để trống!"));
        }

        Classroom classroom = classroomService.createClassroom(name, description, teacherId, teacherName);
        return ResponseEntity.ok(classroom);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        String studentId = body.get("studentId");
        String studentName = body.get("studentName");
        String studentEmail = body.get("studentEmail");

        if (code == null || studentId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã lớp và mã học sinh không được để trống!"));
        }

        try {
            ClassEnrollment enrollment = classroomService.joinClassByCode(code, studentId, studentName, studentEmail);
            return ResponseEntity.ok(enrollment);
        } catch (IllegalArgumentException e) {
            if (e.getMessage() != null && e.getMessage().startsWith("ALREADY_JOINED:")) {
                String msg = e.getMessage().substring("ALREADY_JOINED:".length());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", msg, "code", "ALREADY_JOINED"));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Classroom>> getTeacherClasses(@PathVariable String teacherId) {
        return ResponseEntity.ok(classroomService.getClassroomsByTeacher(teacherId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ClassEnrollment>> getStudentEnrollments(@PathVariable String studentId) {
        return ResponseEntity.ok(classroomService.getStudentEnrollments(studentId));
    }

    @GetMapping("/{classId}")
    public ResponseEntity<?> getClassroomDetails(@PathVariable String classId) {
        return classroomService.getClassroomById(classId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{classId}/roster")
    public ResponseEntity<List<ClassEnrollment>> getClassRoster(@PathVariable String classId) {
        return ResponseEntity.ok(classroomService.getClassEnrollments(classId));
    }
}
