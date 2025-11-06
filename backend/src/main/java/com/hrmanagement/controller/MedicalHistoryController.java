package com.hrmanagement.controller;

import com.hrmanagement.model.MedicalHistory;
import com.hrmanagement.repository.MedicalHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical")
@CrossOrigin(origins = "*")
public class MedicalHistoryController {

    private final MedicalHistoryRepository repository;

    public MedicalHistoryController(MedicalHistoryRepository repository) {
        this.repository = repository;
    }

    // 🟢 Lấy tất cả bản ghi
    @GetMapping
    public List<MedicalHistory> getAll() {
        return repository.findAll();
    }

    // 🟢 Lấy 1 bản ghi
    @GetMapping("/{id}")
    public ResponseEntity<MedicalHistory> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟢 Thêm mới
    @PostMapping
    public MedicalHistory create(@RequestBody MedicalHistory medicalHistory) {
        return repository.save(medicalHistory);
    }

    // 🟡 Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<MedicalHistory> update(@PathVariable Long id, @RequestBody MedicalHistory updated) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setDate(updated.getDate());
                    existing.setTitle(updated.getTitle());
                    existing.setNotes(updated.getNotes());
                    repository.save(existing);
                    return ResponseEntity.ok(existing);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔴 Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
