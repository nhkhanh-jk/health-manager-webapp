-- Delete existing workout sessions (user sẽ được tạo tự động bởi DataInitializer)
DELETE FROM workout_sessions;

-- Insert workout sessions
INSERT INTO workout_sessions (title, level, duration_minutes, calories, date, created_at, updated_at) VALUES
  ('Cardio sáng 20 phút', 'Beginner', 20, 150, CURDATE(), NOW(), NOW()),
  ('HIIT toàn thân', 'Intermediate', 25, 240, DATE_SUB(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
  ('Yoga thư giãn', 'Beginner', 30, 120, DATE_SUB(CURDATE(), INTERVAL 2 DAY), NOW(), NOW()),
  ('Strength training', 'Intermediate', 40, 320, DATE_SUB(CURDATE(), INTERVAL 3 DAY), NOW(), NOW()),
  ('Chạy bộ ngoài trời', 'Advanced', 35, 300, DATE_SUB(CURDATE(), INTERVAL 4 DAY), NOW(), NOW()),
  ('Đạp xe buổi chiều', 'Advanced', 45, 380, DATE_SUB(CURDATE(), INTERVAL 5 DAY), NOW(), NOW()),
  ('Pilates phục hồi', 'Beginner', 30, 110, DATE_SUB(CURDATE(), INTERVAL 6 DAY), NOW(), NOW());

