package com.jvk.school.controller;

import com.jvk.school.dto.AttendanceSaveRequest;
import com.jvk.school.model.AttendanceRecord;
import com.jvk.school.service.SchoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final SchoolService schoolService;

    public AttendanceController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public ResponseEntity<List<AttendanceRecord>> getAttendance(@RequestParam(required = false) String classId,
                                                                 @RequestParam(required = false) String date) {
        if (classId != null && date != null) {
            return ResponseEntity.ok(schoolService.getAttendance(classId, date));
        }
        return ResponseEntity.ok(schoolService.getAllAttendance());
    }

    @PostMapping
    public ResponseEntity<Void> saveAttendance(@RequestBody AttendanceSaveRequest request) {
        schoolService.saveAttendance(request);
        return ResponseEntity.ok().build();
    }
}
