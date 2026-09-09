package com.edulab.repository;

import com.edulab.model.ExperimentTopic;
import java.util.List;
import java.util.Optional;

public interface CurriculumRepository {
    List<ExperimentTopic> findAllTopics();
    Optional<ExperimentTopic> findTopicById(String id);
}
