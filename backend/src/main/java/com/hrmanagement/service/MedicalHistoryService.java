package com.hrmanagement.service;

import com.hrmanagement.model.MedicalHistory;
import com.hrmanagement.model.User;
import com.hrmanagement.repository.MedicalHistoryRepository;
import com.hrmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicalHistoryService {

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    @Autowired
    private UserRepository userRepository;
    
    // --- Hàm tiện ích lấy User hiện tại (Giữ nguyên) ---
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + username));
    }
    // --- HẾT HÀM TIỆN ÍCH ---

    // Được Dashboard sử dụng
    public List<MedicalHistory> getAllHistoryForCurrentUser() {
        User currentUser = getCurrentUser();
        // Sắp xếp theo ngày giảm dần để Dashboard lấy 3 mục gần nhất
        return medicalHistoryRepository.findByUserOrderByDateDesc(currentUser); 
    }

    // Được Controller (nơi bạn nhập dữ liệu) sử dụng
    public MedicalHistory createHistoryRecord(MedicalHistory historyRecord) {
        User currentUser = getCurrentUser();
        
        // --- ĐÂY LÀ DÒNG QUAN TRỌNG: GÁN USER VÀO RECORD TRƯỚC KHI LƯU ---
        historyRecord.setUser(currentUser); 
        historyRecord.setId(null); 
        // ------------------------------------------------------------
        
        return medicalHistoryRepository.save(historyRecord);
    }

    // Cập nhật bản ghi lịch sử bệnh lý
    @Transactional
    public MedicalHistory updateHistoryRecord(Long id, MedicalHistory historyDetails) {
        User currentUser = getCurrentUser();
        MedicalHistory existingRecord = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi"));

        // Kiểm tra quyền sở hữu
        if (!existingRecord.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Không có quyền cập nhật bản ghi này");
        }

        // Cập nhật các trường
        if (historyDetails.getDate() != null) {
            existingRecord.setDate(historyDetails.getDate());
        }
        if (historyDetails.getTitle() != null) {
            existingRecord.setTitle(historyDetails.getTitle());
        }
        if (historyDetails.getNotes() != null) {
            existingRecord.setNotes(historyDetails.getNotes());
        }
        if (historyDetails.getStatus() != null) {
            existingRecord.setStatus(historyDetails.getStatus());
        }
        if (historyDetails.getType() != null) {
            existingRecord.setType(historyDetails.getType());
        }

        return medicalHistoryRepository.save(existingRecord);
    }

    @Transactional
    public void deleteHistoryRecord(Long id) {
        User currentUser = getCurrentUser();
        MedicalHistory record = medicalHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi"));

        if (!record.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Không có quyền xóa bản ghi này");
        }

        medicalHistoryRepository.delete(record);
    }
}