package com.healthmanager.repository;

import com.healthmanager.model.MedicalHistory;
import com.healthmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    /**
     * Lấy tất cả lịch sử bệnh lý của một người dùng, sắp xếp theo ngày giảm dần.
     * Cần cho Dashboard (để lấy 3 mục gần nhất) và trang lịch sử chi tiết.
     */
    List<MedicalHistory> findByUserOrderByDateDesc(User user);
}
