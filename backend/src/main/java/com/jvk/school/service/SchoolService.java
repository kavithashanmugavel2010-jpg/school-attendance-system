package com.jvk.school.service;

import com.jvk.school.dto.AttendanceSaveRequest;
import com.jvk.school.dto.MarkSaveRequest;
import com.jvk.school.model.*;
import com.jvk.school.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
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

    public List<SchoolClass> getAllClasses() {
        return classRepository.findAll();
    }

    @Transactional
    public SchoolClass createClass(String name, String section) {
        String id = "class_" + System.currentTimeMillis();
        SchoolClass schoolClass = new SchoolClass(id, name, section);
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
    public void deleteClass(String id) {
        studentRepository.deleteByClassId(id);
        subjectRepository.deleteByClassId(id);
        classRepository.deleteById(id);
    }

    public List<Student> getStudentsByClass(String classId) {
        return studentRepository.findByClassId(classId);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student createStudent(String name, String classId) {
        String id = "stud_" + System.currentTimeMillis();
        Student student = new Student(id, name, classId);
        return studentRepository.save(student);
    }

    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }

    public List<Subject> getSubjectsByClass(String classId) {
        return subjectRepository.findByClassId(classId);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject createSubject(String name, String classId) {
        String id = "sub_" + System.currentTimeMillis();
        Subject subject = new Subject(id, name, classId);
        return subjectRepository.save(subject);
    }

    public void deleteSubject(String id) {
        subjectRepository.deleteById(id);
    }

    public List<AttendanceRecord> getAttendance(String classId, String date) {
        return attendanceRepository.findByClassIdAndDate(classId, date);
    }

    public List<AttendanceRecord> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    @Transactional
    public void saveAttendance(AttendanceSaveRequest request) {
        attendanceRepository.deleteByClassIdAndDate(request.getClassId(), request.getDate());
        if (request.getRecords() != null) {
            for (Map.Entry<String, String> entry : request.getRecords().entrySet()) {
                AttendanceRecord record = new AttendanceRecord(
                        request.getClassId(), request.getDate(), entry.getKey(), entry.getValue()
                );
                attendanceRepository.save(record);
            }
        }
    }

    public List<MarkRecord> getMarks(String classId, String examType, String subjectId) {
        return markRepository.findByClassIdAndExamTypeAndSubjectId(classId, examType, subjectId);
    }

    public List<MarkRecord> getAllMarks() {
        return markRepository.findAll();
    }

    @Transactional
    public void saveMarks(MarkSaveRequest request) {
        markRepository.deleteByClassIdAndExamTypeAndSubjectId(request.getClassId(), request.getExamType(), request.getSubjectId());
        if (request.getRecords() != null) {
            for (Map.Entry<String, Double> entry : request.getRecords().entrySet()) {
                MarkRecord record = new MarkRecord(
                        request.getClassId(), request.getExamType(), request.getSubjectId(), entry.getKey(), entry.getValue()
                );
                markRepository.save(record);
            }
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
