package com.jvk.school.dto;

import java.util.Map;

public class MarkSaveRequest {
    private String classId;
    private String examType;
    private String subjectId;
    private Map<String, Double> records; // studentId -> score

    public MarkSaveRequest() {}

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public Map<String, Double> getRecords() { return records; }
    public void setRecords(Map<String, Double> records) { this.records = records; }
}
