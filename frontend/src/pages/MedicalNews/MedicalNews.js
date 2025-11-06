import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  UserIcon,
  HeartIcon,
  ShieldCheckIcon,
  BeakerIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import axios from "axios";

const MedicalNews = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --------------------------
  // 🔹 DỮ LIỆU MẪU FALLBACK
  // --------------------------
  const fallbackNewsData = [
    {
      id: "news-1",
      title: "Lời khuyên về sức khỏe tâm thần trong tháng nhận thức",
      summary:
        "Các chuyên gia chia sẻ những cách đơn giản để duy trì sức khỏe tâm thần tốt trong cuộc sống hàng ngày.",
      author: "Dr. Emily Rodriguez",
      publishDate: "2024-01-13",
      category: "mental-health",
      readTime: "4 phút",
      image:
        "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/10/7/photo-1728291889413-17282918904911503530724.jpeg",
      url: "https://suckhoedoisong.vn/who-khuyen-nghi-6-loi-khuyen-de-bao-ve-suc-khoe-tam-than-169241007161038671.htm",
      tags: ["sức khỏe tâm thần", "lời khuyên", "phòng ngừa"],
    },
    {
      id: "news-2",
      title: "Công nghệ AI trong chẩn đoán y khoa",
      summary:
        "Trí tuệ nhân tạo đang cách mạng hóa việc chẩn đoán bệnh với độ chính xác cao hơn và thời gian nhanh hơn.",
      author: "Dr. James Wilson",
      publishDate: "2024-01-12",
      category: "technology",
      readTime: "6 phút",
      image:
        "https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2025/2/20/1-17400406601101845420807.jpg",
      url: "https://suckhoedoisong.vn/ung-dung-tri-tue-nhan-tao-ai-trong-kham-chua-benh-co-hoi-thach-thuc-va-xu-huong-trong-tuong-lai-169250220153703507.htm",
      tags: ["AI", "chẩn đoán", "công nghệ y tế"],
    },
  ];

  // --------------------------
  // 🔹 GỌI API BACKEND
  // --------------------------
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8080/api/news", {
          params: selectedCategory !== "all" ? { category: selectedCategory } : {},
        });

        const mapped = response.data.map((item, index) => ({
          id: `news-${index + 1}`,
          title: item.title,
          summary: item.description,
          content: item.description,
          author: item.sourceName || "Nguồn tin",
          publishDate: item.publishedAt,
          category:
            selectedCategory !== "all" ? selectedCategory : "general",
          readTime: "5 phút",
          image: item.imageUrl,
          url: item.url,
          tags: [selectedCategory],
        }));

        setNewsData(mapped);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu tin tức. Đang hiển thị dữ liệu mẫu.");
        setNewsData(fallbackNewsData);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  // --------------------------
  // 🔹 FILTER + SORT
  // --------------------------
  const filteredNews = useMemo(() => {
    let filtered = newsData;

    if (searchTerm) {
      filtered = filtered.filter(
        (news) =>
          news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (sortBy === "latest") {
      filtered.sort(
        (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.publishDate) - new Date(b.publishDate)
      );
    }

    return filtered;
  }, [newsData, searchTerm, sortBy]);

  // --------------------------
  // 🔹 CATEGORY DANH MỤC
  // --------------------------
  const categories = [
    { id: "all", name: t("allCategories") || "Tất cả" },
    { id: "fitness", name: t("fitnessCategory") || "Thể dục" },
    { id: "technology", name: t("technologyCategory") || "Công nghệ" },
    { id: "nutrition", name: t("nutritionCategory") || "Dinh dưỡng" },
    { id: "mental-health", name: t("mentalHealthCategory") || "Tâm lý" },
    { id: "vaccines", name: t("vaccinesCategory") || "Vaccine" },
  ];

  // --------------------------
  // 🔹 COMPONENT CARD
  // --------------------------
  const NewsCard = ({ news }) => (
    <motion.div
      className={`p-6 rounded-xl shadow-lg border cursor-pointer transition-all duration-300 ${
        theme === "dark"
          ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
          : "bg-white border-gray-200"
      }`}
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={() => window.open(news.url, "_blank")}
    >
      <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
        <img
          src={
            news.image ||
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
          }
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {news.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-3">
        {news.summary}
      </p>
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <div className="flex items-center">
          <UserIcon className="w-4 h-4 mr-1" />
          {news.author}
        </div>
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {new Date(news.publishDate).toLocaleDateString("vi-VN")}
        </div>
      </div>
    </motion.div>
  );

  // --------------------------
  // 🔹 RENDER CHÍNH
  // --------------------------
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <div
        className={`p-6 rounded-xl shadow-lg border ${
          theme === "dark"
            ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
            <NewspaperIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {t('medicalNews')}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {t('updatenew')}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div
        className={`p-6 rounded-xl shadow-lg border ${
          theme === "dark"
            ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tin tức..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--neutral-100)] border border-[var(--neutral-200)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary-200)]"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-[var(--neutral-500)] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--neutral-100)] border border-[var(--neutral-200)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary-200)]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--neutral-100)] border border-[var(--neutral-200)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary-200)]"
            >
              <option value="latest">{t('latest')}</option>
              <option value="oldest">{t('oldest')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* NỘI DUNG */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-600)]"></div>
        </div>
      ) : error ? (
        <div
          className={`p-8 rounded-xl text-center border ${
            theme === "dark"
              ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-[var(--text-secondary)]">
            Vui lòng thử tải lại trang hoặc kiểm tra kết nối.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MedicalNews;
