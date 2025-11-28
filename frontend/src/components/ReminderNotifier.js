import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import api from '../api';
import { notifications } from '../utils/notifications';

const ReminderNotifier = () => {
    // Ref để lưu danh sách các ID đã thông báo trong phiên làm việc này
    // Tránh việc thông báo lặp lại liên tục trong cùng 1 phút
    const notifiedRemindersRef = useRef(new Set());

    // Lấy danh sách nhắc nhở (sử dụng cache từ React Query nếu có)
    const { data: reminders = [] } = useQuery(
        'reminders',
        async () => {
            const res = await api.get('/reminders');
            return res.data;
        },
        {
            staleTime: 5 * 60 * 1000, // 5 phút
            refetchOnWindowFocus: true,
        }
    );

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            reminders.forEach(reminder => {
                // Kiểm tra điều kiện:
                // 1. Ngày trùng khớp
                // 2. Giờ trùng khớp (lấy 5 ký tự đầu HH:mm)
                // 3. Đang bật (enabled)
                // 4. Chưa được thông báo
                if (
                    reminder.date === todayStr &&
                    reminder.time &&
                    reminder.time.startsWith(currentTime) &&
                    reminder.enabled &&
                    !notifiedRemindersRef.current.has(reminder.id)
                ) {
                    // Gửi thông báo
                    notifications.reminderDue(reminder.title);

                    // Đánh dấu đã thông báo
                    notifiedRemindersRef.current.add(reminder.id);
                }
            });
        };

        // Kiểm tra mỗi 30 giây
        const intervalId = setInterval(checkReminders, 30000);

        // Kiểm tra ngay lập tức khi component mount hoặc data thay đổi
        checkReminders();

        return () => clearInterval(intervalId);
    }, [reminders]);

    return null; // Component này không render gì cả
};

export default ReminderNotifier;
