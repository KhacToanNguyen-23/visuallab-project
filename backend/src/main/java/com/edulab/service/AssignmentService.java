package com.edulab.service;

import com.edulab.model.Assignment;
import com.edulab.model.StudentAssignmentInstance;

import java.util.List;
import java.util.Optional;

public interface AssignmentService {
    Assignment createAssignment(String classId, String title, String description, String labType, String paramBoundsJson, String targetFormula, double tolerancePercent, String teacherId);
    List<Assignment> getAssignmentsByClass(String classId);
    Optional<Assignment> getAssignmentById(String id);
    StudentAssignmentInstance getOrCreateStudentInstance(String assignmentId, String studentId);
}
