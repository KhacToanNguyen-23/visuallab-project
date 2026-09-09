package com.edulab.model;

public record SimulationPreset(
    String id,
    String name,
    String description,
    String defaultConfigJson
) {}
