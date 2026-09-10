package com.edulab.controller;

import com.edulab.model.ExperimentTopic;
import com.edulab.service.CurriculumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/curriculum")
@CrossOrigin(origins = "*")
public class CurriculumController {

    private final CurriculumService curriculumService;

    public CurriculumController(CurriculumService curriculumService) {
        this.curriculumService = curriculumService;
    }

    @GetMapping("/topics")
    public List<ExperimentTopic> getAllTopics() {
        return curriculumService.getAllTopics();
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<ExperimentTopic> getTopicById(@PathVariable String id) {
        return curriculumService.getTopicById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tree")
    public List<ExperimentTopic> getCurriculumTree() {
        return curriculumService.getAllTopics();
    }
}
