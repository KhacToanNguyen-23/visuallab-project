package com.edulab.service;

import com.edulab.model.ExperimentTopic;
import java.util.List;
import java.util.Optional;

public interface CurriculumService {
    List<ExperimentTopic> getAllTopics();
    Optional<ExperimentTopic> getTopicById(String id);
}
