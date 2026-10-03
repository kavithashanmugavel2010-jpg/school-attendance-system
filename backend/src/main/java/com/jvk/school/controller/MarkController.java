package com.jvk.school.controller;

import com.jvk.school.dto.MarkSaveRequest;
import com.jvk.school.dto.PageResponse;
import com.jvk.school.model.MarkRecord;
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
@RequestMapping("/api/marks")
@Tag(name = "Marks & Grades", description = "Endpoints for recording and querying student examination marks")
public class MarkController {

    private final SchoolService schoolService;

    public MarkController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get mark records by class, exam type, and subject, or all records")
    public ResponseEntity<List<MarkRecord>> getMarks(@RequestParam(required = false) String classId,
                                                     @RequestParam(required = false) String examType,
                                                     @RequestParam(required = false) String subjectId) {
        if (classId != null && examType != null && subjectId != null) {
            return ResponseEntity.ok(schoolService.getMarks(classId, examType, subjectId));
        }
        return ResponseEntity.ok(schoolService.getAllMarks());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get paginated mark records")
    public ResponseEntity<PageResponse<MarkRecord>> getMarksPaged(
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String examType,
            @RequestParam(required = false) String subjectId,
            @PageableDefault(size = 50) Pageable pageable) {
        if (classId != null && examType != null && subjectId != null) {
            return ResponseEntity.ok(new PageResponse<>(schoolService.getMarks(classId, examType, subjectId, pageable)));
        }
        return ResponseEntity.ok(new PageResponse<>(schoolService.getAllMarks(pageable)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Save batch exam mark records for a class and subject")
    public ResponseEntity<Void> saveMarks(@Valid @RequestBody MarkSaveRequest request) {
        schoolService.saveMarks(request);
        return ResponseEntity.ok().build();
    }
}
