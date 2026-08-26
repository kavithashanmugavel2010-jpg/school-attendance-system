package com.jvk.school.controller;

import com.jvk.school.model.Student;
import com.jvk.school.service.SchoolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final SchoolService schoolService;

    public StudentController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public ResponseEntity<List<Student>> getStudents(@RequestParam(required = false) String classId) {
        if (classId != null && !classId.isEmpty()) {
            return ResponseEntity.ok(schoolService.getStudentsByClass(classId));
        }
        return ResponseEntity.ok(schoolService.getAllStudents());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String classId = payload.get("classId");
        Student student = schoolService.createStudent(name, classId);
        return ResponseEntity.ok(student);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        schoolService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
