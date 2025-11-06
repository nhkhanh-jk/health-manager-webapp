-- Insert sample data for testing
-- Note: This file will be executed automatically by Spring Boot

-- Insert sample employees
INSERT INTO employees (first_name, last_name, email, password, employee_id, department, position, hire_date, role, is_active, created_at, updated_at) VALUES
('Admin', 'User', 'admin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP24ADM001', 'IT', 'System Administrator', '2024-01-01', 'ADMIN', true, NOW(), NOW()),
('HR', 'Manager', 'hr@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP24HR001', 'Human Resources', 'HR Manager', '2024-01-15', 'HR', true, NOW(), NOW()),
('John', 'Smith', 'manager@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP24MGR001', 'Engineering', 'Engineering Manager', '2024-02-01', 'MANAGER', true, NOW(), NOW()),
('Jane', 'Doe', 'employee@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP24EMP001', 'Engineering', 'Software Developer', '2024-02-15', 'EMPLOYEE', true, NOW(), NOW()),
('Alice', 'Johnson', 'alice@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP24EMP002', 'Marketing', 'Marketing Specialist', '2024-03-01', 'EMPLOYEE', true, NOW(), NOW()),
('Bob', 'Wilson', 'bob@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP24EMP003', 'Sales', 'Sales Representative', '2024-03-15', 'EMPLOYEE', true, NOW(), NOW());

-- Insert sample absence requests
INSERT INTO absence_requests (employee_id, start_date, end_date, absence_type, reason, status, created_at, updated_at) VALUES
(4, '2024-12-25', '2024-12-27', 'Annual Leave', 'Christmas holidays with family', 'APPROVED', NOW(), NOW()),
(5, '2024-12-30', '2024-12-31', 'Annual Leave', 'New Year break', 'PENDING', NOW(), NOW()),
(6, '2024-12-20', '2024-12-22', 'Sick Leave', 'Medical appointment and recovery', 'APPROVED', NOW(), NOW());

-- Insert sample documents
INSERT INTO documents (title, description, file_name, file_path, file_size, mime_type, category, access_level, uploaded_by, is_active, created_at, updated_at) VALUES
('Employee Handbook 2024', 'Complete guide for new employees including company policies and procedures', 'employee_handbook_2024.pdf', '/uploads/documents/handbook.pdf', 2048000, 'application/pdf', 'HANDBOOK', 'ALL_EMPLOYEES', 2, true, NOW(), NOW()),
('Leave Policy', 'Annual leave and sick leave policies and procedures', 'leave_policy.pdf', '/uploads/documents/leave_policy.pdf', 512000, 'application/pdf', 'POLICY', 'ALL_EMPLOYEES', 2, true, NOW(), NOW()),
('Performance Review Form', 'Template for annual performance reviews', 'performance_review_form.docx', '/uploads/documents/perf_review.docx', 256000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'FORM', 'MANAGERS_ONLY', 2, true, NOW(), NOW()),
('IT Security Guidelines', 'Best practices for information security', 'it_security_guidelines.pdf', '/uploads/documents/security.pdf', 1024000, 'application/pdf', 'POLICY', 'ALL_EMPLOYEES', 1, true, NOW(), NOW());

-- Insert sample company events
INSERT INTO company_events (title, description, start_date, end_date, all_day, location, type, priority, created_by, is_active, created_at, updated_at) VALUES
('All Hands Meeting', 'Quarterly company meeting to discuss progress and upcoming initiatives', '2024-12-15 14:00:00', '2024-12-15 16:00:00', false, 'Conference Room A', 'MEETING', 'HIGH', 2, true, NOW(), NOW()),
('Christmas Party', 'Annual Christmas celebration for all employees', '2024-12-20 18:00:00', '2024-12-20 22:00:00', false, 'Main Office Lobby', 'COMPANY_EVENT', 'MEDIUM', 2, true, NOW(), NOW()),
('New Year Holiday', 'Office closed for New Year holiday', '2024-12-31 00:00:00', '2025-01-01 23:59:59', true, 'N/A', 'HOLIDAY', 'LOW', 1, true, NOW(), NOW()),
('Q1 Planning Session', 'Strategic planning for Q1 2025', '2025-01-05 09:00:00', '2025-01-05 17:00:00', false, 'Conference Room B', 'MEETING', 'HIGH', 3, true, NOW(), NOW()),
('Team Building Workshop', 'Team building activities for Engineering team', '2025-01-10 10:00:00', '2025-01-10 15:00:00', false, 'Offsite Location', 'TRAINING', 'MEDIUM', 3, true, NOW(), NOW());

