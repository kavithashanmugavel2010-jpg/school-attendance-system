package com.jvk.school.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "class_id", nullable = false)
    private String classId;

    public Student() {}

    public Student(String id, String name, String classId) {
        this.id = id;
        this.name = name;
        this.classId = classId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }
}
