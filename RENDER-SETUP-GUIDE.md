# 🚀 Hướng dẫn Deploy Backend lên Render (Dùng SPRING_DATASOURCE_URL)

Hướng dẫn chi tiết cách deploy backend lên Render sử dụng `SPRING_DATASOURCE_URL` với JDBC URL format.

---

## 📋 Bước 1: Lấy thông tin Database

### Nếu dùng Neon PostgreSQL (Database cũ):

1. Vào https://console.neon.tech
2. Chọn project → Database → Connection Details
3. Copy **Connection string** hoặc lấy thông tin:
   - **Host:** `ep-solitary-pond-ad5rpe7o-pooler.c-2.us-east-1.aws.neon.tech`
   - **Database:** `neondb`
   - **Username:** `neondb_owner`
   - **Password:** `npg_nfQW3FEG6AbN` (hoặc password hiện tại của bạn)
   - **Port:** `5432` (mặc định)

4. Tạo JDBC URL:
   ```
   jdbc:postgresql://ep-solitary-pond-ad5rpe7o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Nếu dùng Render PostgreSQL (Database mới):

1. Vào Render Dashboard → PostgreSQL service
2. Vào tab **"Info"** hoặc **"Connections"**
3. Copy **Internal Database URL** (có dạng `postgresql://user:pass@host:5432/dbname`)
4. Convert sang JDBC format:
   - Thay `postgresql://` → `jdbc:postgresql://`
   - Giữ nguyên phần còn lại
   - Thêm `?sslmode=require` nếu chưa có
   
   **Ví dụ:**
   - Internal URL: `postgresql://user:pass@dpg-xxxxx-a.singapore-postgres.render.com:5432/dbname`
   - JDBC URL: `jdbc:postgresql://dpg-xxxxx-a.singapore-postgres.render.com:5432/dbname?sslmode=require`

5. Extract username và password từ Internal URL:
   - Username: phần trước `:` trong `user:pass@host`
   - Password: phần sau `:` trong `user:pass@host`

---

## 🚀 Bước 2: Deploy Backend trên Render

### 2.1. Tạo Web Service

1. Truy cập https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect repository GitHub: `health-manager-webapp`
4. Click **"Connect"**

### 2.2. Cấu hình Basic Settings

Điền các thông tin sau:

- **Name:** `health-manager-backend`
- **Environment:** `Java`
- **Region:** Chọn region gần bạn nhất (hoặc cùng region với database)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Build Command:** `mvn clean package -DskipTests`
- **Start Command:** `java -jar target/hm-backend-0.0.1-SNAPSHOT.jar`

### 2.3. Cấu hình Environment Variables

Scroll xuống phần **"Environment Variables"** và thêm các biến sau:

#### ✅ Bắt buộc phải có:

1. **SPRING_DATASOURCE_URL** ⭐
   - **Key:** `SPRING_DATASOURCE_URL`
   - **Value:** JDBC URL từ bước 1
   - **Ví dụ (Neon):** `jdbc:postgresql://ep-solitary-pond-ad5rpe7o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - **Ví dụ (Render):** `jdbc:postgresql://dpg-xxxxx-a.singapore-postgres.render.com:5432/dbname?sslmode=require`

2. **SPRING_DATASOURCE_USERNAME** ⭐
   - **Key:** `SPRING_DATASOURCE_USERNAME`
   - **Value:** Username từ database
   - **Ví dụ (Neon):** `neondb_owner`
   - **Ví dụ (Render):** `user` (từ Internal URL)

3. **SPRING_DATASOURCE_PASSWORD** ⭐
   - **Key:** `SPRING_DATASOURCE_PASSWORD`
   - **Value:** Password từ database
   - **Ví dụ (Neon):** `npg_nfQW3FEG6AbN`
   - **Ví dụ (Render):** `pass` (từ Internal URL)

4. **SPRING_PROFILES_ACTIVE**
   - **Key:** `SPRING_PROFILES_ACTIVE`
   - **Value:** `production`

5. **SERVER_PORT**
   - **Key:** `SERVER_PORT`
   - **Value:** `10000`
   - ⚠️ Render yêu cầu port 10000 cho free tier

6. **JWT_SECRET**
   - **Key:** `JWT_SECRET`
   - **Value:** Tạo một chuỗi bí mật dài và ngẫu nhiên
   - **Ví dụ:** `my-super-secret-jwt-key-12345-abcdef-67890-xyz-2024`
   - 💡 **Tip:** Có thể dùng: https://randomkeygen.com/

7. **GEMINI_API_KEY**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** API key từ Google AI Studio
   - 💡 Lấy tại: https://aistudio.google.com/app/apikey

8. **NEWSAPI_KEY**
   - **Key:** `NEWSAPI_KEY`
   - **Value:** API key từ NewsAPI
   - 💡 Lấy tại: https://newsapi.org/register

9. **CORS_ALLOWED_ORIGINS**
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** URL frontend từ Vercel (cập nhật sau khi deploy frontend)
   - **Tạm thời:** `http://localhost:3000`

#### ❌ KHÔNG CẦN SET:

- ~~`DATABASE_URL`~~ - Không cần nếu đã dùng SPRING_DATASOURCE_URL

