package com.jvk.school.controller;

import com.jvk.school.dto.CreateClassRequest;
import com.jvk.school.dto.PageResponse;
import com.jvk.school.model.SchoolClass;
import com.jvk.school.service.SchoolService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@Tag(name = "School Classes", description = "Endpoints for managing classes and grades")
public class SchoolClassController {

    private final SchoolService schoolService;

    public SchoolClassController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get all classes (list)")
    public ResponseEntity<List<SchoolClass>> getAllClasses() {
        return ResponseEntity.ok(schoolService.getAllClasses());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get paginated classes")
    public ResponseEntity<PageResponse<SchoolClass>> getAllClassesPaged(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(schoolService.getAllClasses(pageable)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Create a new school class with default subjects")
    public ResponseEntity<SchoolClass> createClass(@Valid @RequestBody CreateClassRequest request) {
        SchoolClass schoolClass = schoolService.createClass(request);
        return ResponseEntity.ok(schoolClass);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Soft-delete a class and its associated entities")
    public ResponseEntity<Void> deleteClass(@PathVariable String id) {
        schoolService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
