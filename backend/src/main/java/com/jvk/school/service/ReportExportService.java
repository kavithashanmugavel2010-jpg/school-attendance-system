package com.jvk.school.service;

import com.jvk.school.model.AttendanceRecord;
import com.jvk.school.model.MarkRecord;
import com.jvk.school.model.SchoolClass;
import com.jvk.school.model.Student;
import com.jvk.school.repository.*;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class ReportExportService {

    private final SchoolClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final MarkRecordRepository markRepository;

    public ReportExportService(SchoolClassRepository classRepository,
                               StudentRepository studentRepository,
                               AttendanceRecordRepository attendanceRepository,
                               MarkRecordRepository markRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
    }

    @Bulkhead(name = "heavyOpsBulkhead")
    @Transactional(readOnly = true)
    public byte[] generateClassReportExcel(String classId) throws IOException {
        SchoolClass schoolClass = classRepository.findById(classId).orElse(null);
        String className = schoolClass != null ? schoolClass.getName() : classId;
        List<Student> students = studentRepository.findByClassId(classId);
        List<MarkRecord> marks = markRepository.findByClassId(classId);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Class " + className + " Report");

            // Header Style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Title row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("St. Joseph Vidya Kshetra - Performance & Attendance Report (" + className + ")");

            // Header row
            Row headerRow = sheet.createRow(2);
            String[] columns = {"Student ID", "Student Name", "Class ID", "Total Marks Recorded", "Average Score"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 3;
            for (Student student : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(student.getId());
                row.createCell(1).setCellValue(student.getName());
                row.createCell(2).setCellValue(student.getClassId());

                List<MarkRecord> studentMarks = marks.stream()
                        .filter(m -> m.getStudentId().equals(student.getId()) && m.getScore() != null)
                        .toList();

                row.createCell(3).setCellValue(studentMarks.size());
                double avg = studentMarks.stream().mapToDouble(MarkRecord::getScore).average().orElse(0.0);
                row.createCell(4).setCellValue(Math.round(avg * 100.0) / 100.0);
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    @Async("taskExecutor")
    public CompletableFuture<byte[]> generateClassReportExcelAsync(String classId) {
        try {
            byte[] reportData = generateClassReportExcel(classId);
            return CompletableFuture.completedFuture(reportData);
        } catch (IOException e) {
            return CompletableFuture.failedFuture(e);
        }
    }
}
