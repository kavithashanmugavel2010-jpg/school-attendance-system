package com.jvk.school.model;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "subjects", indexes = {
        @Index(name = "idx_subjects_class_id", columnList = "class_id"),
        @Index(name = "idx_subjects_deleted", columnList = "deleted")
})
@SQLDelete(sql = "UPDATE subjects SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Subject extends BaseAuditableEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "class_id", nullable = false, length = 100)
    private String classId;

    @Column(nullable = false)
    private boolean deleted = false;

    public Subject() {}

    public Subject(String id, String name, String classId) {
        this.id = id;
        this.name = name;
        this.classId = classId;
        this.deleted = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}
