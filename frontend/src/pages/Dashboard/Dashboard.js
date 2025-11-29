import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentListIcon,
  ScaleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightCircleIcon,
  NewspaperIcon,
  FireIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "react-query";
import StatCard from "../../components/Health/StatCard";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

// --- MỚI: Thêm hàm xử lý thời gian cho tin tức ---
const formatTimeAgo = (isoDate, t) => {
  if (!isoDate) return "";
  const now = new Date();
  const date = new Date(isoDate);
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1)
    return Math.floor(interval) + ` ${t("yearAgo") || "năm trước"}`;
  interval = seconds / 2592000;
  if (interval > 1)
    return Math.floor(interval) + ` ${t("monthAgo") || "tháng trước"}`;
  interval = seconds / 86400;
  if (interval > 1)
    return Math.floor(interval) + ` ${t("dayAgo") || "ngày trước"}`;
  interval = seconds / 3600;
  if (interval > 1)
    return Math.floor(interval) + ` ${t("hourAgo") || "giờ trước"}`;
  interval = seconds / 60;
  if (interval > 1)
    return Math.floor(interval) + ` ${t("minuteAgo") || "phút trước"}`;
  return Math.floor(seconds) + ` ${t("secondAgo") || "giây trước"}`;
};
// --- HẾT CODE MỚI ---

const NewDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // --- FIX: XÓA initialData VÀ DÙNG ĐÚNG ENDPOINT (History, Fitness) ---
  const { data: stats, isLoading: isLoadingStats } = useQuery(
    "healthStats",
    async () => {
      const [reminders, metrics] = await Promise.all([
        api.get("/reminders/today"),
        api.get("/health/metrics/dashboard"),
      ]);
      return { reminders: reminders.data, metrics: metrics.data };
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const { data: historyData, isLoading: isLoadingHistory } = useQuery(
    "medicalHistory",
    async () => {
      // Endpoint đúng của Medical History là: /api/health/medical-history
      const res = await api.get("/health/medical-history");
      return res.data;
    },
    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true, // Tự động refetch khi quay lại tab
      refetchOnMount: true, // Tự động refetch khi mount lại component
    }
  );

  const { data: fitnessData, isLoading: isLoadingFitness } = useQuery(
    "dashboardFitness",
    async () => {
      // Endpoint đúng của Workout Session là: /api/health/workouts/dashboard
      const res = await api.get("/health/workouts/dashboard");
      return res.data;
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // --- Lấy Tin Tức (Đã fix) ---
  const { data: newsData, isLoading: isLoadingNews } = useQuery(
    "dashboardNews",
    async () => {
      const res = await api.get("/news?pageSize=3");
      return res.data;
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  // --- HẾT FIX ---

  const isPageLoading =
    isLoadingStats || isLoadingHistory || isLoadingFitness || isLoadingNews;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const todayReminders = useMemo(() => {
    return stats?.reminders?.items || [];
  }, [stats]);

  // (Circular Progress Component - Giữ nguyên)
  const CircularProgress = ({ percentage, value, unit, title, icon: Icon }) => {
    const radius = 70;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return (
      <div
        className={`p-6 flex flex-col rounded-xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${theme === "dark"
          ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
          : "bg-white border-gray-200"
          }`}
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-[var(--text-primary)] text-base font-bold mb-1">
              {title}
            </p>
          </div>
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg
              className="w-52 h-52 transform -rotate-90 absolute"
              viewBox="0 0 150 150"
            >
              <circle
                cx="75"
                cy="75"
                r={normalizedRadius}
                stroke="var(--neutral-200)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx="75"
                cy="75"
                r={normalizedRadius}
                stroke="url(#progressGradientBlue)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
              />
              <defs>
                <linearGradient
                  id="progressGradientBlue"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[var(--neutral-800)]">
                {percentage}%
              </span>
              <span className="text-sm text-[var(--neutral-500)] mt-1">
                {value} {unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredHistory = useMemo(() => {
    // FIX: API trả về List trực tiếp, không phải object có property 'items'
    const data = Array.isArray(historyData)
      ? historyData
      : historyData?.items || [];
    if (!search?.trim()) {
      return data.slice(0, 3);
    }
    const q = search.trim().toLowerCase();
    return data.filter((item) =>
      [item.title, item.notes, item.date].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [historyData, search]);

  // --- MỚI: Fetch dữ liệu bài tập để tính tiến độ hoàn thành ---
  const { data: allWorkouts = [] } = useQuery(
    "allWorkouts",
    async () => {
      try {
        const response = await api.get("/health/workouts/library");
        return response.data || [];
      } catch (error) {
        return [];
      }
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: userWorkouts = [] } = useQuery(
    "userWorkouts",
    async () => {
      try {
        const response = await api.get("/health/workouts");
        return response.data || [];
      } catch (error) {
        return [];
      }
    },
    { staleTime: 0, refetchOnWindowFocus: true }
  );

  const completionProgress = useMemo(() => {
    const totalWorkouts = allWorkouts.length;
    if (totalWorkouts === 0) return { percentage: 0, completedCount: 0 };

    // Tính số bài tập đã hoàn thành (unique title)
    const completedTitles = new Set(
      userWorkouts.filter((w) => w.completed).map((w) => w.title)
    );
    const completedCount = completedTitles.size;
    const percentage = Math.round((completedCount / totalWorkouts) * 100);

    return { percentage, completedCount, totalWorkouts };
  }, [allWorkouts, userWorkouts]);
  // --- HẾT CODE MỚI ---

  const fitnessStats = useMemo(() => {
    const completedWorkouts = userWorkouts.filter(w => w.completed);

    // Sort by date (descending) to get the latest one
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
      const dateA = new Date(a.date + (a.startTime ? 'T' + a.startTime : ''));
      const dateB = new Date(b.date + (b.startTime ? 'T' + b.startTime : ''));
      return dateB - dateA;
    });

    const latestWorkout = sortedWorkouts[0] || null;

    return {
      latestWorkout
    };
  }, [userWorkouts]);

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* User Header Card */}
      <motion.div variants={itemVariants}>
        <div
          className={`p-6 rounded-xl shadow-lg border ${theme === "dark"
            ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
            : "bg-white border-gray-200"
            }`}
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--neutral-100)] flex items-center justify-center shadow-sm">
                <span className="text-xl md:text-2xl font-bold text-[var(--neutral-700)]">
                  {user?.ho?.charAt(0)}
                  {user?.ten?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[var(--neutral-800)]">
                  {user?.ho} {user?.ten}
                </h1>
                <div className="mt-1">
                  <p className="text-sm md:text-base font-semibold text-[var(--neutral-700)]">
                    {/* USER */}
                  </p>
                  <p className="text-xs md:text-sm text-[var(--neutral-500)]">
                    {new Date().toLocaleDateString(
                      language === "vi" ? "vi-VN" : "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3 text-xs md:text-sm">
              <div>
                <p className="text-[var(--neutral-500)]">{t("age")}</p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.tuoi || "__"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">{t("gender")}</p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.gioiTinh ? t(user.gioiTinh) : "__"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">{t("bloodGroup")}</p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.bloodGroup || "__"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">
                  {t("height")} ({t("cm")})
                </p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.height || "__"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- MỚI: Thêm màn hình Loading tổng --- */}
      {isPageLoading ? (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center h-96"
        >
          <LoadingSpinner size="lg" />
        </motion.div>
      ) : (
        <>
          {/* --- HẾT CODE MỚI --- */}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            <motion.div
              variants={itemVariants}
              onClick={() => navigate("/fitness")}
              className="cursor-pointer"
            >
              <CircularProgress
                title={t("completionProgress") || "Tiến trình hoàn thành"}
                percentage={completionProgress.percentage}
                value={completionProgress.completedCount}
                unit={t("workouts") || "bài"}
                icon={RocketLaunchIcon}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="h-full">
              <div className="flex flex-col h-full gap-4">
                {/* Ô Nhắc nhở hôm nay */}
                <div>
                  <StatCard
                    title={t("reminders")}
                    value={stats?.reminders?.count || 0}
                    unit={t("total") + ": "}
                    unitPosition="before"
                    icon={BellIcon}
                    color="custom"
                    customIconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
                    onClick={() => navigate("/reminder")}
                    className="h-full"
                  />
                </div>

                {/* Ô Chatbot */}
                <div className="flex-1">
                  <StatCard
                    title={t("chatbot")}
                    subtitle={t("chat")}
                    icon={ChatBubbleLeftRightIcon}
                    color="custom"
                    customIconBg="bg-gradient-to-br from-blue-500 to-cyan-500"
                    onClick={() => navigate("/chatbot")}
                    className="h-full"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div
                className={`p-6 rounded-xl shadow-lg border h-full flex flex-col ${theme === "dark"
                  ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                  : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center">
                    <NewspaperIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                    {t("medicalNews")}
                  </h2>
                  <button
                    className="text-xs text-[var(--primary-600)] hover:text-[var(--primary-800)] font-medium"
                    onClick={() => navigate("/medical-news")}
                  >
                    {t("viewDetails")}
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  {newsData && newsData.length > 0 ? (
                    newsData.map((article, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${theme === "dark"
                          ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                          : "bg-white border-gray-200"
                          }`}
                        style={{
                          boxShadow:
                            "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
                        }}
                        onClick={() => window.open(article.url, "_blank")}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${theme === "dark"
                                ? "bg-[var(--glass-bg-primary)]"
                                : "bg-white"
                                }`}
                            ></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-medium text-[var(--text-primary)] line-clamp-1"
                              title={article.title}
                            >
                              {article.title}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                              {formatTimeAgo(article.publishedAt, t)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--text-secondary)]">
                      {t("noNewsAvailable") || "Không có tin tức mới."}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Medical History + Reminders + Fitness */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Medical History - 2 cột */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div
                className={`p-6 rounded-xl shadow-lg border h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${theme === "dark"
                  ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                  : "bg-white border-gray-200"
                  }`}
                style={{
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                    {t("medicalHistory.title")}
                  </h2>

                  <div className="relative w-full md:w-64 max-w-full ml-0 md:ml-2">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("searchHistory")}
                      className="w-full border border-[var(--neutral-200)] bg-[var(--neutral-100)] pl-10 md:pl-12 pr-3 py-1.5 md:py-1 rounded-md text-xs md:text-sm outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5 text-[var(--neutral-600)] absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredHistory.length === 0 ? (
                    <p className="text-sm text-[var(--neutral-600)] text-center py-10">
                      {t("noData")}
                    </p>
                  ) : (
                    filteredHistory.map((h) => {
                      // SỬA: Sử dụng localization thay vì hard-code text
                      const getStatusInfo = (status) => {
                        switch (status) {
                          case "completed":
                          case "resolved":
                            return {
                              colorClass: "bg-green-500",
                              text:
                                t("medicalHistory.resolved") ||
                                "Đã khỏi/Hoàn thành",
                              icon: "✓",
                            };
                          case "ongoing":
                            return {
                              colorClass: "bg-yellow-500",
                              text:
                                t("medicalHistory.ongoing") || "Đang điều trị",
                              icon: "⏳",
                            };
                          default:
                            return {
                              colorClass: "bg-yellow-500",
                              text:
                                t("medicalHistory.unknown") || "Chưa xác định",
                              icon: "?",
                            };
                        }
                      };
                      const getTypeInfo = (type) => {
                        switch (type) {
                          case "checkup":
                            return {
                              color: "blue",
                              text:
                                t("medicalHistory.typeCheckup") ||
                                "Khám sức khỏe",
                            };
                          case "vaccination":
                            return {
                              color: "green",
                              text:
                                t("medicalHistory.typeVaccination") ||
                                "Tiêm phòng",
                            };
                          case "symptom":
                            return {
                              color: "orange",
                              text:
                                t("medicalHistory.typeSymptom") ||
                                "Triệu chứng",
                            };
                          case "allergy":
                            return {
                              color: "red",
                              text: t("medicalHistory.typeAllergy") || "Dị ứng",
                            };
                          case "surgery":
                            return {
                              color: "purple",
                              text:
                                t("medicalHistory.typeSurgery") || "Phẫu thuật",
                            };
                          default:
                            return {
                              color: "gray",
                              text: t("medicalHistory.typeOther") || "Khác",
                            };
                        }
                      };
                      const statusInfo = getStatusInfo(h.status);
                      const typeInfo = getTypeInfo(h.type);

                      return (
                        <div
                          key={h.id}
                          className={`p-4 rounded-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${theme === "dark"
                            ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                            : "bg-white border-gray-200"
                            }`}
                          style={{
                            boxShadow:
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${statusInfo.colorClass}`}
                                />
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                  {h.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}
                                >
                                  {typeInfo.text}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)] mb-2">
                                <div className="flex items-center space-x-1">
                                  <span>📅</span>
                                  <span>
                                    {new Date(
                                      h.date + "T00:00:00"
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>{statusInfo.icon}</span>
                                  <span>{statusInfo.text}</span>
                                </div>
                              </div>
                              {h.notes && (
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                  {h.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <button
                    className="w-full mt-2 inline-flex items-center justify-center text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm font-medium"
                    onClick={() => navigate("/health")}
                  >
                    {t("medicalHistory.viewAll")}{" "}
                    <ArrowRightCircleIcon className="w-4 h-4 ml-1 text-[var(--primary-600)]" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right column: Reminders + Fitness */}
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <div
                  className={`p-6 rounded-xl shadow-lg border h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${theme === "dark"
                    ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                    : "bg-white border-gray-200"
                    }`}
                  style={{
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                    {t("todayReminders")}
                  </h2>
                  <div className="space-y-2">
                    {todayReminders.length === 0 ? (
                      <div className="text-center py-8">
                        <BellIcon className="w-10 h-10 text-[var(--neutral-500)] mx-auto mb-2" />
                        <p className="text-[var(--text-secondary)] text-sm">
                          {t("noData")}
                        </p>
                      </div>
                    ) : (
                      todayReminders.map((r) => {
                        const getTypeInfo = (type) => {
                          switch (type) {
                            case "medication":
                              return {
                                color: "red",
                                text: "Thuốc",
                                icon: "💊",
                              };
                            case "workout":
                              return {
                                color: "green",
                                text: "Tập luyện",
                                icon: "💪",
                              };
                            case "hydration":
                              return {
                                color: "blue",
                                text: "Nước",
                                icon: "💧",
                              };
                            case "sleep":
                              return {
                                color: "purple",
                                text: "Ngủ",
                                icon: "😴",
                              };
                            case "health_check":
                              return {
                                color: "orange",
                                text: "Kiểm tra",
                                icon: "🩺",
                              };
                            default:
                              return {
                                color: "gray",
                                text: "Khác",
                                icon: "⏰",
                              };
                          }
                        };
                        const typeInfo = getTypeInfo(r.type);

                        return (
                          <div
                            key={r.id}
                            className={`p-3 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${theme === "dark"
                              ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                              : "bg-white border-gray-200"
                              }`}
                            style={{
                              boxShadow:
                                "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm">
                                    {typeInfo.icon}
                                  </span>
                                  <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">
                                    {r.title}
                                  </h3>
                                  <span
                                    className={`px-1.5 py-0.5 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}
                                  >
                                    {typeInfo.text}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-[var(--text-secondary)]">
                                  <div className="flex items-center space-x-1">
                                    <span>🕐</span>
                                    <span>{r.time?.slice(0, 5)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${r.enabled
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                        }`}
                                    />
                                    <span>
                                      {r.enabled ? "Đang bật" : "Đã tắt"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <button
                      className="w-full mt-2 inline-flex items-center justify-center text-[var(--primary-600)] hover:text-[var(--primary-800)] text-sm font-medium"
                      onClick={() => navigate("/reminder")}
                    >
                      {t("viewDetails")}{" "}
                      <ArrowRightCircleIcon className="w-4 h-4 ml-1 text-[var(--primary-600)]" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Fitness Card */}
              <motion.div variants={itemVariants}>
                <div
                  className={`p-6 rounded-xl shadow-lg border h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${theme === "dark"
                    ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                    : "bg-white border-gray-200"
                    }`}
                  style={{
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                    <FireIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                    {t("fitness")}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {fitnessStats.latestWorkout?.thumbnail || "🧘‍♂️"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          {fitnessStats.latestWorkout?.title || t("noWorkoutYet") || "Chưa có bài tập"}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-[var(--text-secondary)]">
                          <span>
                            ⏱️ {fitnessStats.latestWorkout?.durationMinutes || fitnessStats.latestWorkout?.duration || 0} phút
                          </span>
                          <span>
                            🔥 {fitnessStats.latestWorkout?.calories || 0} cal
                          </span>
                        </div>
                      </div>
                      {fitnessStats.latestWorkout && (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">
                          {t("completionProgress") || "Tiến trình hoàn thành"}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {completionProgress.completedCount}/
                          {completionProgress.totalWorkouts} {t("workouts") || "bài"}
                        </span>
                      </div>
                      <div
                        className={`w-full h-1.5 rounded-full overflow-hidden ${theme === "dark"
                          ? "bg-[var(--glass-bg-tertiary)]"
                          : "bg-gray-200"
                          }`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] transition-all duration-500"
                          style={{
                            width: `${completionProgress.percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <button
                      className="w-full mt-2 btn btn-primary text-xs py-2"
                      onClick={() => navigate("/fitness")}
                    >
                      <FireIcon className="w-3 h-3 mr-1 text-white" />
                      {t("startPract")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default NewDashboard;
