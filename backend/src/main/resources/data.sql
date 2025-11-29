-- ============================================
-- WORKOUT LIBRARY/TEMPLATES (user_id = NULL, is_template = true)
-- Giữ lại 6 bài tập cơ bản (đã giảm từ nhiều xuống)
-- ============================================

-- FIX: Xóa các templates cũ trước khi insert để tránh duplicate
DELETE FROM workout_sessions WHERE is_template = true AND user_id IS NULL;

INSERT INTO workout_sessions (title, level, duration_minutes, calories, date, start_time, created_at, updated_at, is_completed, thumbnail, description, category, instructor, equipment, difficulty, rating, is_template, user_id, youtube_url) VALUES 
('Cardio buổi sáng', 'Beginner', 10, 80.0, CURRENT_DATE, '06:00:00', NOW(), NOW(), false, '🏃', 'Khởi động ngày mới với bài tập cardio nhẹ nhàng', 'Cardio', 'Coach Anna', 'Không cần dụng cụ', 2, 4.5, true, NULL, 'https://www.youtube.com/watch?v=mlVrkiCoKkg'),
('HIIT toàn thân', 'Intermediate', 20, 200.0, CURRENT_DATE, '07:00:00', NOW(), NOW(), false, '💪', 'Bài tập cường độ cao giúp đốt cháy mỡ thừa hiệu quả', 'HIIT', 'Coach Mike', 'Thảm tập', 4, 4.8, true, NULL, 'https://www.youtube.com/watch?v=UBMk30rjy0o'),
('Yoga thư giãn', 'Beginner', 15, 60.0, CURRENT_DATE, '18:00:00', NOW(), NOW(), false, '🧘', 'Thư giãn tinh thần và cơ thể với các tư thế yoga cơ bản', 'Yoga', 'Coach Sarah', 'Thảm yoga', 1, 4.7, true, NULL, 'https://www.youtube.com/watch?v=v7AYKMP6rOE'),
('Sức mạnh cơ bản', 'Intermediate', 25, 180.0, CURRENT_DATE, '08:00:00', NOW(), NOW(), false, '🏋️', 'Xây dựng cơ bắp và sức mạnh với các bài tập cơ bản', 'Strength', 'Coach David', 'Tạ tay, ghế', 3, 4.6, true, NULL, 'https://www.youtube.com/watch?v=IODxDxX7oi4'),
('Stretching buổi tối', 'Beginner', 10, 40.0, CURRENT_DATE, '20:00:00', NOW(), NOW(), false, '🤸', 'Thư giãn cơ thể sau một ngày làm việc với các động tác kéo giãn', 'Stretch', 'Coach Lisa', 'Không cần dụng cụ', 1, 4.4, true, NULL, 'https://www.youtube.com/watch?v=g_tea8ZNk5s'),
('Cardio nâng cao', 'Advanced', 30, 300.0, CURRENT_DATE, '07:30:00', NOW(), NOW(), false, '🚴', 'Thử thách bản thân với bài tập cardio cường độ cao', 'Cardio', 'Coach Tom', 'Máy chạy bộ, xe đạp', 5, 4.9, true, NULL, 'https://www.youtube.com/watch?v=ZbZSe6N_BXs');

-- FIX: UPDATE các templates hiện có nếu chưa có youtube_url
UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=mlVrkiCoKkg'
WHERE title = 'Cardio buổi sáng' AND is_template = true AND user_id IS NULL AND (youtube_url IS NULL OR youtube_url = '');

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=UBMk30rjy0o'
WHERE title = 'HIIT toàn thân' AND is_template = true AND user_id IS NULL AND (youtube_url IS NULL OR youtube_url = '');

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
WHERE title = 'Yoga thư giãn' AND is_template = true AND user_id IS NULL AND (youtube_url IS NULL OR youtube_url = '');

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=IODxDxX7oi4'
WHERE title = 'Sức mạnh cơ bản' AND is_template = true AND user_id IS NULL AND (youtube_url IS NULL OR youtube_url = '');

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=g_tea8ZNk5s'
WHERE title = 'Stretching buổi tối' AND is_template = true AND user_id IS NULL AND (youtube_url IS NULL OR youtube_url = '');

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=ZbZSe6N_BXs'
WHERE title = 'Cardio nâng cao' AND is_template = true AND user_id IS NULL AND (youtube_url IS NULL OR youtube_url = '');

-- ============================================
-- UPDATE YOUTUBE URLs TỪ update_youtube_urls.sql
-- Cập nhật các URLs mới cho workout templates
-- ============================================
UPDATE workout_sessions 
SET youtube_url = 'https://youtu.be/LwWEBTOMyRE?si=BJA4qC8Kiw08IHVC'
WHERE title = 'Cardio buổi sáng' AND is_template = true AND user_id IS NULL;

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=UBMk30rjy0o'
WHERE title = 'HIIT toàn thân' AND is_template = true AND user_id IS NULL;

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
WHERE title = 'Yoga thư giãn' AND is_template = true AND user_id IS NULL;

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=IODxDxX7oi4'
WHERE title = 'Sức mạnh cơ bản' AND is_template = true AND user_id IS NULL;

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=g_tea8ZNk5A'
WHERE title = 'Stretching buổi tối' AND is_template = true AND user_id IS NULL;

UPDATE workout_sessions 
SET youtube_url = 'https://www.youtube.com/watch?v=LwWEBTOMyRE'
WHERE title = 'Cardio nâng cao' AND is_template = true AND user_id IS NULL;

-- ============================================
-- WORKOUT SESSIONS MẪU CHO USER (sẽ được gán user_id khi user đăng nhập)
-- ============================================
-- Lưu ý: Các workout sessions này sẽ được gán user_id khi user tạo hoặc thực hiện bài tập

INSERT INTO medical_history (date, title, notes, status, type, user_id) VALUES
(CURRENT_DATE - INTERVAL '10 DAY', 'Khám sức khỏe tổng quát', 'Kết quả khám sức khỏe định kỳ. Tất cả các chỉ số đều bình thường.', 'completed', 'checkup', null),
(CURRENT_DATE - INTERVAL '30 DAY', 'Tiêm phòng cúm', 'Đã tiêm phòng cúm mùa. Không có phản ứng phụ.', 'completed', 'vaccination', null),
(CURRENT_DATE - INTERVAL '5 DAY', 'Đau đầu kéo dài', 'Đau đầu trong 3 ngày liên tiếp. Đã uống thuốc giảm đau.', 'ongoing', 'symptom', null);