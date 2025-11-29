package com.healthmanager.repository;

import com.healthmanager.model.Reminder;
import com.healthmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByUser(User user);

    /**
     * Lấy danh sách các nhắc nhở của một người dùng cụ thể vào một ngày nhất định.
     * Hàm này giúp tối ưu hóa hiệu năng cho Dashboard và Lịch, thay vì phải tải tất
     * cả nhắc nhở rồi lọc.
     */
    List<Reminder> findByUserAndDate(User user, LocalDate date);

    /**
     * Xóa tất cả các nhắc nhở thuộc cùng một chuỗi (series) của người dùng.
     * Được sử dụng khi người dùng chọn chức năng "Xóa tất cả các lần lặp" của một
     * sự kiện định kỳ.
     */
    @Transactional
    void deleteBySeriesIdAndUser(Long seriesId, User user);
}
