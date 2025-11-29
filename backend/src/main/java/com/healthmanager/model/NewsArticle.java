package com.healthmanager.model;

public class NewsArticle {

    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private String publishedAt;
    private Source source;     // nguồn bài báo (tên báo, trang…)

    // Nếu bạn có thêm field khác (category, sentiment, author, ...) 
    // thì khai báo thêm ở đây + tạo getter/setter tương ứng.

    public NewsArticle() {
    }

    // Có thể thêm constructor đầy đủ nếu muốn
    public NewsArticle(String title,
                       String description,
                       String url,
                       String urlToImage,
                       String publishedAt,
                       Source source) {
        this.title = title;
        this.description = description;
        this.url = url;
        this.urlToImage = urlToImage;
        this.publishedAt = publishedAt;
        this.source = source;
    }

    // ===== Getter & Setter =====

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrlToImage() {
        return urlToImage;
    }

    public void setUrlToImage(String urlToImage) {
        this.urlToImage = urlToImage;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    // ================== INNER CLASS Source ==================

    public static class Source {
        private String name;

        public Source() {
        }

        public Source(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
