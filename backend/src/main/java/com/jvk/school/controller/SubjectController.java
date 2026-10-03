package com.jvk.school.controller;

import com.jvk.school.dto.CreateSubjectRequest;
import com.jvk.school.dto.PageResponse;
import com.jvk.school.model.Subject;
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
@RequestMapping("/api/subjects")
@Tag(name = "Subjects", description = "Endpoints for managing subjects and curriculum")
public class SubjectController {

    private final SchoolService schoolService;

    public SubjectController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get subjects list by classId or all subjects")
    public ResponseEntity<List<Subject>> getSubjects(@RequestParam(required = false) String classId) {
        if (classId != null && !classId.isEmpty()) {
            return ResponseEntity.ok(schoolService.getSubjectsByClass(classId));
        }
        return ResponseEntity.ok(schoolService.getAllSubjects());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get paginated subjects list")
    public ResponseEntity<PageResponse<Subject>> getSubjectsPaged(
            @RequestParam(required = false) String classId,
            @PageableDefault(size = 20) Pageable pageable) {
        if (classId != null && !classId.isEmpty()) {
            return ResponseEntity.ok(new PageResponse<>(schoolService.getSubjectsByClass(classId, pageable)));
        }
        return ResponseEntity.ok(new PageResponse<>(schoolService.getAllSubjects(pageable)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Create a new subject for a class")
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        Subject subject = schoolService.createSubject(request);
        return ResponseEntity.ok(subject);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Soft-delete a subject by id")
    public ResponseEntity<Void> deleteSubject(@PathVariable String id) {
        schoolService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
