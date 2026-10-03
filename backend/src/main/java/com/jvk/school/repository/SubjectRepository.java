package com.jvk.school.repository;

import com.jvk.school.model.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {
    List<Subject> findByClassId(String classId);
    Page<Subject> findByClassId(String classId, Pageable pageable);
    void deleteByClassId(String classId);
}
