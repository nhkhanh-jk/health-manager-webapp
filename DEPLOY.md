# 🚀 Hướng dẫn Deploy Health Manager

Hướng dẫn deploy ứng dụng Health Manager lên Vercel (Frontend) và Render (Backend).

## 📋 Yêu cầu

- Tài khoản GitHub
- Tài khoản Vercel (miễn phí)
- Tài khoản Render (miễn phí)
- Database PostgreSQL (có thể dùng Neon hoặc Render PostgreSQL)

---

## 🎨 Deploy Frontend lên Vercel

### Bước 1: Chuẩn bị Frontend

1. Đảm bảo code đã được push lên GitHub
2. Kiểm tra file `vercel.json` đã có trong thư mục `frontend/`

### Bước 2: Deploy trên Vercel

1. Truy cập [Vercel](https://vercel.com) và đăng nhập
2. Click **"Add New Project"**
3. Import repository từ GitHub
4. Cấu hình project:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. Thêm Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Thay `your-backend-url` bằng URL backend sau khi deploy)

6. Click **"Deploy"**

### Bước 3: Lấy Frontend URL

Sau khi deploy xong, Vercel sẽ cung cấp URL như: `https://your-app.vercel.app`

---

## ⚙️ Deploy Backend lên Render

### Bước 1: Chuẩn bị Backend

1. Đảm bảo code đã được push lên GitHub
2. Kiểm tra file `render.yaml` đã có trong thư mục `backend/`

### Bước 2: Tạo PostgreSQL Database trên Render (nếu chưa có)

1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Chọn plan **Free**
4. Đặt tên database và chọn region
5. Click **"Create Database"**
6. Lưu lại:
   - **Internal Database URL** (dùng cho backend)
   - **External Database URL** (nếu cần)

### Bước 3: Deploy Backend Service

#### Cách 1: Sử dụng Render Dashboard

1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect repository từ GitHub
4. Cấu hình:
   - **Name:** `health-manager-backend`
   - **Environment:** `Java`
   - **Region:** Chọn region gần bạn nhất
   - **Branch:** `main` (hoặc branch bạn muốn deploy)
   - **Root Directory:** `backend`
   - **Build Command:** `./mvnw clean package -DskipTests` hoặc `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/hm-backend-0.0.1-SNAPSHOT.jar`

5. Thêm Environment Variables:
   ```
   SPRING_PROFILES_ACTIVE=production
   SERVER_PORT=10000
   SPRING_DATASOURCE_URL=<Internal Database URL từ Render PostgreSQL>
   SPRING_DATASOURCE_USERNAME=<username từ database URL>
   SPRING_DATASOURCE_PASSWORD=<password từ database URL>
   JWT_SECRET=<tạo một chuỗi bí mật dài và an toàn>
   GEMINI_API_KEY=<API key từ Google AI Studio>
   NEWSAPI_KEY=<API key từ NewsAPI>
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

6. Click **"Create Web Service"**

#### Cách 2: Sử dụng render.yaml (Blueprints)

1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect repository và chọn file `render.yaml`
4. Render sẽ tự động detect cấu hình
5. Điền các Environment Variables như trên
6. Click **"Apply"**

### Bước 4: Lấy Backend URL

Sau khi deploy xong, Render sẽ cung cấp URL như: `https://health-manager-backend.onrender.com`

---

## 🔄 Cập nhật CORS và API URL

### 1. Cập nhật Backend CORS

Sau khi có Frontend URL từ Vercel, cập nhật Environment Variable trong Render:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

### 2. Cập nhật Frontend API URL

Cập nhật Environment Variable trong Vercel:
```
REACT_APP_API_URL=https://health-manager-backend.onrender.com/api
```

Sau đó redeploy frontend để áp dụng thay đổi.

---

## 🔐 Environment Variables Checklist

### Backend (Render):
- ✅ `SPRING_PROFILES_ACTIVE=production`
- ✅ `SERVER_PORT=10000`
- ✅ `SPRING_DATASOURCE_URL` (từ Render PostgreSQL)
- ✅ `SPRING_DATASOURCE_USERNAME`
- ✅ `SPRING_DATASOURCE_PASSWORD`
- ✅ `JWT_SECRET` (chuỗi bí mật dài)
- ✅ `GEMINI_API_KEY`
- ✅ `NEWSAPI_KEY`
- ✅ `CORS_ALLOWED_ORIGINS` (Frontend URL từ Vercel)

### Frontend (Vercel):
- ✅ `REACT_APP_API_URL` (Backend URL từ Render)

---

## 🐛 Troubleshooting

### Backend không start được:
- Kiểm tra logs trong Render Dashboard
- Đảm bảo `SERVER_PORT=10000` (Render yêu cầu port này)
- Kiểm tra database connection string
- Kiểm tra Java version (cần Java 21)

### Frontend không kết nối được Backend:
- Kiểm tra CORS_ALLOWED_ORIGINS trong backend
- Kiểm tra REACT_APP_API_URL trong frontend
- Kiểm tra network tab trong browser console

### Database connection failed:
- Kiểm tra Internal Database URL (không dùng External URL)
- Kiểm tra username và password
- Đảm bảo database đã được tạo và running

---

## 📝 Notes

- Render free tier sẽ sleep sau 15 phút không có traffic
- Vercel free tier có giới hạn bandwidth nhưng đủ cho project nhỏ
- Database trên Render free tier có giới hạn 90MB
- Nên dùng Neon PostgreSQL nếu cần database lớn hơn

---

## ✅ Sau khi deploy thành công

1. Test đăng ký/đăng nhập
2. Test các tính năng chính
3. Kiểm tra logs nếu có lỗi
4. Cập nhật README với production URLs

Chúc bạn deploy thành công! 🎉

