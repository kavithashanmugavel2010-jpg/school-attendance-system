package com.jvk.school.controller;

import com.jvk.school.dto.CreateStudentRequest;
import com.jvk.school.dto.PageResponse;
import com.jvk.school.model.Student;
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
@RequestMapping("/api/students")
@Tag(name = "Students", description = "Endpoints for managing student directory")
public class StudentController {

    private final SchoolService schoolService;

    public StudentController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get students list by classId or all students")
    public ResponseEntity<List<Student>> getStudents(@RequestParam(required = false) String classId) {
        if (classId != null && !classId.isEmpty()) {
            return ResponseEntity.ok(schoolService.getStudentsByClass(classId));
        }
        return ResponseEntity.ok(schoolService.getAllStudents());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get paginated students list")
    public ResponseEntity<PageResponse<Student>> getStudentsPaged(
            @RequestParam(required = false) String classId,
            @PageableDefault(size = 20) Pageable pageable) {
        if (classId != null && !classId.isEmpty()) {
            return ResponseEntity.ok(new PageResponse<>(schoolService.getStudentsByClass(classId, pageable)));
        }
        return ResponseEntity.ok(new PageResponse<>(schoolService.getAllStudents(pageable)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Create a new student record")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        Student student = schoolService.createStudent(request);
        return ResponseEntity.ok(student);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Soft-delete a student by id")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        schoolService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
