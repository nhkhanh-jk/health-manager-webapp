# 📚 Hướng dẫn chi tiết: Cấu hình DATABASE_URL trên Render

## 🎯 Tổng quan

Sau khi code đã được cập nhật, bạn **chỉ cần set `DATABASE_URL`** trong Render Dashboard. Code sẽ tự động parse và convert sang JDBC format. 

**Không cần set** `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` nữa!

---

## 📋 Bước 1: Tạo PostgreSQL Database trên Render

### 1.1. Truy cập Render Dashboard
- Vào https://dashboard.render.com
- Đăng nhập vào tài khoản của bạn

### 1.2. Tạo PostgreSQL Database
1. Click nút **"New +"** ở góc trên bên phải
2. Chọn **"PostgreSQL"**
3. Điền thông tin:
   - **Name:** `health-manager-db` (hoặc tên bạn muốn)
   - **Database:** `healthmanager` (hoặc để mặc định)
   - **Region:** Chọn region gần bạn nhất (ví dụ: Singapore, Oregon)
   - **PostgreSQL Version:** Chọn version mới nhất
   - **Plan:** Chọn **Free** (hoặc Starter nếu cần)
4. Click **"Create Database"**

### 1.3. Lấy DATABASE_URL
Sau khi database được tạo thành công:

1. Vào trang **Info** của database service
2. Tìm phần **"Connections"** hoặc **"Internal Database URL"**
3. Bạn sẽ thấy một URL có dạng:
   ```
   postgresql://username:password@hostname:5432/database_name
   ```
   Ví dụ:
   ```
   postgresql://healthmanager_user:abc123xyz@dpg-xxxxx-a.singapore-postgres.render.com:5432/healthmanager_xxxx
   ```

4. **Copy toàn bộ URL này** - đây chính là `DATABASE_URL` bạn cần!

---

## 🚀 Bước 2: Deploy Backend Service

### 2.1. Tạo Web Service
1. Trong Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect repository GitHub của bạn
3. Chọn repository `health-manager-webapp`
4. Click **"Connect"**

### 2.2. Cấu hình Basic Settings
Điền các thông tin sau:

- **Name:** `health-manager-backend`
- **Environment:** `Java`
- **Region:** Chọn cùng region với database (để giảm latency)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Build Command:** `mvn clean package -DskipTests`
- **Start Command:** `java -jar target/hm-backend-0.0.1-SNAPSHOT.jar`

### 2.3. Cấu hình Environment Variables

Scroll xuống phần **"Environment Variables"** và thêm các biến sau:

#### ✅ Bắt buộc phải có:

1. **DATABASE_URL**
   - **Key:** `DATABASE_URL`
   - **Value:** Paste URL bạn đã copy từ PostgreSQL service (bước 1.3)
   - **Ví dụ:** `postgresql://healthmanager_user:abc123xyz@dpg-xxxxx-a.singapore-postgres.render.com:5432/healthmanager_xxxx`
   - ⚠️ **QUAN TRỌNG:** Đây là biến duy nhất bạn cần để kết nối database!

2. **SPRING_PROFILES_ACTIVE**
   - **Key:** `SPRING_PROFILES_ACTIVE`
   - **Value:** `production`

3. **SERVER_PORT**
   - **Key:** `SERVER_PORT`
   - **Value:** `10000`
   - ⚠️ Render yêu cầu port 10000 cho free tier

4. **JWT_SECRET**
   - **Key:** `JWT_SECRET`
   - **Value:** Tạo một chuỗi bí mật dài và ngẫu nhiên
   - **Ví dụ:** `my-super-secret-jwt-key-12345-abcdef-67890-xyz`
   - 💡 **Tip:** Có thể dùng online generator: https://randomkeygen.com/

5. **GEMINI_API_KEY**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** API key từ Google AI Studio
   - 💡 Lấy tại: https://aistudio.google.com/app/apikey

6. **NEWSAPI_KEY**
   - **Key:** `NEWSAPI_KEY`
   - **Value:** API key từ NewsAPI
   - 💡 Lấy tại: https://newsapi.org/register

7. **CORS_ALLOWED_ORIGINS**
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** URL frontend từ Vercel (cập nhật sau khi deploy frontend)
   - **Ví dụ:** `https://your-app.vercel.app`
   - ⚠️ Tạm thời có thể để: `http://localhost:3000` để test

#### ❌ KHÔNG CẦN SET (Code tự động parse từ DATABASE_URL):

