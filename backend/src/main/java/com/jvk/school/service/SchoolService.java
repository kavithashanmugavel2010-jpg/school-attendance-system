package com.jvk.school.service;

import com.jvk.school.dto.AttendanceSaveRequest;
import com.jvk.school.dto.CreateClassRequest;
import com.jvk.school.dto.CreateStudentRequest;
import com.jvk.school.dto.CreateSubjectRequest;
import com.jvk.school.dto.MarkSaveRequest;
import com.jvk.school.exception.ResourceNotFoundException;
import com.jvk.school.model.*;
import com.jvk.school.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SchoolService {

    private final SchoolClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final MarkRecordRepository markRepository;

    public SchoolService(SchoolClassRepository classRepository,
                         StudentRepository studentRepository,
                         SubjectRepository subjectRepository,
                         AttendanceRecordRepository attendanceRepository,
                         MarkRecordRepository markRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "classes")
    public List<SchoolClass> getAllClasses() {
        return classRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<SchoolClass> getAllClasses(Pageable pageable) {
        return classRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public SchoolClass getClassById(String id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
    }

    @Transactional
    @CacheEvict(value = {"classes", "subjects"}, allEntries = true)
    public SchoolClass createClass(CreateClassRequest request) {
        String id = "class_" + request.getName().toLowerCase().replace(" ", "_");
        if (classRepository.existsById(id)) {
            id = "class_" + System.currentTimeMillis();
        }
        SchoolClass schoolClass = new SchoolClass(id, request.getName(), request.getSection());
        classRepository.save(schoolClass);

        List<String> defaultSubjects = List.of("L1", "L2", "L3", "Science", "Social", "Maths", "Computer");
        int idx = 0;
        for (String subName : defaultSubjects) {
            Subject sub = new Subject(id + "_sub_" + idx++, subName, id);
            subjectRepository.save(sub);
        }

        return schoolClass;
    }

    @Transactional
    @CacheEvict(value = {"classes", "students", "subjects", "attendance"}, allEntries = true)
    public void deleteClass(String id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found with id: " + id);
        }
        studentRepository.deleteByClassId(id);
        subjectRepository.deleteByClassId(id);
        classRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "students", key = "#classId")
    public List<Student> getStudentsByClass(String classId) {
        return studentRepository.findByClassId(classId);
    }

    @Transactional(readOnly = true)
    public Page<Student> getStudentsByClass(String classId, Pageable pageable) {
        return studentRepository.findByClassId(classId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    @Transactional
    @CacheEvict(value = "students", allEntries = true)
    public Student createStudent(CreateStudentRequest request) {
        if (!classRepository.existsById(request.getClassId())) {
            throw new ResourceNotFoundException("Class not found with id: " + request.getClassId());
        }
        String id = "stud_" + System.currentTimeMillis();
        Student student = new Student(id, request.getName(), request.getClassId());
        return studentRepository.save(student);
    }

    @Transactional
    @CacheEvict(value = "students", allEntries = true)
    public void deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "subjects", key = "#classId")
    public List<Subject> getSubjectsByClass(String classId) {
        return subjectRepository.findByClassId(classId);
    }

    @Transactional(readOnly = true)
    public Page<Subject> getSubjectsByClass(String classId, Pageable pageable) {
        return subjectRepository.findByClassId(classId, pageable);
    }

    @Transactional(readOnly = true)
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public Subject createSubject(CreateSubjectRequest request) {
        if (!classRepository.existsById(request.getClassId())) {
            throw new ResourceNotFoundException("Class not found with id: " + request.getClassId());
        }
        String id = "sub_" + System.currentTimeMillis();
        Subject subject = new Subject(id, request.getName(), request.getClassId());
        return subjectRepository.save(subject);
    }

    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public void deleteSubject(String id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "attendance", key = "#classId + '_' + #date")
    public List<AttendanceRecord> getAttendance(String classId, String date) {
        return attendanceRepository.findByClassIdAndDate(classId, date);
    }

    @Transactional(readOnly = true)
    public Page<AttendanceRecord> getAttendance(String classId, String date, Pageable pageable) {
        return attendanceRepository.findByClassIdAndDate(classId, date, pageable);
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecord> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<AttendanceRecord> getAllAttendance(Pageable pageable) {
        return attendanceRepository.findAll(pageable);
    }

    @Transactional
    @CacheEvict(value = "attendance", allEntries = true)
    public void saveAttendance(AttendanceSaveRequest request) {
        attendanceRepository.deleteByClassIdAndDate(request.getClassId(), request.getDate());
        if (request.getRecords() != null && !request.getRecords().isEmpty()) {
            List<AttendanceRecord> records = new ArrayList<>();
            for (Map.Entry<String, String> entry : request.getRecords().entrySet()) {
                records.add(new AttendanceRecord(
                        request.getClassId(), request.getDate(), entry.getKey(), entry.getValue()
                ));
            }
            attendanceRepository.saveAll(records);
        }
    }

    @Transactional(readOnly = true)
    public List<MarkRecord> getMarks(String classId, String examType, String subjectId) {
        return markRepository.findByClassIdAndExamTypeAndSubjectId(classId, examType, subjectId);
    }

    @Transactional(readOnly = true)
    public Page<MarkRecord> getMarks(String classId, String examType, String subjectId, Pageable pageable) {
        return markRepository.findByClassIdAndExamTypeAndSubjectId(classId, examType, subjectId, pageable);
    }

    @Transactional(readOnly = true)
    public List<MarkRecord> getAllMarks() {
        return markRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<MarkRecord> getAllMarks(Pageable pageable) {
        return markRepository.findAll(pageable);
    }

    @Transactional
    public void saveMarks(MarkSaveRequest request) {
        markRepository.deleteByClassIdAndExamTypeAndSubjectId(request.getClassId(), request.getExamType(), request.getSubjectId());
        if (request.getRecords() != null && !request.getRecords().isEmpty()) {
            List<MarkRecord> records = new ArrayList<>();
            for (Map.Entry<String, Double> entry : request.getRecords().entrySet()) {
                records.add(new MarkRecord(
                        request.getClassId(), request.getExamType(), request.getSubjectId(), entry.getKey(), entry.getValue()
                ));
            }
            markRepository.saveAll(records);
        }
    }

    @Bean
    public CommandLineRunner initDefaultClasses() {
        return args -> {
            if (classRepository.count() == 0) {
                List<String> defaultSubjectNames = List.of("L1", "L2", "L3", "Science", "Social", "Maths", "Computer");
                List<String> classNames = List.of(
                    "6th A", "6th B", "6th C", "6th D",
                    "7th A", "7th B", "7th C", "7th D",
                    "8th A", "8th B", "8th C"
                );

                for (String className : classNames) {
                    String classId = "class_" + className.toLowerCase().replace(" ", "_");
                    String section = "Higher Secondary";

                    SchoolClass cls = new SchoolClass(classId, className, section);
                    classRepository.save(cls);

                    int idx = 0;
                    for (String subjectName : defaultSubjectNames) {
                        Subject sub = new Subject(classId + "_sub_" + idx++, subjectName, classId);
                        subjectRepository.save(sub);
                    }
                }
            }
        };
    }
}
