package com.edulab.repository;

import com.edulab.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    List<Assignment> findByClassId(String classId);
    List<Assignment> findByTeacherId(String teacherId);
}
