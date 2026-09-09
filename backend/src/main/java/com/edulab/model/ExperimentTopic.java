package com.edulab.model;

import java.util.List;

public record ExperimentTopic(
    String id,
    String title,
    String gradeLevel, // e.g. "THCS (Lớp 6-9)", "THPT (Lớp 10-12)"
    String subjectArea, // e.g. "Điện học", "Cơ học", "Quang học"
    String description,
    List<SimulationPreset> presets
) {}