---

## 📸 Ví dụ cấu hình trên Render Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│ Key                      │ Value                        │
├──────────────────────────┼──────────────────────────────┤
│ SPRING_DATASOURCE_URL    │ jdbc:postgresql://ep-...    │ ← JDBC URL
│ SPRING_DATASOURCE_USERNAME│ neondb_owner                │ ← Username
│ SPRING_DATASOURCE_PASSWORD│ npg_nfQW3FEG6AbN            │ ← Password
│ SPRING_PROFILES_ACTIVE   │ production                   │
│ SERVER_PORT              │ 10000                        │
│ JWT_SECRET               │ your-secret-key-here         │
│ GEMINI_API_KEY           │ AIzaSyBIU4ImVkMZDkSbYnz...  │
│ NEWSAPI_KEY              │ 21e76d50f5d241c692d8545...  │
│ CORS_ALLOWED_ORIGINS     │ http://localhost:3000        │
└─────────────────────────────────────────────────────────┘
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

**Nếu thành công:**
```
Started HealthManagerApplication in X.XXX seconds
```

**Nếu có lỗi connection:**
```
Failed to initialize JPA EntityManagerFactory
Connection refused
```

### Kiểm tra kết nối Database:

Nếu thấy lỗi connection, kiểm tra:
- ✅ JDBC URL đúng format (`jdbc:postgresql://...`)
- ✅ Username và password đúng
- ✅ Database đang chạy
- ✅ IP của Render có được phép kết nối (nếu dùng Neon, có thể cần whitelist IP)

---

## 🔐 Lưu ý bảo mật

⚠️ **QUAN TRỌNG:**
- Không commit password vào Git
- Sử dụng Environment Variables trên Render
- Nếu password bị lộ, đổi ngay trên database dashboard

---

## 🐛 Troubleshooting

### Lỗi: "Driver org.postgresql.Driver claims to not accept jdbcUrl"

**Nguyên nhân:** URL không đúng format JDBC

**Giải pháp:**
- Đảm bảo URL bắt đầu bằng `jdbc:postgresql://`
- Không dùng Internal Database URL trực tiếp (phải convert sang JDBC format)
- Kiểm tra format: `jdbc:postgresql://host:port/database?sslmode=require`

### Lỗi: "Connection refused" hoặc "Connection timeout"

**Nguyên nhân:** Database không cho phép kết nối từ Render

**Giải pháp (nếu dùng Neon):**
1. Vào Neon Dashboard → Settings → IP Allowlist
2. Thêm IP của Render (hoặc cho phép tất cả: `0.0.0.0/0`)
3. Hoặc kiểm tra xem Neon có yêu cầu IP whitelist không

**Giải pháp (nếu dùng Render PostgreSQL):**
- Đảm bảo dùng **Internal Database URL** (không dùng External URL)
- Database và Web Service phải cùng region

### Lỗi: "Authentication failed"

**Nguyên nhân:** Username hoặc password sai

**Giải pháp:**
1. Kiểm tra lại username và password trên database dashboard
2. Đảm bảo copy chính xác (không có khoảng trắng thừa)
3. Nếu password có ký tự đặc biệt, có thể cần URL encode trong JDBC URL

### Lỗi: "Database does not exist"

**Nguyên nhân:** Tên database sai

**Giải pháp:**
1. Kiểm tra tên database trên database dashboard
2. Đảm bảo tên database trong JDBC URL đúng

---

## 🎉 Hoàn thành!

Sau khi deploy thành công:

- ✅ Backend sẽ kết nối với database của bạn
- ✅ Tất cả dữ liệu hiện có sẽ được giữ nguyên (nếu dùng database cũ)
- ✅ Hoặc database mới sẽ được tự động seed dữ liệu (nếu dùng database mới)

**Lưu ý:** 
- Render free tier sẽ sleep sau 15 phút không có traffic
- Lần đầu wake up có thể mất vài giây
- Database free tier có giới hạn (Neon: 512MB, Render: 90MB)

---

## 📝 Checklist cuối cùng

Trước khi deploy, đảm bảo bạn đã:

- [ ] Lấy JDBC URL từ database (Neon hoặc Render)
- [ ] Extract username và password từ database
- [ ] Tạo Web Service trên Render
- [ ] Set Environment Variables:
  - [ ] `SPRING_DATASOURCE_URL` (JDBC URL format)
  - [ ] `SPRING_DATASOURCE_USERNAME` (username)
  - [ ] `SPRING_DATASOURCE_PASSWORD` (password)
  - [ ] `SPRING_PROFILES_ACTIVE=production`
  - [ ] `SERVER_PORT=10000`
  - [ ] `JWT_SECRET` (chuỗi bí mật)
  - [ ] `GEMINI_API_KEY`
  - [ ] `NEWSAPI_KEY`
  - [ ] `CORS_ALLOWED_ORIGINS` (tạm thời: `http://localhost:3000`)
- [ ] **KHÔNG** set `DATABASE_URL` (chỉ dùng SPRING_DATASOURCE_URL)
- [ ] Deploy và kiểm tra logs
- [ ] Test kết nối database

Chúc bạn deploy thành công! 🚀

