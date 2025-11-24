# 🚀 QUICK START - Health Manager

## ✅ **ĐĂNG NHẬP NGAY (DEMO MODE)**

### 🌐 **Frontend: http://localhost:3000**

### 👤 **Demo Account:**

| Email | Password | Description |
|-------|----------|-------------|
| `admin@company.com` | `admin123` | Demo user |

---

## 🔧 **CHẠY FULL SYSTEM (Backend + Database)**

### Bước 1: Cài đặt MySQL
```bash
# macOS với Homebrew
brew install mysql
brew services start mysql

# Hoặc tải MySQL từ: https://dev.mysql.com/downloads/mysql/
```

### Bước 2: Tạo Database
```sql
-- Kết nối MySQL
mysql -u root -p

-- Tạo database
CREATE DATABASE health_manager;
CREATE USER 'healthuser'@'localhost' IDENTIFIED BY 'healthpass';
GRANT ALL PRIVILEGES ON health_manager.* TO 'healthuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Bước 3: Cấu hình Backend
```bash
# Chỉnh sửa backend/src/main/resources/application.properties
nano backend/src/main/resources/application.properties

# Đảm bảo có:
spring.datasource.url=jdbc:mysql://localhost:3306/health_manager
spring.datasource.username=healthuser
spring.datasource.password=healthpass
```

### Bước 4: Chạy Backend
```bash
cd backend
mvn spring-boot:run
# Backend sẽ chạy tại: http://localhost:8080
```

### Bước 5: Chạy Frontend
```bash
cd frontend
npm install
npm start
# Frontend sẽ chạy tại: http://localhost:3000
```

---

## 🐛 **TROUBLESHOOTING**

### ❌ Lỗi "Cannot connect to backend"
**Giải pháp:** Frontend sẽ tự fallback sang mock data
- Bạn vẫn test được toàn bộ UI
- Data sẽ không persist khi reload

### ❌ Lỗi "Port 3000 already in use"
```bash
# Tìm và kill process
lsof -ti:3000 | xargs kill -9
# Hoặc chạy trên port khác
PORT=3001 npm start
```

### ❌ Lỗi MySQL connection
```bash
# Kiểm tra MySQL có chạy không
brew services list | grep mysql
# Hoặc
sudo systemctl status mysql
```

---

## 🎯 **DEMO FEATURES**

### ✅ **Có thể test ngay:**
- 🔐 **Login/Logout**
- 🏠 **Dashboard** với stats huyết áp, nhịp tim, cân nặng + charts
- 💪 **Fitness** library với filter và tracker
- 🔔 **Reminders** lịch tháng + CRUD nhắc nhở
- 🤖 **AI Chatbot** tư vấn sức khỏe (cần Gemini API key)

### ⚠️ **Cần backend để:**
- Lưu reminders vào MySQL
- Theo dõi measurements thực tế
- AI chatbot với Gemini API

---

## 🎉 **BẮT ĐẦU NGAY**

1. **Mở trình duyệt:** http://localhost:3000
2. **Đăng nhập với:** admin@company.com / admin123
3. **Khám phá Health Manager!**

**🚀 Hệ thống đã sẵn sàng!**
