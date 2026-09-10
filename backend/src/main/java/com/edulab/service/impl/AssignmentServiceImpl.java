package com.edulab.service.impl;

import com.edulab.model.Assignment;
import com.edulab.model.StudentAssignmentInstance;
import com.edulab.repository.AssignmentRepository;
import com.edulab.repository.StudentAssignmentInstanceRepository;
import com.edulab.service.AssignmentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private StudentAssignmentInstanceRepository instanceRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Assignment createAssignment(String classId, String title, String description, String labType, String paramBoundsJson, String targetFormula, double tolerancePercent, String teacherId) {
        String id = "asg_" + UUID.randomUUID().toString().substring(0, 8);
        Assignment assignment = new Assignment(id, classId, title, description, labType, paramBoundsJson, targetFormula, tolerancePercent, teacherId);
        return assignmentRepository.save(assignment);
    }

    @Override
    public List<Assignment> getAssignmentsByClass(String classId) {
        return assignmentRepository.findByClassId(classId);
    }

    @Override
    public Optional<Assignment> getAssignmentById(String id) {
        return assignmentRepository.findById(id);
    }

    @Override
    public StudentAssignmentInstance getOrCreateStudentInstance(String assignmentId, String studentId) {
        Optional<StudentAssignmentInstance> existingOpt = instanceRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
        if (existingOpt.isPresent()) {
            return existingOpt.get();
        }

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with id: " + assignmentId));

        String generatedParamsJson = generateParamValuesForStudent(assignment.getParamBoundsJson(), studentId);
        String id = "inst_" + UUID.randomUUID().toString().substring(0, 8);

        StudentAssignmentInstance instance = new StudentAssignmentInstance(id, assignmentId, studentId, generatedParamsJson);
        return instanceRepository.save(instance);
    }

    private String generateParamValuesForStudent(String paramBoundsJson, String studentId) {
        try {
            long seed = studentId != null ? (long) studentId.hashCode() : System.currentTimeMillis();
            Random random = new Random(seed);

            double lengthMin = 0.5, lengthMax = 2.0;
            double angleMin = 5.0, angleMax = 30.0;
            double massMin = 0.5, massMax = 2.0;

            if (paramBoundsJson != null && !paramBoundsJson.trim().isEmpty()) {
                JsonNode boundsNode = objectMapper.readTree(paramBoundsJson);
                if (boundsNode.has("lengthMin")) lengthMin = boundsNode.get("lengthMin").asDouble();
                if (boundsNode.has("lengthMax")) lengthMax = boundsNode.get("lengthMax").asDouble();
                if (boundsNode.has("angleMin")) angleMin = boundsNode.get("angleMin").asDouble();
                if (boundsNode.has("angleMax")) angleMax = boundsNode.get("angleMax").asDouble();
                if (boundsNode.has("massMin")) massMin = boundsNode.get("massMin").asDouble();
                if (boundsNode.has("massMax")) massMax = boundsNode.get("massMax").asDouble();
            }

            double length = round(lengthMin + (lengthMax - lengthMin) * random.nextDouble());
            double angle = Math.round(angleMin + (angleMax - angleMin) * random.nextDouble());
            double mass = round(massMin + (massMax - massMin) * random.nextDouble());

            Map<String, Object> paramsMap = new HashMap<>();
            paramsMap.put("length", length);
            paramsMap.put("angle", angle);
            paramsMap.put("mass", mass);

            return objectMapper.writeValueAsString(paramsMap);
        } catch (Exception e) {
            return "{\"length\": 1.0, \"angle\": 15.0, \"mass\": 1.0}";
        }
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
