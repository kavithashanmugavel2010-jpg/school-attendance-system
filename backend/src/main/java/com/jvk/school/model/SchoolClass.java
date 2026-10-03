package com.jvk.school.model;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "school_classes", indexes = {
        @Index(name = "idx_school_classes_deleted", columnList = "deleted")
})
@SQLDelete(sql = "UPDATE school_classes SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class SchoolClass extends BaseAuditableEntity {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String section;

    @Column(nullable = false)
    private boolean deleted = false;

    public SchoolClass() {}

    public SchoolClass(String id, String name, String section) {
        this.id = id;
        this.name = name;
        this.section = section;
        this.deleted = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}
