# ⚡ Quick Deploy Guide

## 🎯 Deploy Frontend (Vercel) - 5 phút

1. **Push code lên GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Vào Vercel Dashboard**
   - Truy cập: https://vercel.com/dashboard
   - Click "Add New Project"
   - Import repo từ GitHub

3. **Cấu hình:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Cập nhật sau khi deploy backend)

5. **Deploy!** → Lấy Frontend URL

---

## ⚙️ Deploy Backend (Render) - 10 phút

### Bước 1: Lấy thông tin Database

**Nếu dùng Neon PostgreSQL (Database cũ):**
- JDBC URL: `jdbc:postgresql://ep-solitary-pond-ad5rpe7o-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
- Username: `neondb_owner`
- Password: `npg_nfQW3FEG6AbN` (hoặc password hiện tại)

**Nếu dùng Render PostgreSQL (Database mới):**
- Tạo PostgreSQL trên Render → Copy Internal Database URL
- Convert sang JDBC: Thay `postgresql://` → `jdbc:postgresql://`
- Extract username và password từ Internal URL

### Bước 2: Deploy Web Service
1. Render Dashboard → "New +" → "Web Service"
2. Connect GitHub repo
3. Cấu hình:
   - **Name:** `health-manager-backend`
   - **Environment:** `Java`
   - **Root Directory:** `backend`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/hm-backend-0.0.1-SNAPSHOT.jar`

4. **Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/dbname?sslmode=require
   SPRING_DATASOURCE_USERNAME=username
   SPRING_DATASOURCE_PASSWORD=password
   SPRING_PROFILES_ACTIVE=production
   SERVER_PORT=10000
   JWT_SECRET=<tạo chuỗi bí mật dài>
   GEMINI_API_KEY=AIzaSyBIU4ImVkMZDkSbYnzJICD01QtNnZJUoH8
   NEWSAPI_KEY=21e76d50f5d241c692d854558ba463d0
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   
   ⚠️ **Quan trọng:** Dùng JDBC URL format (`jdbc:postgresql://...`)
   📚 Xem hướng dẫn chi tiết: `RENDER-SETUP-GUIDE.md`

5. **Deploy!** → Lấy Backend URL

---

## 🔄 Cập nhật URLs

1. **Backend:** Cập nhật `CORS_ALLOWED_ORIGINS` = Frontend URL
2. **Frontend:** Cập nhật `REACT_APP_API_URL` = Backend URL + `/api`
3. **Redeploy cả 2**

---

## ✅ Test

- Frontend: https://your-app.vercel.app
- Backend API: https://your-backend.onrender.com/api/news?pageSize=1

Done! 🎉

