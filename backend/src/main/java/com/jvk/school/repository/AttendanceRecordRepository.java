package com.jvk.school.repository;

import com.jvk.school.model.AttendanceRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByClassIdAndDate(String classId, String date);
    Page<AttendanceRecord> findByClassIdAndDate(String classId, String date, Pageable pageable);
    Page<AttendanceRecord> findByClassId(String classId, Pageable pageable);
    void deleteByClassIdAndDate(String classId, String date);
}
