package com.edulab.controller;

import com.edulab.model.StudentLabSnapshot;
import com.edulab.repository.StudentLabSnapshotRepository;
import com.edulab.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
@CrossOrigin(origins = "*")
public class StorageController {

    private final StudentLabSnapshotRepository snapshotRepository;
    private final CloudinaryService cloudinaryService;

    public StorageController(StudentLabSnapshotRepository snapshotRepository, CloudinaryService cloudinaryService) {
        this.snapshotRepository = snapshotRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public record SnapshotUploadRequest(
            String studentId,
            String labId,
            String labTitle,
            String imageBase64,
            String caption,
            String difficulty,
            Double score
    ) {}

    @PostMapping("/upload")
    public ResponseEntity<StudentLabSnapshot> uploadSnapshot(@RequestBody SnapshotUploadRequest request) {
        if (request.imageBase64() == null || request.imageBase64().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String studentId = request.studentId() != null ? request.studentId() : "u-student";
        String labTitle = request.labTitle() != null ? request.labTitle() : "Thí Nghiệm Mô Phỏng";
        String difficulty = request.difficulty() != null ? request.difficulty() : "MEDIUM";

        // Upload to Cloudinary via Spring Boot Proxy
        CloudinaryService.UploadResult uploadResult = cloudinaryService.uploadBase64Image(
                request.imageBase64(),
                "edulab_snapshots"
        );

        String id = "snap-" + UUID.randomUUID().toString().substring(0, 8);

        StudentLabSnapshot snapshot = new StudentLabSnapshot(
                id,
                studentId,
                request.labId(),
                labTitle,
                uploadResult.url(),
                uploadResult.publicId(),
                request.caption(),
                difficulty,
                request.score()
        );

        StudentLabSnapshot saved = snapshotRepository.save(snapshot);
        System.out.println("📸 Saved student lab snapshot to PostgreSQL: " + saved.getId() + " | Cloudinary URL: " + saved.getScreenshotUrl());

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my-snapshots")
    public List<StudentLabSnapshot> getMySnapshots(@RequestParam(defaultValue = "u-student") String studentId) {
        return snapshotRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    @DeleteMapping("/snapshots/{id}")
    public ResponseEntity<Void> deleteSnapshot(@PathVariable String id) {
        return snapshotRepository.findById(id).map(snapshot -> {
            if (snapshot.getCloudinaryPublicId() != null) {
                cloudinaryService.deleteImage(snapshot.getCloudinaryPublicId());
            }
            snapshotRepository.delete(snapshot);
            System.out.println("🗑️ Deleted snapshot record: " + id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
