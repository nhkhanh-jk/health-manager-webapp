# 💚 Health Manager

> **Ứng dụng quản lý sức khỏe cá nhân thông minh với AI Chatbot**

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-purple)](https://ai.google.dev/)

## ✨ Tính năng chính

### 🎯 **Core Features**
- 🔐 **Authentication** - Đăng nhập đơn giản, an toàn
- 📊 **Dashboard** - Theo dõi chỉ số sức khỏe (huyết áp, nhịp tim, cân nặng)
- 💪 **Fitness Library** - Thư viện bài tập với filter và theo dõi tiến trình
- 🔔 **Smart Reminders** - Lịch nhắc nhở uống thuốc, tập luyện, giấc ngủ
- 🤖 **AI Health Assistant** - Chatbot tư vấn sức khỏe với Gemini AI

### 🎨 **UI/UX Features**
- 🩺 **Medical Design System** - Giao diện y tế chuyên nghiệp
- 🌓 **Light/Dark Mode** - Chuyển đổi theme tùy ý
- 📱 **Responsive Design** - Tối ưu mọi thiết bị
- ⚡ **Smooth Animations** - Framer Motion transitions
- 📈 **Data Visualization** - Biểu đồ sparkline, bar charts, ECG

### 🔧 **Technical Features**
- 🏗️ **Clean Architecture** - Component-based, modular
- 🔒 **Simple Auth** - Demo-friendly security
- 📊 **Real-time Data** - MySQL-backed with React Query
- 🐳 **Docker Ready** - Containerized deployment
- 🎯 **Performance Optimized** - Code splitting, lazy loading

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone và start
git clone <repository-url>
cd health-manager

# Start với Docker
./start.sh
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Tailwind CSS** - Styling với custom design tokens
- **Framer Motion** - Animations
- **React Query** - Data fetching & caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Router** - Navigation
- **Heroicons** - Icon library

### Backend
- **Java 17** - Programming language
- **Spring Boot 3** - Application framework
- **Spring Data JPA** - Data persistence
- **MySQL 8** - Database
- **Maven** - Build tool

### AI & External Services
- **Google Gemini API** - AI health chatbot
- **WebFlux** - Reactive HTTP client

## 📋 Demo Accounts

| Email | Password | Description |
|-------|----------|-------------|
| admin@company.com | admin123 | Demo user |

## 🏥 API Endpoints

### Health Metrics
- `GET /api/health/metrics/dashboard` - Chỉ số hôm nay + lịch sử 7 ngày
- `GET /api/health/reminders/today` - Nhắc nhở hôm nay
- `GET /api/health/reminders/month` - Lịch nhắc nhở tháng
- `POST /api/health/reminders` - Tạo nhắc nhở mới
- `PUT /api/health/reminders/{id}` - Cập nhật nhắc nhở
- `PATCH /api/health/reminders/{id}/toggle` - Bật/tắt
- `DELETE /api/health/reminders/{id}` - Xóa nhắc nhở
- `GET /api/health/fitness/stats` - Thống kê tập luyện
- `POST /api/health/chat` - AI chatbot

## 🎨 Design System

### Color Palette
- **Primary (Medical Blue)**: `#1E88E5`, `#1565C0`, `#2D9CDB`
- **Accent (Health Green)**: `#27AE60`, `#2ECC71`
- **Neutral**: `#F9FAFB`, `#F2F6F9`, `#E8EEF2`
- **Text**: `#1E293B`, `#64748B`, `#94A3B8`
- **Status**: Healthy `#22C55E`, Warning `#FACC15`, Danger `#EF4444`, Info `#3B82F6`

### Components
- Cards với border nhẹ, shadow mềm, bo tròn 12-16px
- Buttons gradient xanh dương → xanh lá
- Inputs clean với focus ring
- Badges status với màu rõ ràng
- Charts sparkline, bar, ECG line

## 📁 Cấu trúc thư mục

```
health-manager/
├── backend/
│   ├── src/main/java/com/hrmanagement/
│   │   ├── controller/        # HealthController
│   │   ├── model/             # Reminder, WorkoutSession, Measurement
│   │   ├── repository/        # JPA Repositories
│   │   └── service/           # HealthService, GeminiAIService
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql           # Seed data
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/        # NewSidebar, Topbar
│   │   │   ├── Health/        # StatCard, Sparkline, BarChart
│   │   │   └── UI/            # Button, Card, Modal, LoadingSpinner
│   │   ├── pages/
│   │   │   ├── Dashboard/     # NewDashboard
│   │   │   ├── Fitness/       # NewFitness
│   │   │   ├── Reminder/      # NewReminder
│   │   │   ├── AI/            # NewChatbot
│   │   │   └── Auth/          # NewLogin
│   │   ├── contexts/          # AuthContext, ThemeContext
│   │   ├── styles/            # tokens.css
│   │   └── index.css          # Global styles
│   └── package.json
└── docker-compose.yml
```

## 🚀 Deployment

```bash
# Build production
cd frontend && npm run build
cd backend && mvn clean package

# Run with Docker
docker-compose up -d
```

## 📞 Support

Health Manager là dự án demo với mục đích học tập. AI chatbot không thay thế tư vấn y tế chuyên môn.

---

**© 2024 Health Manager. Made with ❤️**
