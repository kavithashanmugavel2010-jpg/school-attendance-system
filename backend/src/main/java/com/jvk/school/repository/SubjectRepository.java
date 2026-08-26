package com.jvk.school.repository;

import com.jvk.school.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, String> {
    List<Subject> findByClassId(String classId);
    void deleteByClassId(String classId);
}
