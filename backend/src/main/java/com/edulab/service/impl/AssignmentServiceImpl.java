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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
        return createAssignment(classId, title, description, labType, paramBoundsJson, targetFormula, tolerancePercent, teacherId, null);
    }

    @Override
    public Assignment createAssignment(String classId, String title, String description, String labType, String paramBoundsJson, String targetFormula, double tolerancePercent, String teacherId, java.time.LocalDateTime dueDate) {
        if (assignmentRepository.existsByClassIdAndLabType(classId, labType) ||
            assignmentRepository.existsByClassIdAndTitle(classId, title)) {
            throw new IllegalArgumentException("DUPLICATE_ASSIGNMENT:Bài thực hành này đã được giao cho lớp học rồi! Không được giao trùng bài.");
        }
        String id = "asg_" + UUID.randomUUID().toString().substring(0, 8);
        Assignment assignment = new Assignment(id, classId, title, description, labType, paramBoundsJson, targetFormula, tolerancePercent, teacherId, dueDate);
        return assignmentRepository.save(assignment);
    }

    @Override
    public List<Assignment> getAssignmentsByClass(String classId) {
        List<Assignment> list = assignmentRepository.findByClassId(classId);
        Map<String, Assignment> dedupMap = new LinkedHashMap<>();
        for (Assignment a : list) {
            String key = (a.getLabType() != null && !a.getLabType().isBlank()) ? a.getLabType() : a.getTitle();
            if (!dedupMap.containsKey(key)) {
                dedupMap.put(key, a);
            }
        }
        return new ArrayList<>(dedupMap.values());
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

            Map<String, Object> paramsMap = new LinkedHashMap<>();

            if (paramBoundsJson != null && !paramBoundsJson.trim().isEmpty()) {
                JsonNode boundsNode = objectMapper.readTree(paramBoundsJson);

                // Collect pairs of (keyMin, keyMax) or (key_min, key_max) or direct objects
                java.util.Iterator<String> fieldNames = boundsNode.fieldNames();
                java.util.Set<String> processedKeys = new java.util.HashSet<>();

                while (fieldNames.hasNext()) {
                    String field = fieldNames.next();
                    String baseKey = null;
                    if (field.endsWith("Min")) {
                        baseKey = field.substring(0, field.length() - 3);
                    } else if (field.endsWith("Max")) {
                        baseKey = field.substring(0, field.length() - 3);
                    } else if (boundsNode.get(field).isObject() && boundsNode.get(field).has("min") && boundsNode.get(field).has("max")) {
                        double min = boundsNode.get(field).get("min").asDouble();
                        double max = boundsNode.get(field).get("max").asDouble();
                        paramsMap.put(field, round(min + (max - min) * random.nextDouble()));
                        continue;
                    }

                    if (baseKey != null && !processedKeys.contains(baseKey)) {
                        processedKeys.add(baseKey);
                        double min = boundsNode.has(baseKey + "Min") ? boundsNode.get(baseKey + "Min").asDouble() : 1.0;
                        double max = boundsNode.has(baseKey + "Max") ? boundsNode.get(baseKey + "Max").asDouble() : (min + 1.0);
                        if (max < min) { double tmp = min; min = max; max = tmp; }
                        paramsMap.put(baseKey, round(min + (max - min) * random.nextDouble()));
                    }
                }
            }

            // Fallback if no specific bounds parsed
            if (paramsMap.isEmpty()) {
                paramsMap.put("distance", round(0.3 + (0.8 - 0.3) * random.nextDouble()));
                paramsMap.put("angle", Math.round(10.0 + (25.0 - 10.0) * random.nextDouble()));
            }

            return objectMapper.writeValueAsString(paramsMap);
        } catch (Exception e) {
            return "{\"distance\": 0.5, \"angle\": 15.0}";
        }
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    @Override
    public void deleteAssignment(String id) {
        Optional<Assignment> opt = assignmentRepository.findById(id);
        if (opt.isPresent()) {
            Assignment target = opt.get();
            List<Assignment> classAsgs = assignmentRepository.findByClassId(target.getClassId());
            for (Assignment a : classAsgs) {
                if (a.getId().equals(id) ||
                    (target.getLabType() != null && !target.getLabType().isBlank() && target.getLabType().equals(a.getLabType())) ||
                    (target.getTitle() != null && !target.getTitle().isBlank() && target.getTitle().equals(a.getTitle()))) {
                    assignmentRepository.deleteById(a.getId());
                }
            }
        } else {
            assignmentRepository.deleteById(id);
        }
    }
}
