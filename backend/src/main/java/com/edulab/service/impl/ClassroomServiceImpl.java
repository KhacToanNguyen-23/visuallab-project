package com.edulab.service.impl;

import com.edulab.model.ClassEnrollment;
import com.edulab.model.Classroom;
import com.edulab.repository.ClassEnrollmentRepository;
import com.edulab.repository.ClassroomRepository;
import com.edulab.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClassroomServiceImpl implements ClassroomService {

    private static final String CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ClassEnrollmentRepository enrollmentRepository;

    @Override
    public Classroom createClassroom(String name, String description, String teacherId, String teacherName) {
        String code = generateUniqueClassCode();
        String id = "cls_" + UUID.randomUUID().toString().substring(0, 8);
        Classroom classroom = new Classroom(id, name, description, code, teacherId, teacherName);
        return classroomRepository.save(classroom);
    }

    @Override
    public String generateUniqueClassCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
            }
            code = sb.toString();
        } while (classroomRepository.existsByCode(code));
        return code;
    }

    @Override
    public ClassEnrollment joinClassByCode(String code, String studentId, String studentName, String studentEmail) {
        Optional<Classroom> classroomOpt = classroomRepository.findByCode(code.trim().toUpperCase());
        if (classroomOpt.isEmpty()) {
            throw new IllegalArgumentException("Mã lớp học '" + code + "' không tồn tại!");
        }

        Classroom classroom = classroomOpt.get();
        if (enrollmentRepository.existsByClassIdAndStudentId(classroom.getId(), studentId)) {
            throw new IllegalArgumentException("ALREADY_JOINED:Bạn đã tham gia lớp học này từ trước!");
        }

        String id = "enr_" + UUID.randomUUID().toString().substring(0, 8);
        ClassEnrollment enrollment = new ClassEnrollment(
                id, classroom.getId(), classroom.getName(), classroom.getCode(), classroom.getTeacherName(),
                studentId, studentName, studentEmail
        );
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public List<Classroom> getClassroomsByTeacher(String teacherId) {
        return classroomRepository.findByTeacherId(teacherId);
    }

    @Override
    public List<ClassEnrollment> getClassEnrollments(String classId) {
        return enrollmentRepository.findByClassId(classId);
    }

    @Override
    public List<ClassEnrollment> getStudentEnrollments(String studentId) {
        List<ClassEnrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        Map<String, ClassEnrollment> uniqueMap = new LinkedHashMap<>();

        for (ClassEnrollment enr : enrollments) {
            if (!uniqueMap.containsKey(enr.getClassId())) {
                classroomRepository.findById(enr.getClassId()).ifPresent(cls -> {
                    enr.setClassName(cls.getName());
                    enr.setClassCode(cls.getCode());
                    enr.setTeacherName(cls.getTeacherName());
                });
                uniqueMap.put(enr.getClassId(), enr);
            } else {
                try {
                    enrollmentRepository.delete(enr);
                } catch (Exception ignored) {}
            }
        }
        return new ArrayList<>(uniqueMap.values());
    }

    @Override
    public Optional<Classroom> getClassroomById(String id) {
        return classroomRepository.findById(id);
    }
}
