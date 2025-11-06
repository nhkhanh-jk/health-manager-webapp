package com.hrmanagement.service;

import com.hrmanagement.model.MedicalHistory;
import com.hrmanagement.repository.MedicalHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalHistoryService {

    private final MedicalHistoryRepository medicalHistoryRepository;

    public MedicalHistoryService(MedicalHistoryRepository medicalHistoryRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
    }

    // 🟢 Lấy tất cả hồ sơ y tế
    public List<MedicalHistory> getAll() {
        return medicalHistoryRepository.findAll();
    }

    // 🟢 Lấy hồ sơ theo ID
    public MedicalHistory getById(Long id) {
        return medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with ID: " + id));
    }

    // 🟢 Thêm mới hồ sơ
    public MedicalHistory create(MedicalHistory record) {
        return medicalHistoryRepository.save(record);
    }

    // 🟢 Cập nhật hồ sơ
    public MedicalHistory update(Long id, MedicalHistory updatedRecord) {
        MedicalHistory existing = getById(id);
        existing.setDate(updatedRecord.getDate());
        existing.setTitle(updatedRecord.getTitle());
        existing.setNotes(updatedRecord.getNotes());
        return medicalHistoryRepository.save(existing);
    }

    // 🟢 Xóa hồ sơ
    public void delete(Long id) {
        if (!medicalHistoryRepository.existsById(id)) {
            throw new RuntimeException("Medical record not found with ID: " + id);
        }
        medicalHistoryRepository.deleteById(id);
    }
}
