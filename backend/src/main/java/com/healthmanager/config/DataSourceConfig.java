package com.healthmanager.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Configuration class để parse DATABASE_URL từ Render và convert sang JDBC format
 * Render cung cấp DATABASE_URL với format: postgresql://user:password@host:port/dbname
 * Spring Boot cần JDBC format: jdbc:postgresql://host:port/dbname
 */
@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${spring.datasource.url:}")
    private String springDatasourceUrl;

    @PostConstruct
    public void parseDatabaseUrl() {
        // Nếu có DATABASE_URL từ Render (format postgresql://...) và chưa có spring.datasource.url
        if ((databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("jdbc:")) 
            && (springDatasourceUrl == null || springDatasourceUrl.isEmpty())) {
            try {
                URI uri = new URI(databaseUrl);
                
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String dbName = path.startsWith("/") ? path.substring(1) : path;
                
                // Extract user info
                String userInfo = uri.getUserInfo();
                String username = "";
                String password = "";
                
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts.length > 1 ? parts[1] : "";
                } else if (userInfo != null) {
                    username = userInfo;
                }
                
                // Build JDBC URL
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s?sslmode=require", host, port, dbName);
                
                // Set system properties để Spring Boot sử dụng
                System.setProperty("spring.datasource.url", jdbcUrl);
                if (!username.isEmpty()) {
                    System.setProperty("spring.datasource.username", username);
                }
                if (!password.isEmpty()) {
                    System.setProperty("spring.datasource.password", password);
                }
                
                logger.info("Parsed DATABASE_URL from Render format to JDBC format");
                logger.debug("JDBC URL: jdbc:postgresql://{}:{}/{}", host, port, dbName);
            } catch (URISyntaxException e) {
                logger.error("Failed to parse DATABASE_URL: " + databaseUrl, e);
            }
        }
    }
}

