package com.jvk.school.repository;

import com.jvk.school.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByClassIdAndDate(String classId, String date);
    void deleteByClassIdAndDate(String classId, String date);
}
