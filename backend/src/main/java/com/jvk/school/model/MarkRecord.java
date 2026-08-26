package com.jvk.school.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mark_records")
public class MarkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id", nullable = false)
    private String classId;

    @Column(name = "exam_type", nullable = false)
    private String examType;

    @Column(name = "subject_id", nullable = false)
    private String subjectId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column
    private Double score;

    public MarkRecord() {}

    public MarkRecord(String classId, String examType, String subjectId, String studentId, Double score) {
        this.classId = classId;
        this.examType = examType;
        this.subjectId = subjectId;
        this.studentId = studentId;
        this.score = score;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
}
