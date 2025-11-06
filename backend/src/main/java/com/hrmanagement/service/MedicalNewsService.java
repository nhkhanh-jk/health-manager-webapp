package com.hrmanagement.service;

import com.hrmanagement.model.NewsArticle;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;

/**
 * Service chịu trách nhiệm gọi NewsAPI.org và tự động phân loại tin tức
 */
@Service
public class MedicalNewsService {

    private final WebClient webClient;

    public MedicalNewsService(WebClient webClient) {
        this.webClient = webClient;
    }

    @Value("${newsapi.key}")
    private String apiKey;

    /**
     * Lấy danh sách tin tức sức khỏe và phân loại tự động
     */
    public List<NewsArticle> getMedicalNews(String category) {
        try {
            String query = (category == null || category.isEmpty() || category.equals("all"))
                    ? "health OR medical OR fitness OR nutrition OR technology OR vaccine"
                    : category;

            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("newsapi.org")
                            .path("/v2/everything")
                            .queryParam("q", query)
                            .queryParam("language", "en")
                            .queryParam("sortBy", "publishedAt")
                            .queryParam("pageSize", 20)
                            .queryParam("apiKey", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || !response.containsKey("articles")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> articles = (List<Map<String, Object>>) response.get("articles");
            List<NewsArticle> result = new ArrayList<>();

            for (Map<String, Object> article : articles) {
                Map<String, Object> source = (Map<String, Object>) article.get("source");

                String title = Optional.ofNullable((String) article.get("title")).orElse("");
                String description = Optional.ofNullable((String) article.get("description")).orElse("");
                String content = title.toLowerCase() + " " + description.toLowerCase();

                String detectedCategory = detectCategory(content);

                result.add(new NewsArticle(
                        (String) article.get("title"),
                        (String) article.get("description"),
                        (String) article.get("url"),
                        (String) article.get("urlToImage"),
                        source != null ? (String) source.get("name") : "Unknown",
                        (String) article.get("publishedAt"),
                        detectedCategory
                ));
            }

            return result;

        } catch (WebClientResponseException e) {
            System.err.println("❌ Lỗi gọi NewsAPI: " + e.getResponseBodyAsString());
            return Collections.emptyList();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    /**
     * Hàm tự động phân loại tin tức dựa trên từ khóa
     */
    private String detectCategory(String text) {
        if (text.contains("ai") || text.contains("technology") || text.contains("device") || text.contains("robot"))
            return "Technology";
        if (text.contains("vaccine") || text.contains("covid") || text.contains("virus"))
            return "Vaccines";
        if (text.contains("mental") || text.contains("stress") || text.contains("psychology") || text.contains("depression"))
            return "Mental Health";
        if (text.contains("fitness") || text.contains("exercise") || text.contains("workout") || text.contains("gym"))
            return "Fitness";
        if (text.contains("nutrition") || text.contains("diet") || text.contains("food") || text.contains("vitamin"))
            return "Nutrition";
        if (text.contains("heart") || text.contains("cardio") || text.contains("blood pressure"))
            return "Cardiology";
        return "General Health";
    }
}
