package com.hrmanagement.service;

import com.hrmanagement.model.AIRequest;
import com.hrmanagement.model.AIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * AIService chịu trách nhiệm gọi API Gemini và xử lý phản hồi.
 * Dùng RestTemplate (dễ hiểu, ổn định, không cần WebFlux)
 */
@Service
public class AIService {

    // Lấy API key và URL từ application.properties
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    // Dùng RestTemplate để gửi request HTTP
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Gửi tin nhắn người dùng đến Gemini API và nhận phản hồi
     */
    public AIResponse getGeminiReply(AIRequest request) {
        try {
            // 🔹 Tạo body đúng định dạng Gemini yêu cầu
            Map<String, Object> body = Map.of(
                    "contents", new Object[]{
                            Map.of("role", "user", "parts", new Object[]{
                                    Map.of("text", request.getMessage())
                            })
                    }
            );

            // 🔹 Tạo header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 🔹 Gói lại thành entity để gửi
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 🔹 Gửi POST request đến Gemini API
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl + "?key=" + apiKey,
                    entity,
                    Map.class
            );

            // 🔹 Xử lý phản hồi JSON từ Gemini
            var candidates = (List<?>) response.getBody().get("candidates");
            var content = (Map<?, ?>) ((Map<?, ?>) candidates.get(0)).get("content");
            var parts = (List<?>) content.get("parts");
            String reply = (String) ((Map<?, ?>) parts.get(0)).get("text");

            return new AIResponse(reply);

        } catch (Exception e) {
            e.printStackTrace();
            return new AIResponse("⚠️ Lỗi khi gọi Gemini API hoặc xử lý phản hồi.");
        }
    }
}
