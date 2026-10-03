package com.jvk.school.repository;

import com.jvk.school.model.MarkRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkRecordRepository extends JpaRepository<MarkRecord, Long> {
    List<MarkRecord> findByClassIdAndExamTypeAndSubjectId(String classId, String examType, String subjectId);
    Page<MarkRecord> findByClassIdAndExamTypeAndSubjectId(String classId, String examType, String subjectId, Pageable pageable);
    List<MarkRecord> findByClassId(String classId);
    Page<MarkRecord> findByClassId(String classId, Pageable pageable);
    void deleteByClassIdAndExamTypeAndSubjectId(String classId, String examType, String subjectId);
}