-- Health Manager seed data

-- Measurements (last 7 days)
INSERT INTO measurements (date, systolic_bp, diastolic_bp, heart_rate, weight, created_at, updated_at)
VALUES
(CURRENT_DATE, 123, 79, 72, 80.0, NOW(), NOW()),
(CURRENT_DATE - INTERVAL 1 DAY, 120, 76, 69, 80.2, NOW(), NOW()),
(CURRENT_DATE - INTERVAL 2 DAY, 118, 74, 71, 80.5, NOW(), NOW()),
(CURRENT_DATE - INTERVAL 3 DAY, 122, 77, 70, 80.3, NOW(), NOW()),
(CURRENT_DATE - INTERVAL 4 DAY, 119, 75, 72, 80.1, NOW(), NOW()),
(CURRENT_DATE - INTERVAL 5 DAY, 123, 78, 68, 80.4, NOW(), NOW()),
(CURRENT_DATE - INTERVAL 6 DAY, 120, 76, 71, 80.2, NOW(), NOW());

-- Reminders
INSERT INTO reminders (title, date, time, is_enabled, created_at, updated_at)
VALUES
('Uống thuốc huyết áp', CURRENT_DATE, '08:00:00', TRUE, NOW(), NOW()),
('Tập cardio buổi sáng', CURRENT_DATE, '07:00:00', TRUE, NOW(), NOW()),
('Uống nước 2 lít', CURRENT_DATE, '12:00:00', TRUE, NOW(), NOW()),
('Tập yoga buổi chiều', CURRENT_DATE, '18:00:00', TRUE, NOW(), NOW()),
('Đi ngủ đúng giờ', CURRENT_DATE, '22:30:00', FALSE, NOW(), NOW()),
('Kiểm tra huyết áp', CURRENT_DATE + INTERVAL 1 DAY, '09:00:00', TRUE, NOW(), NOW());

-- Workout Sessions
INSERT INTO workout_sessions (title, level, duration_minutes, calories, date, created_at, updated_at)
VALUES
('Cardio 10 phút', 'Beginner', 10, 80, CURRENT_DATE, NOW(), NOW()),
('Yoga thư giãn 15 phút', 'Beginner', 15, 60, CURRENT_DATE - INTERVAL 1 DAY, NOW(), NOW()),
('HIIT 20 phút', 'Intermediate', 20, 200, CURRENT_DATE - INTERVAL 2 DAY, NOW(), NOW()),
('Sức mạnh toàn thân', 'Advanced', 30, 250, CURRENT_DATE - INTERVAL 3 DAY, NOW(), NOW());

-- Medical History (demo)
INSERT INTO medical_history (date, title, notes, created_at, updated_at) VALUES
(CURRENT_DATE - INTERVAL 400 DAY, 'Tăng huyết áp', 'Chẩn đoán tăng huyết áp giai đoạn 1. Theo dõi huyết áp hằng ngày và dùng thuốc theo hướng dẫn.', NOW(), NOW()),
(CURRENT_DATE - INTERVAL 300 DAY, 'Dị ứng', 'Dị ứng thời tiết (viêm mũi dị ứng). Tránh tiếp xúc bụi phấn, dùng thuốc khi cần.', NOW(), NOW()),
(CURRENT_DATE - INTERVAL 200 DAY, 'Khám sức khỏe tổng quát', 'Kết quả tốt, khuyến nghị duy trì tập luyện và chế độ ăn lành mạnh.', NOW(), NOW()),
(CURRENT_DATE - INTERVAL 120 DAY, 'Đau dạ dày nhẹ', 'Điều trị nội khoa, theo dõi triệu chứng, tránh đồ cay nóng.', NOW(), NOW()),
(CURRENT_DATE - INTERVAL 60 DAY, 'Tiêm phòng cúm', 'Đã tiêm phòng cúm mùa.', NOW(), NOW());
