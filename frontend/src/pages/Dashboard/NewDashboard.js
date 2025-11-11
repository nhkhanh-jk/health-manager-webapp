import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentListIcon,
  CanlenderDaysIcon,
  ScaleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightCircleIcon,
  NewspaperIcon,
  FireIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  CalendarDaysIcon, // 1. Thêm RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "react-query";
import axios from "axios";
import StatCard from "../../components/Health/StatCard";
import { useNavigate } from "react-router-dom";

const NewDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: stats } = useQuery(
    "healthStats",
    async () => {
      try {
        const [reminders, metrics] = await Promise.all([
          axios.get("/health/reminders/today"),
          axios.get("/health/metrics/dashboard"),
        ]);
        return { reminders: reminders.data, metrics: metrics.data };
      } catch (error) {
        // Fallback to mock data
        const today = new Date().toISOString().split("T")[0];
        const todayReminders = mockReminders.filter((r) => r.date === today);
        const enabledCount = todayReminders.filter((r) => r.enabled).length;

        return {
          reminders: {
            count: todayReminders.length,
            on: enabledCount,
            off: todayReminders.length - enabledCount,
            items: todayReminders,
          },
          metrics: {
            systolic: 120,
            diastolic: 80,
            heartRate: 72,
            weight: 70.5,
          },
        };
      }
    },
    { refetchInterval: 30000 }
  );

  const { data: historyData } = useQuery(
    "medicalHistory",
    async () => {
      const res = await axios.get("/health/history");
      return res.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

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

  // Mock data cho reminders
  const mockReminders = useMemo(
    () => [
      {
        id: 1,
        title: "Uống thuốc huyết áp",
        date: new Date().toISOString().split("T")[0],
        time: "08:00:00",
        enabled: true,
        type: "medication",
      },
      {
        id: 2,
        title: "Tập cardio buổi sáng",
        date: new Date().toISOString().split("T")[0],
        time: "07:00:00",
        enabled: true,
        type: "exercise",
      },
      {
        id: 3,
        title: "Uống nước 2 lít",
        date: new Date().toISOString().split("T")[0],
        time: "12:00:00",
        enabled: true,
        type: "hydration",
      },
      {
        id: 4,
        title: "Tập yoga buổi chiều",
        date: new Date().toISOString().split("T")[0],
        time: "18:00:00",
        enabled: true,
        type: "exercise",
      },
      {
        id: 5,
        title: "Đi ngủ đúng giờ",
        date: new Date().toISOString().split("T")[0],
        time: "22:30:00",
        enabled: false,
        type: "sleep",
      },
      {
        id: 6,
        title: "Kiểm tra huyết áp",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        time: "09:00:00",
        enabled: true,
        type: "health_check",
      },
    ],
    []
  );

  // Lấy reminders hôm nay để hiển thị trong phần Today Reminders
  const todayReminders = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return mockReminders.filter((r) => r.date === today).slice(0, 3); // Chỉ hiển thị 3 mục đầu
  }, [mockReminders]);

  // Circular Progress Component
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
            // 1. Đổi màu nền icon Rocket sang gradient xanh dương
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
              {/* Background circle */}
              <circle
                cx="75"
                cy="75"
                r={normalizedRadius}
                stroke="var(--neutral-200)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
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
                  id="progressGradientBlue" // Đổi ID
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3B82F6" /> {/* blue-500 */}
                  <stop offset="100%" stopColor="#06B6D4" /> {/* cyan-500 */}
                </linearGradient>
              </defs>
            </svg>

            {/* Center text */}
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

  // Mock data cho lịch sử bệnh lý
  const mockMedicalHistory = useMemo(
    () => [
      {
        id: 1,
        date: "2024-12-01",
        title: "Khám sức khỏe tổng quát",
        notes:
          "Kết quả khám sức khỏe định kỳ. Tất cả các chỉ số đều bình thường. Khuyến nghị duy trì chế độ ăn uống và tập luyện hiện tại.",
        status: "completed",
        type: "checkup",
      },
      {
        id: 2,
        date: "2024-11-15",
        title: "Tiêm phòng cúm",
        notes:
          "Đã tiêm phòng cúm mùa 2024-2025. Không có phản ứng phụ. Cần tiêm lại vào năm sau.",
        status: "completed",
        type: "vaccination",
      },
      {
        id: 3,
        date: "2024-10-20",
        title: "Đau đầu kéo dài",
        notes:
          "Đau đầu trong 3 ngày liên tiếp. Đã uống thuốc giảm đau nhưng không hiệu quả. Cần theo dõi thêm.",
        status: "ongoing",
        type: "symptom",
      },
      {
        id: 4,
        date: "2024-09-10",
        title: "Dị ứng thời tiết",
        notes:
          "Triệu chứng: hắt hơi, chảy nước mũi, ngứa mắt. Đã dùng thuốc kháng histamine. Tránh tiếp xúc với phấn hoa.",
        status: "resolved",
        type: "allergy",
      },
      {
        id: 5,
        date: "2024-08-05",
        title: "Phẫu thuật ruột thừa",
        notes:
          "Phẫu thuật nội soi cắt ruột thừa. Quá trình phẫu thuật thành công. Thời gian hồi phục: 2 tuần.",
        status: "completed",
        type: "surgery",
      },
    ],
    []
  );

  // Mock data cho fitness
  const mockFitnessData = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );

    return {
      todayWorkout: {
        id: 1,
        title: "Yoga buổi sáng",
        duration: 15,
        calories: 60,
        completed: true,
        thumbnail: "🧘‍♂️",
        description: "Thư giãn tinh thần và cơ thể với các tư thế yoga cơ bản",
      },
      weeklyStats: {
        completedDays: 3,
        totalDays: 7,
        totalCalories: 420,
        totalMinutes: 180,
        streak: 3,
      },
      recentWorkouts: [
        {
          id: 1,
          title: "Cardio buổi sáng",
          duration: 10,
          calories: 80,
          completed: true,
          date: new Date().toISOString().split("T")[0],
        },
        {
          id: 2,
          title: "HIIT toàn thân",
          duration: 20,
          calories: 200,
          completed: true,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          id: 3,
          title: "Stretching buổi tối",
          duration: 10,
          calories: 40,
          completed: false,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    };
  }, []);

  // Lọc các mục hiển thị theo thanh tìm kiếm
  const filteredHistory = useMemo(() => {
    const data = historyData?.items || mockMedicalHistory;
    if (!search?.trim()) {
      return data.slice(0, 3); // Chỉ hiển thị 3 mục đầu tiên
    }
    const q = search.trim().toLowerCase();
    return data.filter((item) =>
      [item.title, item.notes, item.date].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [historyData, mockMedicalHistory, search]);

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
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[var(--neutral-100)] flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-[var(--neutral-700)]">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--neutral-800)]">
                  {user?.firstName} {user?.lastName}
                </h1>
                <div className="mt-1">
                  <p className="text-base font-semibold text-[var(--neutral-700)]">
                    USER
                  </p>
                  <p className="text-sm text-[var(--neutral-500)]">
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

            {/* User Quick Info */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-[var(--neutral-500)]">{t("age")}</p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.age || 32}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">{t("gender")}</p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.gender || t("male")}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">{t("bloodGroup")}</p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.bloodGroup || "B+"}
                </p>
              </div>
              <div>
                <p className="text-[var(--neutral-500)]">
                  {t("height")} ({t("cm")})
                </p>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {user?.height || 170}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          variants={itemVariants}
          onClick={() => navigate("/fitness")}
          className="cursor-pointer"
        >
          <CircularProgress
            title={t("weeklyProgress")}
            percentage={75}
            value={180}
            unit={t("minutes") || "min"}
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
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center">
                  <NewspaperIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                  {t("medicalNews")}
                </h2>
              </div>
              <button
                className="text-xs text-[var(--primary-600)] hover:text-[var(--primary-800)] font-medium"
                onClick={() => navigate("/medical-news")}
              >
                {t("viewDetails")}
              </button>
            </div>

            <div className="space-y-2 flex-1">
              {/* News Item 1 */}
              <div
                className={`p-2 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${theme === "dark"
                    ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                    : "bg-white border-gray-200"
                  }`}
                style={{
                  boxShadow:
                    "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
                }}
                onClick={() => navigate("/medical-news")}
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
                    <p className="text-xs font-medium text-[var(--text-primary)] line-clamp-1">
                      New Study Shows Benefits of Morning Exercise
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>

              {/* News Item 2 */}
              <div
                className={`p-2 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${theme === "dark"
                    ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                    : "bg-white border-gray-200"
                  }`}
                style={{
                  boxShadow:
                    "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
                }}
                onClick={() => navigate("/medical-news")}
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
                    <p className="text-xs font-medium text-[var(--text-primary)] line-clamp-1">
                      Breakthrough in Diabetes Management
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      4 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Medical History + Reminders + Fitness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Medical History - 2 cột */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div
            className={`p-6 rounded-xl shadow-lg border ${theme === "dark"
                ? "bg-[var(--glass-bg-primary)] border-[var(--glass-border)]"
                : "bg-white border-gray-200"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center">
                <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                {t("medicalHistory.title")} {/* Lịch sử bệnh lý */}
              </h2>

              {/* Thanh tìm kiếm */}
              <div className="relative w-64 max-w-full ml-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchHistory")}
                  className="w-full border border-[var(--neutral-200)] bg-[var(--neutral-100)] pl-12 pr-3 py-1 rounded-md text-sm outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-[var(--neutral-600)] absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              {filteredHistory.map((h) => {
                const getStatusInfo = (status) => {
                  switch (status) {
                    case "completed":
                      return { color: "green", text: "Hoàn thành", icon: "✓" };
                    case "ongoing":
                      return {
                        color: "yellow",
                        text: "Đang điều trị",
                        icon: "⏳",
                      };
                    case "resolved":
                      return { color: "blue", text: "Đã khỏi", icon: "✓" };
                    default:
                      return {
                        color: "gray",
                        text: "Chưa xác định",
                        icon: "?",
                      };
                  }
                };

                const getTypeInfo = (type) => {
                  switch (type) {
                    case "checkup":
                      return { color: "blue", text: "Khám sức khỏe" };
                    case "vaccination":
                      return { color: "green", text: "Tiêm phòng" };
                    case "symptom":
                      return { color: "orange", text: "Triệu chứng" };
                    case "allergy":
                      return { color: "red", text: "Dị ứng" };
                    case "surgery":
                      return { color: "purple", text: "Phẫu thuật" };
                    default:
                      return { color: "gray", text: "Khác" };
                  }
                };

                const statusInfo = getStatusInfo(h.status);
                const typeInfo = getTypeInfo(h.type);

                return (
                  <div
                    key={h.id}
                    className={`p-4 rounded-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${theme === "dark"
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
                            className={`w-3 h-3 rounded-full bg-${statusInfo.color}-500`}
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
                              {new Date(h.date).toLocaleDateString("vi-VN")}
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
              })}
              {filteredHistory.length === 0 && (
                <p className="text-sm text-[var(--neutral-600)]">
                  {t("noData")}
                </p>
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
                {todayReminders.map((r) => {
                  const getTypeInfo = (type) => {
                    switch (type) {
                      case "medication":
                        return { color: "red", text: "Thuốc", icon: "💊" };
                      case "exercise":
                        return {
                          color: "green",
                          text: "Tập luyện",
                          icon: "💪",
                        };
                      case "hydration":
                        return { color: "blue", text: "Nước", icon: "💧" };
                      case "sleep":
                        return { color: "purple", text: "Ngủ", icon: "😴" };
                      case "health_check":
                        return {
                          color: "orange",
                          text: "Kiểm tra",
                          icon: "🩺",
                        };
                      default:
                        return { color: "gray", text: "Khác", icon: "⏰" };
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
                            <span className="text-sm">{typeInfo.icon}</span>
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
                                className={`w-1.5 h-1.5 rounded-full ${r.enabled ? "bg-green-500" : "bg-gray-400"
                                  }`}
                              />
                              <span>{r.enabled ? "Đang bật" : "Đã tắt"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {todayReminders.length === 0 && (
                  <div className="text-center py-8">
                    <BellIcon className="w-10 h-10 text-[var(--neutral-500)] mx-auto mb-2" />
                    <p className="text-[var(--text-secondary)] text-sm">
                      {t("noData")}
                    </p>
                  </div>
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
              className={`p-6 rounded-xl shadow-lg border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${theme === "dark"
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
                  <FireIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
                  {t("fitness")}
                </h2>
                <button
                  className="text-sm text-[var(--primary-600)] hover:text-[var(--primary-800)] font-medium"
                  onClick={() => navigate("/fitness")}
                >
                  {t("viewALL")}
                </button>
              </div>

              {/* Today's Workout - Compact */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">
                    {mockFitnessData.todayWorkout.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                      {mockFitnessData.todayWorkout.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-[var(--text-secondary)]">
                      <span>
                        ⏱️ {mockFitnessData.todayWorkout.duration} phút
                      </span>
                      <span>
                        🔥 {mockFitnessData.todayWorkout.calories} cal
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${mockFitnessData.todayWorkout.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {mockFitnessData.todayWorkout.completed ? "✓" : "⏳"}
                  </span>
                </div>

                {/* Weekly Progress - Compact */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">
                      Tuần này
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {mockFitnessData.weeklyStats.completedDays}/
                      {mockFitnessData.weeklyStats.totalDays} ngày
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
                        width: `${(mockFitnessData.weeklyStats.completedDays /
                            mockFitnessData.weeklyStats.totalDays) *
                          100
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Button - Compact */}
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

      {/* End Dashboard */}
    </motion.div>
  );
};

export default NewDashboard;
