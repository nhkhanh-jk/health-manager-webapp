# 📚 Giải thích về Spring Boot Profiles và application-production.properties

## 🎯 Tại sao có file `application-production.properties`?

Spring Boot sử dụng **Profiles** để quản lý cấu hình cho các môi trường khác nhau (development, production, test).

### Cấu trúc file:

```
backend/src/main/resources/
├── application.properties          # Cấu hình mặc định (development)
└── application-production.properties # Cấu hình cho production
```

---

## 🔄 Cách hoạt động:

### 1. **application.properties** (Development - Local)
- Dùng khi chạy local: `mvn spring-boot:run`
- Có giá trị cứng (hardcoded) cho database, API keys
- Hiển thị SQL queries (`spring.jpa.show-sql=true`)
- Logging level: DEBUG

### 2. **application-production.properties** (Production - Render)
- Chỉ được load khi set: `SPRING_PROFILES_ACTIVE=production`
- Dùng **environment variables** thay vì giá trị cứng
- Không hiển thị SQL queries (`spring.jpa.show-sql=false`)
- Logging level: INFO/WARN (ít log hơn)

---

## 🚀 Khi nào dùng file nào?

### Local Development:
```bash
# Chạy với profile mặc định (development)
mvn spring-boot:run

# Hoặc chỉ định rõ
mvn spring-boot:run -Dspring-boot.run.profiles=default
```

→ Spring Boot sẽ đọc `application.properties`

### Production (Render):
```bash
# Set environment variable trên Render
SPRING_PROFILES_ACTIVE=production

# Spring Boot sẽ tự động load application-production.properties
```

→ Spring Boot sẽ đọc `application-production.properties` và override các giá trị từ `application.properties`

---

## 📋 So sánh 2 file:

| Thuộc tính | application.properties | application-production.properties |
|------------|------------------------|----------------------------------|
| **Database URL** | Hardcoded: `jdbc:postgresql://...` | Environment variable: `${SPRING_DATASOURCE_URL}` |
| **Username/Password** | Hardcoded | Environment variables |
| **JWT Secret** | Hardcoded | `${JWT_SECRET}` |
| **API Keys** | Hardcoded | Environment variables |
| **Show SQL** | `true` (để debug) | `false` (bảo mật) |
| **Logging** | DEBUG (nhiều log) | INFO/WARN (ít log) |

---

## 🔐 Tại sao cần tách riêng?

### 1. **Bảo mật:**
- Production không commit password/API keys vào Git
- Dùng environment variables trên Render Dashboard

### 2. **Linh hoạt:**
- Mỗi môi trường có database/API keys khác nhau
- Không cần sửa code khi deploy

### 3. **Best Practice:**
- Development: Giá trị cứng để dễ test
- Production: Environment variables để bảo mật

---

## 💡 Ví dụ cụ thể:

### Local Development:
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=123456
```

### Production (Render):
```properties
# application-production.properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

Trên Render Dashboard, bạn set:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://production-host:5432/proddb
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=secure_password
```

---

## 🎯 Kết luận:

- **`application.properties`**: Dùng cho local development, có giá trị cứng
- **`application-production.properties`**: Dùng cho production trên Render, đọc từ environment variables
- **`.env.example`**: File tham khảo, không được commit (chứa giá trị mẫu)

**Lưu ý:** Spring Boot không đọc `.env` file trực tiếp. Để dùng `.env`, bạn cần:
- Cài `spring-dotenv` library, hoặc
- Export environment variables trong shell, hoặc
- Dùng IDE extension để load `.env`

---

## 📝 Checklist:

- ✅ `application.properties` - Cấu hình development (có thể commit)
- ✅ `application-production.properties` - Cấu hình production (có thể commit, không có password)
- ✅ `.env.example` - File mẫu (có thể commit)
- ❌ `.env` - File thực tế (KHÔNG commit, đã có trong .gitignore)

