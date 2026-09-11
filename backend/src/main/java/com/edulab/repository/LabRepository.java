package com.edulab.repository;

import com.edulab.model.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRepository extends JpaRepository<Lab, String> {
    List<Lab> findByStatus(String status);
    List<Lab> findByDomain(String domain);
    List<Lab> findByGrade(String grade);
    List<Lab> findByDifficulty(String difficulty);
}
