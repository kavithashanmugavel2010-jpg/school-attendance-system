package com.jvk.school.controller;

import com.jvk.school.service.ReportExportService;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports & Analytics", description = "Endpoints for generating exportable report cards and attendance sheets")
public class ReportController {

    private final ReportExportService reportExportService;

    public ReportController(ReportExportService reportExportService) {
        this.reportExportService = reportExportService;
    }

    @GetMapping("/class/{classId}/excel")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @Bulkhead(name = "heavyOpsBulkhead")
    @Operation(summary = "Generate and export Class Performance & Attendance Report in Excel (.xlsx) format")
    public ResponseEntity<byte[]> exportClassReportExcel(@PathVariable String classId) throws IOException {
        byte[] excelData = reportExportService.generateClassReportExcel(classId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=class_" + classId + "_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelData);
    }
}
