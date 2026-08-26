package com.jvk.school.controller;

import com.jvk.school.model.Subject;
import com.jvk.school.service.SchoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SchoolService schoolService;

    public SubjectController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getSubjects(@RequestParam(required = false) String classId) {
        if (classId != null && !classId.isEmpty()) {
            return ResponseEntity.ok(schoolService.getSubjectsByClass(classId));
        }
        return ResponseEntity.ok(schoolService.getAllSubjects());
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String classId = payload.get("classId");
        Subject subject = schoolService.createSubject(name, classId);
        return ResponseEntity.ok(subject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable String id) {
        schoolService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
