# Health Manager - Ứng dụng quản lý sức khỏe cá nhân

> Một dự án web app đơn giản để quản lý sức khỏe cá nhân, có tích hợp AI chatbot để tư vấn sức khỏe cơ bản. Sử dụng công nghệ React và Spring Boot

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-green)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-purple)](https://ai.google.dev/)

## 📖 Giới thiệu

Đây là một dự án web app quản lý sức khỏe của nhóm trong bộ môn OOP-PTIT. WebApp này giúp bạn:
- Theo dõi các chỉ số sức khỏe như huyết áp, nhịp tim, cân nặng
- Quản lý lịch tập luyện và theo dõi tiến trình
- Nhắc nhở uống thuốc, tập thể dục
- Chat với AI để hỏi về sức khỏe (tích hợp Gemini AI)
- Xem tin tức y tế mới nhất
- Lưu trữ lịch sử bệnh lý

**Lưu ý:** Đây là dự án BTL, không phải ứng dụng y tế chuyên nghiệp. AI chatbot chỉ để tham khảo, không thay thế tư vấn của bác sĩ nhé!

## ✨ Tính năng chính

### 🔐 Đăng nhập/Đăng ký
- Đăng ký tài khoản mới hoặc đăng nhập với email/password
- Sử dụng JWT để bảo mật 
- Lưu thông tin user vào database

### 📊 Dashboard
- Hiển thị tổng quan các chỉ số sức khỏe hôm nay
- Xem nhắc nhở trong ngày
- Xem lịch sử bệnh lý gần đây
- Thống kê tập luyện tuần này
- Tin tức y tế mới nhất

### 💪 Fitness (Tập luyện)
- Thư viện bài tập với các loại: Cardio, HIIT, Yoga, Strength, Stretch
- Mỗi bài tập có video YouTube hướng dẫn
- Đánh dấu hoàn thành bài tập và theo dõi tiến trình
- Xem thống kê: số bài tập đã làm, calo đốt cháy, thời gian tập

### 🔔 Reminders (Nhắc nhở)
- Tạo nhắc nhở uống thuốc, tập thể dục, ngủ đúng giờ
- Hỗ trợ lặp lại: hàng ngày, hàng tuần
- Bật/tắt nhắc nhở dễ dàng
- Xem lịch nhắc nhở theo tháng

### 🤖 AI Chatbot
- Chat với AI về các vấn đề sức khỏe
- Tích hợp Google Gemini AI
- Hỏi về chế độ ăn, tập luyện, giấc ngủ...

### 📋 Medical History (Lịch sử bệnh lý)
- Lưu trữ các lần khám bệnh, tiêm phòng
- Ghi chú về triệu chứng, đơn thuốc
- Phân loại theo loại: khám sức khỏe, tiêm phòng, triệu chứng, phẫu thuật...

### 📰 Medical News
- Xem tin tức y tế mới nhất từ NewsAPI
- Cập nhật thông tin về sức khỏe và công nghệ y khoa

### 👤 Profile & Settings
- Cập nhật thông tin cá nhân: họ tên, tuổi, giới tính, nhóm máu, chiều cao, cân nặng
- Đổi mật khẩu
- Chuyển đổi theme (Light/Dark mode)
- Chuyển đổi ngôn ngữ (Tiếng Việt/English)

## 🚀 Cách chạy dự án

### Yêu cầu hệ thống
- Java 21 (hoặc Java 17+)
- Node.js 16+ và npm
- PostgreSQL (hoặc dùng Neon - cloud database miễn phí)
- Maven (để build backend)

### Cách 1: Chạy bằng Docker (Dễ nhất)
```bash
# Clone repo về
git clone https://github.com/jimmi69-falton/health-manager-webapp.git
cd health-manager-webapp

# Chạy script start (sẽ tự động build và chạy)
./start.sh
```

Sau đó mở browser vào:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Cách 2: Chạy thủ công 

**Bước 1: Setup Database**
- Tạo tài khoản Neon (hoặc PostgreSQL local)
- Copy thông tin connection string vào `backend/src/main/resources/application.properties`

**Bước 2: Chạy Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy ở http://localhost:8080

**Bước 3: Chạy Frontend** (mở terminal mới)
```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy ở http://localhost:3000

### Tài khoản demo
- **Email:** admin@company.com
- **Password:** admin123

## 🛠️ Tech Stack

### Frontend
- **React 18** - Framework UI chính
- **Tailwind CSS** - Styling (rất tiện, không cần viết CSS nhiều)
- **React Router** - Điều hướng trang
- **React Query** - Quản lý data fetching và cache (giúp code gọn hơn)
- **Axios** - Gọi API
- **Framer Motion** - Animation mượt mà
- **React Hook Form** - Xử lý form dễ dàng
- **Heroicons** - Icon đẹp, miễn phí

### Backend
- **Java 21** - Ngôn ngữ lập trình
- **Spring Boot 3.5.7** - Framework chính (rất mạnh, nhiều tính năng sẵn)
- **Spring Data JPA** - Làm việc với database dễ dàng
- **Spring Security** - Bảo mật (JWT authentication)
- **PostgreSQL** - Database (dùng Neon - free tier)
- **Maven** - Build tool

### AI & External Services
- **Google Gemini API** - AI chatbot (có free tier)
- **NewsAPI** - Lấy tin tức y tế (có free tier)
- **WebFlux** - Gọi API bất đồng bộ (reactive)

## 📁 Cấu trúc dự án

```
health-manager-webapp/
├── backend/                          # Phần backend (Spring Boot)
│   ├── src/main/java/com/hrmanagement/
│   │   ├── controller/              # API endpoints
│   │   │   ├── AuthController.java
│   │   │   ├── HealthController.java
│   │   │   ├── AIController.java
│   │   │   └── ...
│   │   ├── service/                 # Business logic
│   │   │   ├── AuthService.java
│   │   │   ├── HealthService.java
│   │   │   ├── AIService.java
│   │   │   └── ...
│   │   ├── model/                   # Entity/Database models
│   │   │   ├── User.java
│   │   │   ├── Reminder.java
│   │   │   ├── WorkoutSession.java
│   │   │   └── ...
│   │   ├── repository/             # Database queries
│   │   └── security/                # JWT, Security config
│   └── src/main/resources/
│       ├── application.properties   # Config database, API keys
│       └── data.sql                 # Seed data (tạo user demo)
│
├── frontend/                         # Phần frontend (React)
│   ├── src/
│   │   ├── pages/                   # Các trang chính
│   │   │   ├── Dashboard/
│   │   │   ├── Fitness/
│   │   │   ├── Reminder/
│   │   │   ├── AI/
│   │   │   └── ...
│   │   ├── components/             # Components tái sử dụng
│   │   │   ├── Layout/             # Sidebar, Topbar
│   │   │   ├── Health/             # StatCard, Charts
│   │   │   └── UI/                 # Button, Card, Modal
│   │   ├── contexts/               # React Context (Auth, Theme, Language)
│   │   ├── utils/                  # Helper functions
│   │   └── api.js                  # Axios instance
│   └── package.json
│
└── docker-compose.yml               # Docker config (nếu dùng Docker)
```

## 🔑 Cấu hình quan trọng

### Backend (`application.properties`)
Cần cấu hình các thông tin sau:
```properties
# Database (PostgreSQL - Neon)
spring.datasource.url=jdbc:postgresql://your-neon-url
spring.datasource.username=your-username
spring.datasource.password=your-password

# JWT Secret (tự đặt một chuỗi bí mật)
jwt.secret=your-secret-key-here

# Gemini AI API Key (lấy từ Google AI Studio)
gemini.api.key=your-gemini-api-key

# NewsAPI Key (lấy từ newsapi.org)
newsapi.key=your-newsapi-key
```

### Frontend
Tạo file `.env` trong thư mục `frontend/`:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## 📝 API Endpoints chính

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Health & Reminders
- `GET /api/health/metrics/dashboard` - Lấy chỉ số sức khỏe
- `GET /api/health/reminders/today` - Nhắc nhở hôm nay
- `POST /api/health/reminders` - Tạo nhắc nhở mới
- `PUT /api/health/reminders/{id}` - Cập nhật nhắc nhở
- `DELETE /api/health/reminders/{id}` - Xóa nhắc nhở

### Fitness
- `GET /api/health/workouts/library` - Lấy thư viện bài tập
- `GET /api/health/workouts` - Lấy bài tập của user
- `GET /api/health/workouts/dashboard` - Thống kê tập luyện
- `POST /api/health/workouts` - Tạo bài tập mới
- `PUT /api/health/workouts/{id}/complete` - Đánh dấu hoàn thành

### AI Chatbot
- `POST /api/ai/chat` - Chat với AI

### Medical History
- `GET /api/health/medical-history` - Lấy lịch sử bệnh lý
- `POST /api/health/medical-history` - Thêm lịch sử mới
- `PUT /api/health/medical-history/{id}` - Cập nhật
- `DELETE /api/health/medical-history/{id}` - Xóa

### News
- `GET /api/news?limit=10` - Lấy tin tức y tế

## 🎨 Giao diện

App có 2 theme: Light và Dark mode, có thể chuyển đổi dễ dàng. Màu sắc chủ đạo là xanh dương (medical blue) và xanh lá (health green), tạo cảm giác tin cậy và chuyên nghiệp.

## 🐛 Lưu ý khi phát triển

1. **Database:** Nếu dùng Neon, nhớ check connection string đúng format
2. **CORS:** Backend đã config CORS cho localhost:3000, nếu đổi port thì sửa trong `SecurityConfig.java`
3. **API Keys:** Nhớ thêm vào `.gitignore` để không commit lên GitHub
4. **JWT Secret:** Đổi thành chuỗi bí mật của bạn, đừng dùng mặc định
5. **Port conflicts:** Nếu port 8080 hoặc 3000 bị chiếm, đổi trong config

## 📚 Tài liệu tham khảo

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini AI](https://ai.google.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)

## 🤝 Đóng góp

Đây là dự án học tập nên mình rất vui nếu các bạn góp ý hoặc cải thiện code. Nếu thấy bug hoặc có ý tưởng mới, cứ tạo issue hoặc pull request nhé!

## 📄 License

Dự án này được làm cho mục đích học tập. Các bạn có thể tự do sử dụng và chỉnh sửa.

---

**Made with ❤️ by PTIT Students, for students**

*P.S: Nếu gặp lỗi khi chạy, check lại config database và API keys nhé!*

