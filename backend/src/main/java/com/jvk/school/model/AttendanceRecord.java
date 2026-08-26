package com.jvk.school.model;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance_records")
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_id", nullable = false)
    private String classId;

    @Column(name = "attendance_date", nullable = false)
    private String date;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(nullable = false)
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
