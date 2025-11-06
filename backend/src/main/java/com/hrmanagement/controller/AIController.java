package com.hrmanagement.controller;

import com.hrmanagement.model.AIRequest;
import com.hrmanagement.model.AIResponse;
import com.hrmanagement.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")  // ✅ Đặt chuẩn REST (phù hợp frontend)
@CrossOrigin(origins = "*") // Cho phép frontend gọi từ localhost:3000
public class AIController {

    @Autowired
    private AIService aiService;

    /**
     * Endpoint chính để chat với AI Gemini
     * Frontend gọi: POST http://localhost:8080/api/ai/chat
     * Body: { "message": "Tôi nên tập cardio bao lâu mỗi ngày?" }
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chatWithAI(@RequestBody AIRequest request) {
        try {
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
            }

            // ✅ Gọi service để gửi request đến Gemini
            AIResponse response = aiService.getGeminiReply(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process AI request: " + e.getMessage()));
        }
    }

    /**
     * Endpoint gợi ý các chủ đề để người dùng hỏi AI
     * Frontend có thể dùng để hiển thị quick suggestion buttons
     */
    @GetMapping("/suggestions")
    public ResponseEntity<?> getHealthSuggestions() {
        String suggestions = """
                Tôi có thể giúp bạn với các câu hỏi về:
                
                🩺 **Sức khỏe tổng quát**
                - Theo dõi huyết áp, nhịp tim
                - Quản lý cân nặng
                - Kiểm tra sức khỏe định kỳ
                
                💪 **Tập luyện và vận động**
                - Bài tập cardio
                - Strength training
                - Yoga và stretching
                - Lịch tập phù hợp
                
                🥗 **Dinh dưỡng**
                - Chế độ ăn lành mạnh
                - Thực phẩm tốt cho tim mạch
                - Kiểm soát cân nặng
                - Uống nước đúng cách
                
                😴 **Giấc ngủ và nghỉ ngơi**
                - Cải thiện chất lượng giấc ngủ
                - Quản lý stress
                - Meditation & thư giãn
                """;
        return ResponseEntity.ok(Map.of("suggestions", suggestions));
    }

    /**
     * Endpoint kiểm tra xem AI service đang hoạt động không
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "AI service is running ✅",
                "service", "Gemini Health Assistant"
        ));
    }
}