- ~~`SPRING_DATASOURCE_URL`~~ - Không cần!
- ~~`SPRING_DATASOURCE_USERNAME`~~ - Không cần!
- ~~`SPRING_DATASOURCE_PASSWORD`~~ - Không cần!

---

## 📸 Hình ảnh minh họa (mô tả)

### Trong PostgreSQL Service:
```
┌─────────────────────────────────────────┐
│ PostgreSQL: health-manager-db           │
├─────────────────────────────────────────┤
│                                         │
│ Connections:                            │
│ ┌───────────────────────────────────┐ │
│ │ Internal Database URL:            │ │
│ │ postgresql://user:pass@host:5432/db│ │
│ │ [Copy]                             │ │
│ └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Trong Web Service Environment Variables:
```
┌─────────────────────────────────────────┐
│ Environment Variables                  │
├─────────────────────────────────────────┤
│ Key              │ Value               │
├──────────────────┼─────────────────────┤
│ DATABASE_URL     │ postgresql://...    │ ← Chỉ cần cái này!
│ SPRING_PROFILES_ │ production          │
│ SERVER_PORT      │ 10000               │
│ JWT_SECRET       │ your-secret-key     │
│ GEMINI_API_KEY   │ your-gemini-key     │
│ NEWSAPI_KEY      │ your-newsapi-key    │
│ CORS_ALLOWED_... │ https://...         │
└─────────────────────────────────────────┘
```

---

## ✅ Bước 3: Deploy và Kiểm tra

1. Sau khi điền đầy đủ Environment Variables, scroll xuống dưới
2. Click **"Create Web Service"**
3. Render sẽ bắt đầu build và deploy
4. Chờ khoảng 5-10 phút để build xong
5. Kiểm tra logs để xem có lỗi không

### Kiểm tra Logs:

Trong phần **"Logs"** của service, bạn sẽ thấy:
```
Parsed DATABASE_URL from Render format to JDBC format
JDBC URL: jdbc:postgresql://host:5432/database
```

Nếu thấy dòng này, nghĩa là code đã parse DATABASE_URL thành công! ✅

---

## 🔍 Troubleshooting

### Lỗi: "Driver org.postgresql.Driver claims to not accept jdbcUrl"

**Nguyên nhân:** Bạn đang set `SPRING_DATASOURCE_URL` với Internal Database URL từ Render (format `postgresql://...`)

**Giải pháp:**
1. Xóa các biến: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
2. Chỉ giữ lại `DATABASE_URL` với giá trị từ PostgreSQL service
3. Redeploy service

### Lỗi: "Failed to parse DATABASE_URL"

**Nguyên nhân:** DATABASE_URL không đúng format

**Giải pháp:**
- Đảm bảo DATABASE_URL bắt đầu bằng `postgresql://`
- Copy chính xác từ PostgreSQL service (không thêm/bớt ký tự)
- Không dùng External Database URL, chỉ dùng Internal Database URL

### Database connection timeout

**Nguyên nhân:** Database và Web Service ở khác region

**Giải pháp:**
- Đảm bảo cả database và web service cùng region
- Hoặc dùng Internal Database URL (không dùng External URL)

---

## 🎉 Hoàn thành!

Sau khi deploy thành công:

1. ✅ Backend sẽ tự động parse `DATABASE_URL` và kết nối database
2. ✅ Không cần phải parse URL thủ công nữa
3. ✅ Code sẽ tự động extract username, password từ URL

**Lưu ý:** 
- Render free tier sẽ sleep sau 15 phút không có traffic
- Lần đầu wake up có thể mất vài giây
- Database free tier có giới hạn 90MB

---

## 📝 Checklist cuối cùng

Trước khi deploy, đảm bảo bạn đã:

- [ ] Tạo PostgreSQL database trên Render
- [ ] Copy Internal Database URL từ PostgreSQL service
- [ ] Tạo Web Service với Environment Variables:
  - [ ] `DATABASE_URL` (từ PostgreSQL service)
  - [ ] `SPRING_PROFILES_ACTIVE=production`
  - [ ] `SERVER_PORT=10000`
  - [ ] `JWT_SECRET` (chuỗi bí mật)
  - [ ] `GEMINI_API_KEY`
  - [ ] `NEWSAPI_KEY`
  - [ ] `CORS_ALLOWED_ORIGINS` (tạm thời: `http://localhost:3000`)
- [ ] **KHÔNG** set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- [ ] Deploy và kiểm tra logs

Chúc bạn deploy thành công! 🚀

