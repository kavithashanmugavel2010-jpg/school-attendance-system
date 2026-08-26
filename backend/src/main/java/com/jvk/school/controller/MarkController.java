package com.jvk.school.controller;

import com.jvk.school.dto.MarkSaveRequest;
import com.jvk.school.model.MarkRecord;
import com.jvk.school.service.SchoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    private final SchoolService schoolService;

    public MarkController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public ResponseEntity<List<MarkRecord>> getMarks(@RequestParam(required = false) String classId,
                                                     @RequestParam(required = false) String examType,
                                                     @RequestParam(required = false) String subjectId) {
        if (classId != null && examType != null && subjectId != null) {
            return ResponseEntity.ok(schoolService.getMarks(classId, examType, subjectId));
        }
        return ResponseEntity.ok(schoolService.getAllMarks());
    }

    @PostMapping
    public ResponseEntity<Void> saveMarks(@RequestBody MarkSaveRequest request) {
        schoolService.saveMarks(request);
        return ResponseEntity.ok().build();
    }
}
