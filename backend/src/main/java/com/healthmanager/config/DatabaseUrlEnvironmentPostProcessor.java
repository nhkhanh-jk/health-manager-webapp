package com.healthmanager.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * EnvironmentPostProcessor để parse DATABASE_URL từ Render trước khi Spring Boot khởi tạo DataSource
 * Render cung cấp DATABASE_URL với format: postgresql://user:password@host:port/dbname
 * Convert sang JDBC format: jdbc:postgresql://host:port/dbname
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        String springDatasourceUrl = environment.getProperty("spring.datasource.url");

        // Nếu có DATABASE_URL từ Render và chưa có spring.datasource.url
        if (databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("jdbc:")) {
            if (springDatasourceUrl == null || springDatasourceUrl.isEmpty()) {
                try {
                    Map<String, Object> properties = parseDatabaseUrl(databaseUrl);
                    
                    // Add properties to environment
                    MapPropertySource propertySource = new MapPropertySource("databaseUrlProperties", properties);
                    environment.getPropertySources().addFirst(propertySource);
                } catch (Exception e) {
                    System.err.println("Failed to parse DATABASE_URL: " + databaseUrl);
                    e.printStackTrace();
                }
            }
        }
    }

    private Map<String, Object> parseDatabaseUrl(String databaseUrl) throws Exception {
        Map<String, Object> properties = new HashMap<>();
        
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
        
        properties.put("spring.datasource.url", jdbcUrl);
        if (!username.isEmpty()) {
            properties.put("spring.datasource.username", username);
        }
        if (!password.isEmpty()) {
            properties.put("spring.datasource.password", password);
        }
        
        System.out.println("Parsed DATABASE_URL from Render format to JDBC format");
        System.out.println("JDBC URL: " + jdbcUrl);
        
        return properties;
    }
}

