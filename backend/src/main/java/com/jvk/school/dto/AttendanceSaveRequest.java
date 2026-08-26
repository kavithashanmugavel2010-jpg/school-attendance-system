package com.jvk.school.dto;

import java.util.Map;

public class AttendanceSaveRequest {
    private String classId;
    private String date;
    private Map<String, String> records; // studentId -> 'present' | 'absent' | 'leave'

    public AttendanceSaveRequest() {}

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Map<String, String> getRecords() { return records; }
    public void setRecords(Map<String, String> records) { this.records = records; }
}
