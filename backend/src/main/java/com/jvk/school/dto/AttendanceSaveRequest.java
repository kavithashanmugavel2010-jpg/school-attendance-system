package com.jvk.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public class AttendanceSaveRequest {

    @NotBlank(message = "classId is required")
    private String classId;

    @NotBlank(message = "date is required")
    private String date;

    @NotEmpty(message = "records map cannot be empty")
    private Map<String, String> records; // studentId -> 'present' | 'absent' | 'leave'

    public AttendanceSaveRequest() {}

    public AttendanceSaveRequest(String classId, String date, Map<String, String> records) {
        this.classId = classId;
        this.date = date;
        this.records = records;
    }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Map<String, String> getRecords() { return records; }
    public void setRecords(Map<String, String> records) { this.records = records; }
}
