package com.hrmanagement.service;

import com.hrmanagement.model.NewsArticle;
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

    private final String NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

    @Autowired
    public MedicalNewsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(NEWS_API_URL).build();
    }

    public List<NewsArticle> fetchTopMedicalNews(int limit) { 
        try {
            // Log URL để kiểm tra
            String fullUrl = NEWS_API_URL + "?q=health&pageSize=" + limit + "&apiKey=" + apiKey.substring(0, 4) + "...";
            System.out.println("DEBUG: Gọi News API tại: " + fullUrl);

            Mono<Map> responseMono = this.webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("q", "health") 
                            .queryParam("pageSize", limit) 
                            .queryParam("apiKey", apiKey)
                            .build())
                    .retrieve()
                    // Thêm onStatus để bắt lỗi HTTP rõ ràng hơn
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), response -> {
                        // Trả về lỗi rõ ràng hơn nếu có lỗi HTTP (ví dụ: 401 Unauthorized)
                        return response.bodyToMono(String.class).map(body -> {
                            System.err.println("API RESPONSE ERROR: " + response.statusCode() + " - " + body);
                            return new RuntimeException("News API failed with status: " + response.statusCode());
                        });
                    })
                    .bodyToMono(Map.class); 

            Map<String, Object> response = (Map<String, Object>) responseMono.block();

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
                        NewsArticle.Source source = new NewsArticle.Source();
                        source.setName(sourceMap.get("name"));
                        article.setSource(source);
                    }
                    return article;
                }).toList();
            }
        } catch (WebClientResponseException e) {
             System.err.println("Lỗi WebClient: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi News API: " + e.getMessage());
        }

        return List.of(); 
    }
}