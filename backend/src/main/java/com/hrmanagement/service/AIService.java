package com.hrmanagement.service;

import com.hrmanagement.model.AIRequest;
import com.hrmanagement.model.AIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIResponse getGeminiReply(AIRequest request) {
        try {
            // ✅ Body đúng chuẩn Gemini
            Map<String, Object> body = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", request.getMessage())
                    ))
                )
            );

            // ✅ Header chuẩn
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // ✅ Gửi request đến Gemini API
            ResponseEntity<Map> response = restTemplate.postForEntity(
                apiUrl + "?key=" + apiKey,   // <-- đúng cách xác thực
                entity,
                Map.class
            );

            // ✅ Xử lý phản hồi
            var candidates = (List<?>) response.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return new AIResponse("⚠️ Không nhận được phản hồi từ Gemini API.");
            }

            var content = (Map<?, ?>) ((Map<?, ?>) candidates.get(0)).get("content");
            var parts = (List<?>) content.get("parts");
            String reply = (String) ((Map<?, ?>) parts.get(0)).get("text");

            return new AIResponse(reply);

        } catch (Exception e) {
            e.printStackTrace();
            return new AIResponse("⚠️ Lỗi khi gọi Gemini API hoặc xử lý phản hồi: " + e.getMessage());
        }
    }
}
