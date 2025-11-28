# 🚀 Hướng dẫn Deploy Health Manager

Hướng dẫn chi tiết để deploy ứng dụng Health Manager lên **Vercel** (Frontend) và **Render** (Backend).

---

## 📋 Yêu cầu trước khi deploy

- ✅ Tài khoản GitHub (code đã được push lên repo)
- ✅ Tài khoản Vercel (đăng ký tại [vercel.com](https://vercel.com))
- ✅ Tài khoản Render (đăng ký tại [render.com](https://render.com))
- ✅ Database PostgreSQL (có thể dùng Neon hoặc Render PostgreSQL)

---

## 🎨 BƯỚC 1: Deploy Frontend lên Vercel

### 1.1. Chuẩn bị

1. Đảm bảo code đã được push lên GitHub
2. File `vercel.json` đã có trong thư mục `frontend/`

### 1.2. Deploy trên Vercel

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import repository từ GitHub (chọn repo của bạn)
4. Cấu hình project:
   - **Framework Preset:** Other (hoặc Create React App)
   - **Root Directory:** `frontend` (quan trọng!)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   - Thêm biến: `REACT_APP_API_URL`
   - Giá trị: `https://your-backend-url.onrender.com/api` 
   - ⚠️ **Lưu ý:** Bạn sẽ cần cập nhật lại sau khi deploy backend xong

6. Click **"Deploy"**

### 1.3. Lấy Frontend URL

Sau khi deploy xong, Vercel sẽ cung cấp URL như:
```
https://health-manager-frontend.vercel.app
```

**Lưu lại URL này** để dùng cho bước deploy backend!

---

## ⚙️ BƯỚC 2: Deploy Backend lên Render

### 2.1. Tạo PostgreSQL Database trên Render

1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Cấu hình:
   - **Name:** `health-manager-db` (hoặc tên bạn muốn)
   - **Database:** `neondb` (hoặc tên bạn muốn)
   - **User:** (để mặc định hoặc tự đặt)
   - **Region:** Chọn region gần bạn (ví dụ: Singapore)
   - **PostgreSQL Version:** 17 (hoặc mới nhất)
   - **Plan:** Free

4. Click **"Create Database"**
5. Đợi database khởi động (khoảng 1-2 phút)
6. Vào **"Info"** tab và copy:
   - **Internal Database URL** (dùng cho backend)
   - Format: `postgresql://user:password@host:port/database`

### 2.2. Deploy Backend Web Service

#### Cách 1: Sử dụng Render Dashboard (Khuyến nghị)

1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect repository từ GitHub
4. Cấu hình service:

   **Basic Settings:**
   - **Name:** `health-manager-backend`
   - **Environment:** `Java`
   - **Region:** Chọn cùng region với database
   - **Branch:** `main` (hoặc branch bạn muốn deploy)
   - **Root Directory:** `backend`

   **Build & Deploy:**
   - **Build Command:** 
     ```bash
     ./mvnw clean package -DskipTests
     ```
     (Nếu không có mvnw, dùng: `mvn clean package -DskipTests`)
   
   - **Start Command:**
     ```bash
     java -jar target/hm-backend-0.0.1-SNAPSHOT.jar
     ```

5. **Environment Variables** - Copy và paste các biến sau:

   ```bash
   SPRING_PROFILES_ACTIVE=production
   SERVER_PORT=10000
   SPRING_DATASOURCE_URL=jdbc:postgresql://ep-solitary-pond-ad5rpe7o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   SPRING_DATASOURCE_USERNAME=neondb_owner
   SPRING_DATASOURCE_PASSWORD=npg_nfQW3FEG6AbN
   JWT_SECRET=day-la-mot-chuoi-bi-mat-rat-dai-va-an-toan-cho-hs512-ban-co-the-them-so-12345-va-ky-tu-dac-biet
   GEMINI_API_KEY=AIzaSyBIU4ImVkMZDkSbYnzJICD01QtNnZJUoH8
   NEWSAPI_KEY=21e76d50f5d241c692d854558ba463d0
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```
   
   ⚠️ **Lưu ý:** Sau khi deploy frontend trên Vercel, cập nhật `CORS_ALLOWED_ORIGINS` với URL frontend thực tế.

6. Click **"Create Web Service"**

#### Cách 2: Sử dụng render.yaml (Blueprints)

1. File `render.yaml` đã có trong thư mục `backend/`
2. Truy cập [Render Dashboard](https://dashboard.render.com)
3. Click **"New +"** → **"Blueprint"**
4. Connect repository và chọn file `render.yaml`
5. Render sẽ tự động detect cấu hình
6. Điền các Environment Variables như trên
7. Click **"Apply"**

### 2.3. Lấy Backend URL

Sau khi deploy xong, Render sẽ cung cấp URL như:
```
https://health-manager-backend.onrender.com
```

**Lưu lại URL này!**

---

## 🔄 BƯỚC 3: Cập nhật CORS và API URL

### 3.1. Cập nhật Backend CORS

1. Vào Render Dashboard → Service `health-manager-backend`
2. Vào tab **"Environment"**
3. Tìm biến `CORS_ALLOWED_ORIGINS`
4. Cập nhật giá trị thành Frontend URL từ Vercel:
   ```
   https://health-manager-frontend.vercel.app
   ```
5. Click **"Save Changes"** → Render sẽ tự động redeploy

### 3.2. Cập nhật Frontend API URL

1. Vào Vercel Dashboard → Project của bạn
2. Vào tab **"Settings"** → **"Environment Variables"**
3. Tìm biến `REACT_APP_API_URL`
4. Cập nhật giá trị thành Backend URL từ Render:
   ```
   https://health-manager-backend.onrender.com/api
   ```
5. Vào tab **"Deployments"** → Click **"Redeploy"** → **"Redeploy"**

---

## ✅ BƯỚC 4: Kiểm tra và Test

### 4.1. Kiểm tra Backend

1. Mở browser và truy cập: `https://your-backend-url.onrender.com/api/news?pageSize=1`
2. Nếu thấy JSON response → Backend đã hoạt động ✅

### 4.2. Kiểm tra Frontend

1. Mở browser và truy cập Frontend URL từ Vercel
2. Thử đăng ký/đăng nhập
3. Kiểm tra các tính năng chính

### 4.3. Kiểm tra Database

1. Vào Render Dashboard → Database của bạn
2. Vào tab **"Connect"** → **"psql"**
3. Chạy query để kiểm tra:
   ```sql
   SELECT COUNT(*) FROM users;
   ```

---

## 🔐 Environment Variables Checklist

### ✅ Backend (Render) - Cần thiết:

| Variable | Giá trị mẫu | Mô tả |
|----------|-------------|-------|
| `SPRING_PROFILES_ACTIVE` | `production` | Profile Spring Boot |
| `SERVER_PORT` | `10000` | Port cho Render (bắt buộc) |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://...` | Database URL từ Render |
| `SPRING_DATASOURCE_USERNAME` | `user` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `password` | Database password |
| `JWT_SECRET` | `long-secret-key...` | Secret key cho JWT |
| `GEMINI_API_KEY` | `AIzaSy...` | API key từ Google AI Studio |
| `NEWSAPI_KEY` | `21e76d50...` | API key từ NewsAPI |
| `CORS_ALLOWED_ORIGINS` | `https://...vercel.app` | Frontend URL từ Vercel |

### ✅ Frontend (Vercel) - Cần thiết:

| Variable | Giá trị mẫu | Mô tả |
|----------|-------------|-------|
| `REACT_APP_API_URL` | `https://...onrender.com/api` | Backend URL từ Render |

---

## 🐛 Troubleshooting

### ❌ Backend không start được

**Lỗi:** Port không đúng
- ✅ Đảm bảo `SERVER_PORT=10000` (Render yêu cầu port này)

**Lỗi:** Database connection failed
- ✅ Kiểm tra `SPRING_DATASOURCE_URL` (dùng Internal URL, không dùng External)
- ✅ Kiểm tra username và password
- ✅ Đảm bảo database đã được tạo và running

**Lỗi:** Build failed
- ✅ Kiểm tra logs trong Render Dashboard
- ✅ Đảm bảo Java 21 được cài đặt (Render tự động detect)
- ✅ Kiểm tra `pom.xml` có đúng không

### ❌ Frontend không kết nối được Backend

**Lỗi:** CORS error
- ✅ Kiểm tra `CORS_ALLOWED_ORIGINS` trong backend có đúng Frontend URL không
- ✅ Đảm bảo không có trailing slash (`/`) ở cuối URL

**Lỗi:** 404 Not Found
- ✅ Kiểm tra `REACT_APP_API_URL` có đúng không
- ✅ Đảm bảo có `/api` ở cuối URL

**Lỗi:** Network error
- ✅ Kiểm tra backend đã start chưa (Render free tier có thể sleep)
- ✅ Kiểm tra network tab trong browser console

### ❌ Database issues

**Lỗi:** Table không tồn tại
- ✅ Kiểm tra `spring.jpa.hibernate.ddl-auto=update` trong config
- ✅ Kiểm tra logs để xem có lỗi migration không

---

## 📝 Lưu ý quan trọng

### Render Free Tier:
- ⚠️ Service sẽ **sleep sau 15 phút** không có traffic
- ⚠️ Lần đầu wake up có thể mất 30-60 giây
- ⚠️ Database free tier có giới hạn **90MB**
- ⚠️ Build time có thể lâu (5-10 phút)

### Vercel Free Tier:
- ✅ Không có sleep (luôn sẵn sàng)
- ✅ Bandwidth có giới hạn nhưng đủ cho project nhỏ
- ✅ Build time nhanh (1-2 phút)

### Security:
- 🔒 **KHÔNG** commit API keys lên GitHub
- 🔒 Sử dụng Environment Variables trong Vercel/Render
- 🔒 Đổi JWT_SECRET thành chuỗi bí mật của bạn
- 🔒 Cập nhật CORS để chỉ cho phép domain của bạn

---

## 🎉 Sau khi deploy thành công

1. ✅ Test đăng ký/đăng nhập
2. ✅ Test các tính năng chính (Dashboard, Fitness, Reminders, etc.)
3. ✅ Kiểm tra logs nếu có lỗi
4. ✅ Cập nhật README với production URLs
5. ✅ Share link với bạn bè! 🚀

---

## 📚 Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Spring Boot Production Ready](https://spring.io/guides/gs/production-ready/)

Chúc bạn deploy thành công! 🎊

