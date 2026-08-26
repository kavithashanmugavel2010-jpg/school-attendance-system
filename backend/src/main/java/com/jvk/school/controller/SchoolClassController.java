package com.jvk.school.controller;

import com.jvk.school.model.SchoolClass;
import com.jvk.school.service.SchoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
public class SchoolClassController {

    private final SchoolService schoolService;

    public SchoolClassController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public ResponseEntity<List<SchoolClass>> getAllClasses() {
        return ResponseEntity.ok(schoolService.getAllClasses());
    }

    @PostMapping
    public ResponseEntity<SchoolClass> createClass(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String section = payload.getOrDefault("section", "Primary");
        SchoolClass schoolClass = schoolService.createClass(name, section);
        return ResponseEntity.ok(schoolClass);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable String id) {
        schoolService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
