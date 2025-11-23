package com.hrmanagement.controller;

import com.hrmanagement.model.NewsArticle;
import com.hrmanagement.service.MedicalNewsService;
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
            @RequestParam(defaultValue = "10") int limit) { // --- MỚI: Thêm tham số limit ---
        
        // Truyền limit vào service
        List<NewsArticle> articles = medicalNewsService.fetchTopMedicalNews(limit); 
        return ResponseEntity.ok(articles);
    }
}