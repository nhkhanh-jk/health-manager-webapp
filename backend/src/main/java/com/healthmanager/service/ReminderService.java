package com.healthmanager.service;

import com.healthmanager.model.Reminder;
import com.healthmanager.model.User;
import com.healthmanager.repository.ReminderRepository;
import com.healthmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

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

    public List<Reminder> getAllRemindersForCurrentUser() {
        User currentUser = getCurrentUser();
        return reminderRepository.findByUser(currentUser);
    }

    /**
     * Tạo mới một nhắc nhở.
     * Hàm này xử lý logic phức tạp cho các nhắc nhở lặp lại (recurring reminders):
     * - Nếu không lặp: Tạo và lưu một bản ghi duy nhất.
     * - Nếu có lặp (hàng ngày/hàng tuần): Sinh ra các bản ghi riêng biệt
     * (instances) cho từng ngày
     * trong khoảng thời gian từ ngày bắt đầu đến ngày kết thúc.
     * Các bản ghi này sẽ có cùng một `seriesId` để quản lý nhóm.
     */
    public Reminder createReminder(Reminder reminder) {
        User currentUser = getCurrentUser();
        reminder.setUser(currentUser);

        if ("none".equals(reminder.getRepeat())) {
            reminder.setSeriesId(null);
            return reminderRepository.save(reminder);
        } else {
            // Logic xử lý cho nhắc nhở lặp lại
            List<Reminder> remindersToSave = new ArrayList<>();
            LocalDate startDate = reminder.getDate();
            LocalDate endDate = reminder.getEndDate();

            // Tạo một Series ID duy nhất dựa trên thời gian hiện tại để nhóm các nhắc nhở
            // này lại với nhau
            long seriesId = System.currentTimeMillis();

            LocalDate currentDateLoop = startDate;
            // Duyệt qua từng ngày trong khoảng thời gian để tạo nhắc nhở
            while (!currentDateLoop.isAfter(endDate)) {
                boolean shouldCreate = false;
                // Kiểm tra xem ngày hiện tại có khớp với kiểu lặp không
                if (reminder.getRepeat().equals("daily")) {
                    shouldCreate = true; // Hàng ngày: luôn tạo
                } else if (reminder.getRepeat().equals("weekly")
                        && currentDateLoop.getDayOfWeek() == startDate.getDayOfWeek()) {
                    shouldCreate = true; // Hàng tuần: chỉ tạo nếu trùng thứ trong tuần
                }

                if (shouldCreate) {
                    Reminder newInstance = new Reminder();
                    newInstance.setUser(currentUser);
                    newInstance.setTitle(reminder.getTitle());
                    newInstance.setTime(reminder.getTime());
                    newInstance.setType(reminder.getType());
                    newInstance.setEnabled(reminder.getEnabled());
                    newInstance.setRepeat(reminder.getRepeat());
                    newInstance.setEndDate(reminder.getEndDate());
                    newInstance.setDate(currentDateLoop.toString()); // Lưu dưới dạng String để tương thích
                    newInstance.setSeriesId(seriesId); // Gán cùng seriesId cho tất cả

                    remindersToSave.add(newInstance);
                }

                currentDateLoop = currentDateLoop.plusDays(1);
            }
            reminderRepository.saveAll(remindersToSave);
            return remindersToSave.isEmpty() ? null : remindersToSave.get(0);
        }
    }

    /**
     * Cập nhật một nhắc nhở đã tồn tại.
     * ĐIỂM ĐẶC BIỆT: Nếu nhắc nhở này thuộc một chuỗi lặp (series), nó sẽ được TÁCH
     * RA khỏi chuỗi.
     * Điều này giúp tránh việc sửa một ngày cụ thể lại làm thay đổi toàn bộ các
     * ngày khác trong chuỗi.
     * (Ví dụ: Dời lịch tập gym hôm nay sang giờ khác, nhưng các ngày sau vẫn giữ
     * giờ cũ).
     */
    public Reminder updateReminder(Long id, Reminder reminderDetails) {
        User currentUser = getCurrentUser();
        Reminder existingReminder = reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhắc nhở"));

        if (!existingReminder.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Không có quyền cập nhật nhắc nhở này");
        }

        // Logic tách chuỗi: Nếu đang sửa một instance của chuỗi lặp, xóa seriesId để
        // biến nó thành độc lập
        if (existingReminder.getSeriesId() != null) {
            reminderDetails.setSeriesId(null);
            reminderDetails.setRepeat("none");
        }

        existingReminder.setTitle(reminderDetails.getTitle());
        existingReminder.setDate(reminderDetails.getDate());
        existingReminder.setTime(reminderDetails.getTime());
        existingReminder.setType(reminderDetails.getType());
        existingReminder.setEnabled(reminderDetails.getEnabled());
        existingReminder.setRepeat(reminderDetails.getRepeat());
        existingReminder.setEndDate(reminderDetails.getEndDate());
        existingReminder.setSeriesId(reminderDetails.getSeriesId());

        return reminderRepository.save(existingReminder);
    }

    /**
     * Xóa nhắc nhở.
     * Hỗ trợ 2 chế độ xóa thông minh (Smart Delete):
     * - "instance": Chỉ xóa bản ghi nhắc nhở cụ thể này (Ví dụ: Chỉ nghỉ tập hôm
     * nay).
     * - "series": Xóa TẤT CẢ các nhắc nhở thuộc cùng series này (Ví dụ: Hủy toàn bộ
     * lịch tập).
     */
    public void deleteReminder(Long id, String deleteType) {
        User currentUser = getCurrentUser();
        Reminder existingReminder = reminderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhắc nhở"));

        if (!existingReminder.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Không có quyền xóa nhắc nhở này");
        }

        // Nếu chọn xóa chuỗi và nhắc nhở có seriesId, gọi hàm xóa batch trong
        // repository
        if ("series".equals(deleteType) && existingReminder.getSeriesId() != null) {
            reminderRepository.deleteBySeriesIdAndUser(existingReminder.getSeriesId(), currentUser);
        } else {
            // Ngược lại chỉ xóa bản ghi hiện tại
            reminderRepository.delete(existingReminder);
        }
    }

    /**
     * Lấy thống kê nhanh về nhắc nhở trong ngày hôm nay.
     * Dùng cho widget "Hôm nay" trên Dashboard, trả về số lượng tổng, số đã hoàn
     * thành/chưa hoàn thành
     * và danh sách 3 nhắc nhở đầu tiên để hiển thị nhanh.
     */
    public Map<String, Object> getTodayReminderStats() {
        User currentUser = getCurrentUser();
        LocalDate today = LocalDate.now();
        List<Reminder> todayReminders = reminderRepository.findByUserAndDate(currentUser, today);

        long onCount = todayReminders.stream().filter(Reminder::getEnabled).count();
        long offCount = todayReminders.size() - onCount;

        Map<String, Object> stats = new HashMap<>();
        stats.put("count", todayReminders.size());
        stats.put("on", onCount);
        stats.put("off", offCount);
        stats.put("items", todayReminders.stream().limit(3).collect(Collectors.toList()));

        return stats;
    }
}
