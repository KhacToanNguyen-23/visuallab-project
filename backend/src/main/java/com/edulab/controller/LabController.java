package com.edulab.controller;

import com.edulab.model.Lab;
import com.edulab.repository.LabRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
@CrossOrigin(origins = "*")
public class LabController {

    private final LabRepository labRepository;

    public LabController(LabRepository labRepository) {
        this.labRepository = labRepository;
    }

    @GetMapping
    public List<Lab> getAllLabs(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String difficulty) {
        
        if (domain != null && !domain.isBlank()) {
            return labRepository.findByDomain(domain);
        }
        if (grade != null && !grade.isBlank()) {
            return labRepository.findByGrade(grade);
        }
        if (difficulty != null && !difficulty.isBlank()) {
            return labRepository.findByDifficulty(difficulty);
        }
        return labRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lab> getLabById(@PathVariable String id) {
        return labRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lab> saveLab(@RequestBody Lab lab) {
        if (lab.getId() == null || lab.getId().isBlank()) {
            lab.setId("sim-" + System.currentTimeMillis());
        }
        Lab saved = labRepository.save(lab);
        return ResponseEntity.ok(saved);
    }
}
