package com.jvk.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateSubjectRequest {

    @NotBlank(message = "Subject name cannot be blank")
    @Size(min = 1, max = 150, message = "Subject name must be between 1 and 150 characters")
    private String name;

    @NotBlank(message = "classId is required")
    private String classId;

    public CreateSubjectRequest() {}

    public CreateSubjectRequest(String name, String classId) {
        this.name = name;
        this.classId = classId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }
}
