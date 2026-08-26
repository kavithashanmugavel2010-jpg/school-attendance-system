package com.jvk.school.repository;

import com.jvk.school.model.MarkRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarkRecordRepository extends JpaRepository<MarkRecord, Long> {
    List<MarkRecord> findByClassIdAndExamTypeAndSubjectId(String classId, String examType, String subjectId);
    void deleteByClassIdAndExamTypeAndSubjectId(String classId, String examType, String subjectId);
    List<MarkRecord> findByClassId(String classId);
}
