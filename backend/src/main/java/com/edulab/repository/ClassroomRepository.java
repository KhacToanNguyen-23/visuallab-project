package com.edulab.repository;

import com.edulab.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, String> {
    Optional<Classroom> findByCode(String code);
    List<Classroom> findByTeacherId(String teacherId);
    boolean existsByCode(String code);
}
