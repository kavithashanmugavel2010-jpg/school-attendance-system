package com.jvk.school.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mark_records",
       uniqueConstraints = @UniqueConstraint(name = "unique_mark_per_student", columnNames = {"class_id", "exam_type", "subject_id", "student_id"}),
       indexes = {
               @Index(name = "idx_marks_lookup", columnList = "class_id, exam_type, subject_id"),
               @Index(name = "idx_marks_student", columnList = "student_id")
       })
public class MarkRecord extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id", nullable = false, length = 100)
    private String classId;

    @Column(name = "exam_type", nullable = false, length = 100)
    private String examType;

    @Column(name = "subject_id", nullable = false, length = 100)
    private String subjectId;

    @Column(name = "student_id", nullable = false, length = 100)
    private String studentId;

    @Column(precision = 5, scale = 2)
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
