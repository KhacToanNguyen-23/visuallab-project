package com.edulab.service.impl;

import com.edulab.model.ExperimentTopic;
import com.edulab.repository.CurriculumRepository;
import com.edulab.service.CurriculumService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CurriculumServiceImpl implements CurriculumService {

    private final CurriculumRepository curriculumRepository;

    public CurriculumServiceImpl(CurriculumRepository curriculumRepository) {
        this.curriculumRepository = curriculumRepository;
    }

    @Override
    public List<ExperimentTopic> getAllTopics() {
        return curriculumRepository.findAllTopics();
    }

    @Override
    public Optional<ExperimentTopic> getTopicById(String id) {
        return curriculumRepository.findTopicById(id);
    }
}
