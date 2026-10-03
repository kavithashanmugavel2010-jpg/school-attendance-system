package com.jvk.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public class MarkSaveRequest {

    @NotBlank(message = "classId is required")
    private String classId;

    @NotBlank(message = "examType is required")
    private String examType;

    @NotBlank(message = "subjectId is required")
    private String subjectId;

    @NotEmpty(message = "records map cannot be empty")
    private Map<String, Double> records; // studentId -> score

    public MarkSaveRequest() {}

    public MarkSaveRequest(String classId, String examType, String subjectId, Map<String, Double> records) {
        this.classId = classId;
        this.examType = examType;
        this.subjectId = subjectId;
        this.records = records;
    }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public Map<String, Double> getRecords() { return records; }
    public void setRecords(Map<String, Double> records) { this.records = records; }
}
