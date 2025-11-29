package com.healthmanager.controller;

import com.healthmanager.model.MedicalHistory;
import com.healthmanager.service.MedicalHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health/medical-history")
public class MedicalHistoryController {

    @Autowired
    private MedicalHistoryService medicalHistoryService;

    // API: POST /api/health/medical-history
    // Dùng để tạo bản ghi lịch sử bệnh lý mới
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MedicalHistory> createMedicalHistory(@RequestBody MedicalHistory history) {
        MedicalHistory newHistory = medicalHistoryService.createHistoryRecord(history);
        return ResponseEntity.ok(newHistory);
    }

    // API: GET /api/health/medical-history
    // Dùng để lấy TẤT CẢ lịch sử bệnh lý của người dùng hiện tại (cho Dashboard và trang list)
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MedicalHistory>> getAllMedicalHistory() {
        List<MedicalHistory> historyList = medicalHistoryService.getAllHistoryForCurrentUser();
        return ResponseEntity.ok(historyList);
    }
    
    // API: PUT /api/health/medical-history/{id}
    // Dùng để cập nhật bản ghi lịch sử bệnh lý
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MedicalHistory> updateMedicalHistory(@PathVariable Long id, @RequestBody MedicalHistory historyDetails) {
        MedicalHistory updatedHistory = medicalHistoryService.updateHistoryRecord(id, historyDetails);
        return ResponseEntity.ok(updatedHistory);
    }
    
    // API: DELETE /api/health/medical-history/{id}
    // Dùng để xóa bản ghi
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMedicalHistory(@PathVariable Long id) {
        medicalHistoryService.deleteHistoryRecord(id);
        return ResponseEntity.noContent().build();
    }
}
