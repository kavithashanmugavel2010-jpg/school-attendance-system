package com.jvk.school.repository;

import com.jvk.school.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByClassId(String classId);
    void deleteByClassId(String classId);
}
