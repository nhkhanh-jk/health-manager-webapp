package com.healthmanager.service;

import com.healthmanager.model.NewsArticle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException; // MỚI
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class MedicalNewsService {

    private final WebClient webClient;

    @Value("${newsapi.key}")
    private String apiKey;

    private final String NEWS_API_URL = "https://newsapi.org/v2/everything";

    @Autowired
    public MedicalNewsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(NEWS_API_URL).build();
    }

    // 🔥 Map category → query
    public String mapCategoryToQuery(String category, String fallbackQuery) {
        return switch (category.toLowerCase()) {
            case "fitness" -> "health fitness exercise workout";
            case "technology" -> "health technology medical devices biotech";
            case "nutrition" -> "nutrition diet healthy food health";
            case "mental-health" -> "mental health psychology stress therapy";
            case "vaccines" -> "vaccine immunization covid health";
            default -> fallbackQuery; // "all" → fallback = "health"
        };
    }

    // 🔥 Gọi NewsAPI
    public List<NewsArticle> fetchTopMedicalNews(String query, int limit) {
        try {
            System.out.println("DEBUG CALL: q=" + query + ", limit=" + limit);

            Mono<Map> mono = webClient.get()
                    .uri(builder -> builder
                            .queryParam("q", query)
                            .queryParam("language", "en")
                            .queryParam("sortBy", "publishedAt")
                            .queryParam("pageSize", limit)
                            .queryParam("apiKey", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class);

            Map<String, Object> response = mono.block();

            if (response != null && "ok".equals(response.get("status"))) {
                List<Map<String, Object>> articlesMap = (List<Map<String, Object>>) response.get("articles");

                return articlesMap.stream().map(articleMap -> {
                    NewsArticle article = new NewsArticle();
                    article.setTitle((String) articleMap.get("title"));
                    article.setDescription((String) articleMap.get("description"));
                    article.setUrl((String) articleMap.get("url"));
                    article.setUrlToImage((String) articleMap.get("urlToImage"));
                    article.setPublishedAt((String) articleMap.get("publishedAt"));

                    if (articleMap.get("source") != null) {
                        Map<String, String> sourceMap = (Map<String, String>) articleMap.get("source");
                        NewsArticle.Source s = new NewsArticle.Source();
                        s.setName(sourceMap.get("name"));
                        article.setSource(s);
                    }

                    return article;
                }).toList();
            }

        } catch (Exception ex) {
            System.err.println("News API Error: " + ex.getMessage());
        }

        return List.of();
    }
}
