package com.healthmanager.controller;

import com.healthmanager.model.NewsArticle;
import com.healthmanager.service.MedicalNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // --- MỚI: Import ---
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class MedicalNewsController {

    @Autowired
    private MedicalNewsService medicalNewsService;

    /**
     * Sửa: Endpoint này giờ chấp nhận 'limit' (ví dụ: /api/news?limit=10)
     * Dashboard sẽ gọi: /api/news?limit=2
     * Trang News sẽ gọi: /api/news?limit=20
     */
    @GetMapping
    public ResponseEntity<List<NewsArticle>> getMedicalNews(
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "health") String q,
            @RequestParam(defaultValue = "20") int pageSize) { // --- MỚI: Thêm tham số limit ---

        String query = medicalNewsService.mapCategoryToQuery(category, q);

        List<NewsArticle> articles = medicalNewsService.fetchTopMedicalNews(query, pageSize);

        return ResponseEntity.ok(articles);
    }
}
