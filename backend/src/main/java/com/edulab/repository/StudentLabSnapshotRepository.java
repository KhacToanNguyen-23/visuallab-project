package com.edulab.repository;

import com.edulab.model.StudentLabSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentLabSnapshotRepository extends JpaRepository<StudentLabSnapshot, String> {
    List<StudentLabSnapshot> findByStudentIdOrderByCreatedAtDesc(String studentId);
}
