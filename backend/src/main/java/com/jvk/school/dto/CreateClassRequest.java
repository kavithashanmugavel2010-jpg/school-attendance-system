package com.jvk.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateClassRequest {

    @NotBlank(message = "Class name cannot be blank")
    @Size(min = 1, max = 100, message = "Class name must be between 1 and 100 characters")
    private String name;

    @NotBlank(message = "Section cannot be blank")
    @Size(min = 1, max = 100, message = "Section must be between 1 and 100 characters")
    private String section;

    public CreateClassRequest() {}

    public CreateClassRequest(String name, String section) {
        this.name = name;
        this.section = section;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }
}
