package com.jvk.school.model;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance_records",
       uniqueConstraints = @UniqueConstraint(name = "unique_attendance_per_student", columnNames = {"class_id", "attendance_date", "student_id"}),
       indexes = {
               @Index(name = "idx_attendance_lookup", columnList = "class_id, attendance_date"),
               @Index(name = "idx_attendance_student", columnList = "student_id")
       })
public class AttendanceRecord extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id", nullable = false, length = 100)
    private String classId;

    @Column(name = "attendance_date", nullable = false, length = 20)
    private String date;

    @Column(name = "student_id", nullable = false, length = 100)
    private String studentId;

    @Column(nullable = false, length = 20)
    private String status;

    public AttendanceRecord() {}

    public AttendanceRecord(String classId, String date, String studentId, String status) {
        this.classId = classId;
        this.date = date;
        this.studentId = studentId;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
