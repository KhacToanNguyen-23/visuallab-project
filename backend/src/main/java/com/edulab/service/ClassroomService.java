package com.edulab.service;

import com.edulab.model.ClassEnrollment;
import com.edulab.model.Classroom;

import java.util.List;
import java.util.Optional;

public interface ClassroomService {
    Classroom createClassroom(String name, String description, String teacherId, String teacherName);
    String generateUniqueClassCode();
    ClassEnrollment joinClassByCode(String code, String studentId, String studentName, String studentEmail);
    List<Classroom> getClassroomsByTeacher(String teacherId);
    List<ClassEnrollment> getClassEnrollments(String classId);
    List<ClassEnrollment> getStudentEnrollments(String studentId);
    Optional<Classroom> getClassroomById(String id);
}
