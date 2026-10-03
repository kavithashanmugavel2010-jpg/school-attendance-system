package com.jvk.school.controller;

import com.jvk.school.dto.AttendanceSaveRequest;
import com.jvk.school.dto.PageResponse;
import com.jvk.school.model.AttendanceRecord;
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
@RequestMapping("/api/attendance")
@Tag(name = "Attendance", description = "Endpoints for managing student daily attendance")
public class AttendanceController {

    private final SchoolService schoolService;

    public AttendanceController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get attendance records by classId and date, or all records")
    public ResponseEntity<List<AttendanceRecord>> getAttendance(@RequestParam(required = false) String classId,
                                                                 @RequestParam(required = false) String date) {
        if (classId != null && date != null) {
            return ResponseEntity.ok(schoolService.getAttendance(classId, date));
        }
        return ResponseEntity.ok(schoolService.getAllAttendance());
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Operation(summary = "Get paginated attendance records")
    public ResponseEntity<PageResponse<AttendanceRecord>> getAttendancePaged(
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String date,
            @PageableDefault(size = 50) Pageable pageable) {
        if (classId != null && date != null) {
            return ResponseEntity.ok(new PageResponse<>(schoolService.getAttendance(classId, date, pageable)));
        }
        return ResponseEntity.ok(new PageResponse<>(schoolService.getAllAttendance(pageable)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @RateLimiter(name = "mutationLimiter")
    @Operation(summary = "Save batch daily attendance records for a class")
    public ResponseEntity<Void> saveAttendance(@Valid @RequestBody AttendanceSaveRequest request) {
        schoolService.saveAttendance(request);
        return ResponseEntity.ok().build();
    }
}
