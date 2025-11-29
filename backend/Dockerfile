FROM eclipse-temurin:21-jdk-jammy

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build application
RUN mvn clean package -DskipTests

# Create uploads directory
RUN mkdir -p uploads/documents

# Expose port
EXPOSE 8080

# Run application
CMD ["java", "-jar", "target/hm-backend-0.0.1-SNAPSHOT.jar"]

