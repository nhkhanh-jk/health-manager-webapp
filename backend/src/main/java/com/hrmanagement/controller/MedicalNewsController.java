package com.hrmanagement.controller;

import com.hrmanagement.model.NewsArticle;
import com.hrmanagement.service.MedicalNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


/**
 * Controller RESTful phục vụ API tin tức y tế cho frontend
 */
@RestController
@RequestMapping("/news")
@CrossOrigin(origins = "*") // Cho phép frontend gọi từ localhost:3000
public class MedicalNewsController {

    @Autowired
    private MedicalNewsService medicalNewsService;

    /**
     * API: GET /api/news
     * Optional param: category
     */
    @GetMapping
    public ResponseEntity<List<NewsArticle>> getMedicalNews(
            @RequestParam(required = false) String category) {

        List<NewsArticle> articles = medicalNewsService.getMedicalNews(category);
        return ResponseEntity.ok(articles);
    }

    /**
     * Kiểm tra API còn hoạt động hay không
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(
                Map.of(
                        "status", "MedicalNews service is running ✅",
                        "source", "NewsAPI.org"
                )
        );
    }
}
