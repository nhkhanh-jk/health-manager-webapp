import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircleIcon,
  FireIcon,
  ClockIcon,
  FunnelIcon,
  CheckCircleIcon,
  HeartIcon,
  TrophyIcon,
  ChartBarIcon,
  StarIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../../contexts/LanguageContext";
import { notifications } from "../../utils/notifications";
// --- MỚI: Dùng React Query và API Instance ---
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../../api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
// --- HẾT CODE MỚI ---

// --- MỚI: Helper function để extract YouTube video ID ---
const getYouTubeVideoId = (url) => {
  if (!url) {
    console.log(" getYouTubeVideoId: URL rỗng");
    return null;
  }
  console.log("🔍 getYouTubeVideoId: Xử lý URL:", url);
  // Hỗ trợ nhiều format YouTube URL
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  console.log(" getYouTubeVideoId: Video ID:", videoId);
  return videoId;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    console.log(" getYouTubeThumbnail: Không tìm thấy video ID");
    return null;
  }
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  console.log(" getYouTubeThumbnail:", thumbnailUrl);
  return thumbnailUrl;
};
// --- HẾT CODE MỚI ---

// DỮ LIỆU MẪU ĐƯỢC GIỮ LẠI (Nếu API fail) ---
// (Mock Workouts giữ nguyên)
const mockWorkouts = [
  {
    id: 1,
    title: "Cardio buổi sáng",
    level: "Beginner",
    duration: 10,
    calories: 80,
    category: "Cardio",
    thumbnail: "🏃",
    description: "Khởi động ngày mới với bài tập cardio nhẹ nhàng",
    difficulty: 2,
    rating: 4.5,
    instructor: "Coach Anna",
    equipment: "Không cần dụng cụ",
    benefits: ["Tăng cường tim mạch", "Đốt cháy calo", "Năng lượng tích cực"],
  },
  {
    id: 2,
    title: "HIIT toàn thân",
    level: "Intermediate",
    duration: 20,
    calories: 200,
    category: "HIIT",
    thumbnail: "💪",
    description: "Bài tập cường độ cao giúp đốt cháy mỡ thừa hiệu quả",
    difficulty: 4,
    rating: 4.8,
    instructor: "Coach Mike",
    equipment: "Thảm tập",
    benefits: ["Đốt cháy mỡ", "Tăng sức bền", "Xây dựng cơ bắp"],
  },
  {
    id: 3,
    title: "Yoga thư giãn",
    level: "Beginner",
    duration: 15,
    calories: 60,
    category: "Yoga",
    thumbnail: "🧘",
    description: "Thư giãn tinh thần và cơ thể với các tư thế yoga cơ bản",
    difficulty: 1,
    rating: 4.7,
    instructor: "Coach Sarah",
    equipment: "Thảm yoga",
    benefits: ["Giảm stress", "Tăng độ dẻo dai", "Cải thiện tư thế"],
  },
  {
    id: 4,
    title: "Sức mạnh cơ bản",
    level: "Intermediate",
    duration: 25,
    calories: 180,
    category: "Strength",
    thumbnail: "🏋️",
    description: "Xây dựng cơ bắp và sức mạnh với các bài tập cơ bản",
    difficulty: 3,
    rating: 4.6,
    instructor: "Coach David",
    equipment: "Tạ tay, ghế",
    benefits: ["Tăng cơ bắp", "Cải thiện sức mạnh", "Tăng mật độ xương"],
  },
  {
    id: 5,
    title: "Stretching buổi tối",
    level: "Beginner",
    duration: 10,
    calories: 40,
    category: "Stretch",
    thumbnail: "🤸",
    description:
      "Thư giãn cơ thể sau một ngày làm việc với các động tác kéo giãn",
    difficulty: 1,
    rating: 4.4,
    instructor: "Coach Lisa",
    equipment: "Không cần dụng cụ",
    benefits: ["Giảm căng cơ", "Cải thiện lưu thông máu", "Ngủ ngon hơn"],
  },
  {
    id: 6,
    title: "Cardio nâng cao",
    level: "Advanced",
    duration: 30,
    calories: 300,
    category: "Cardio",
    thumbnail: "🚴",
    description: "Thử thách bản thân với bài tập cardio cường độ cao",
    difficulty: 5,
    rating: 4.9,
    instructor: "Coach Tom",
    equipment: "Máy chạy bộ, xe đạp",
    benefits: ["Tăng sức bền", "Đốt cháy nhiều calo", "Cải thiện tim mạch"],
  },
];
// --- HẾT DỮ LIỆU MẪU ---

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const categories = ["All", "Cardio", "HIIT", "Yoga", "Strength", "Stretch"];

const NewFitness = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [levelFilter, setLevelFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // --- MỚI: Fetch danh sách bài tập từ API (Mock data làm fallback) ---
  const { data: allWorkoutsRaw = mockWorkouts, isLoading: isLoadingWorkouts } =
    useQuery(
      "allWorkouts",
      async () => {
        try {
          // FIX: Gọi API thật để lấy workout library
          const response = await api.get("/health/workouts/library");
          const data = response.data || [];
          console.log("📥 API Response từ /health/workouts/library:", data);
          if (data[0]) {
            console.log(
              "📥 Sample workout từ API (tất cả fields):",
              JSON.stringify(data[0], null, 2)
            );
            console.log(
              "📥 Sample workout youtubeUrl field:",
              data[0].youtubeUrl,
              "youtube_url:",
              data[0].youtube_url
            );
          }

          // FIX: Loại bỏ duplicate dựa vào title (vì có thể có nhiều template cùng tên)
          const uniqueWorkouts = [];
          const seenTitles = new Set();
          data.forEach((workout) => {
            if (!seenTitles.has(workout.title)) {
              seenTitles.add(workout.title);
              // FIX: Đảm bảo youtubeUrl được map đúng (hỗ trợ cả camelCase và snake_case)
              // Kiểm tra tất cả các field có thể chứa YouTube URL
              const youtubeUrl =
                workout.youtubeUrl ||
                workout.youtube_url ||
                workout.youtubeUrl ||
                null;
              const workoutWithYoutube = {
                ...workout,
                youtubeUrl: youtubeUrl,
              };
              console.log("📦 Workout processed:", {
                title: workoutWithYoutube.title,
                youtubeUrl: workoutWithYoutube.youtubeUrl,
                hasYoutubeUrl: !!workoutWithYoutube.youtubeUrl,
                allFields: Object.keys(workout),
                rawWorkout: workout,
              });
              uniqueWorkouts.push(workoutWithYoutube);
            }
          });
          console.log(" Unique workouts:", uniqueWorkouts.length);
          return uniqueWorkouts.length > 0 ? uniqueWorkouts : mockWorkouts;
        } catch (error) {
          console.warn("Lỗi tải Workout Library, dùng dữ liệu mẫu:", error);
          return mockWorkouts; // Fallback về mock data
        }
      },
      {
        staleTime: 5 * 60 * 1000,
        onError: () =>
          console.warn("Lỗi tải Workout Library, dùng dữ liệu mẫu."),
      }
    );

  // FIX: Đảm bảo allWorkouts luôn là array và có ID unique
  const allWorkouts = useMemo(() => {
    if (!Array.isArray(allWorkoutsRaw)) return mockWorkouts;
    // Đảm bảo mỗi workout có ID unique (nếu không có thì tạo từ index)
    const workouts = allWorkoutsRaw.map((workout, index) => ({
      ...workout,
      id: workout.id || `temp-${index}`,
      duration: workout.duration || workout.durationMinutes,
    }));
    // Log để debug YouTube URLs
    const workoutsWithYoutube = workouts.filter((w) => w.youtubeUrl);
    console.log(
      "📚 allWorkouts với YouTube URLs:",
      workouts.map((w) => ({
        title: w.title,
        youtubeUrl: w.youtubeUrl,
        hasYoutubeUrl: !!w.youtubeUrl,
        youtubeUrlType: typeof w.youtubeUrl,
      }))
    );
    console.log(
      "🎬 Workouts có YouTube URL:",
      workoutsWithYoutube.length,
      "tổng",
      workouts.length
    );
    if (workoutsWithYoutube.length > 0) {
      console.log(
        "📹 Chi tiết YouTube URLs:",
        workoutsWithYoutube.map((w) => ({
          title: w.title,
          url: w.youtubeUrl,
          thumbnail: getYouTubeThumbnail(w.youtubeUrl),
        }))
      );
    }
    return workouts;
  }, [allWorkoutsRaw]);

  // --- MỚI: Fetch danh sách bài tập đã hoàn thành của user ---
  const { data: userWorkouts = [], refetch: refetchUserWorkouts } = useQuery(
    "userWorkouts",
    async () => {
      try {
        const response = await api.get("/health/workouts");
        return response.data || [];
      } catch (error) {
        return [];
      }
    },
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const completed = useMemo(() => {
    return (userWorkouts || [])
      .filter((w) => w.completed === true)
      .map((w) => w.title);
  }, [userWorkouts]);

  // Statistics (SỬA: Tự tính toán từ userWorkouts thay vì dùng weeklyStats)
  const stats = useMemo(() => {
    const totalWorkouts = allWorkouts.length;
    const completedWorkoutsList = userWorkouts.filter((w) => w.completed === true);
    const completedCount = completedWorkoutsList.length;

    // Tính tổng calo và phút từ các bài tập đã hoàn thành
    const totalCalories = completedWorkoutsList.reduce((sum, w) => sum + (w.calories || 0), 0);
    const totalMinutes = completedWorkoutsList.reduce((sum, w) => sum + (w.durationMinutes || w.duration || 0), 0);

    return {
      totalWorkouts,
      completedCount,
      totalCalories,
      totalMinutes,
      completionRate:
        totalWorkouts > 0
          ? Math.round((completedCount / totalWorkouts) * 100)
          : 0,
      avgRating: 4.7, // Giữ nguyên mock
    };
  }, [allWorkouts, userWorkouts]);

  // Filters (Giữ nguyên logic)
  const filtered = useMemo(() => {
    return allWorkouts.filter((w) => {
      const matchesLevel = levelFilter === "All" || w.level === levelFilter;
      const matchesCategory =
        categoryFilter === "All" || w.category === categoryFilter;
      const matchesSearch =
        searchQuery === "" ||
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.instructor?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [allWorkouts, levelFilter, categoryFilter, searchQuery]);

  // --- MUTATION (Tạo/Cập nhật) ---
  // Mutation để đánh dấu hoàn thành - Tạo workout session từ library template
  const completeMutation = useMutation(
    async ({ workout, isCompleted }) => {
      try {
        // FIX: Use local date to avoid timezone mismatches
        const getLocalDate = () => {
          const now = new Date();
          const offset = now.getTimezoneOffset();
          const localDate = new Date(now.getTime() - (offset * 60 * 1000));
          return localDate.toISOString().split('T')[0];
        };
        const today = getLocalDate();

        const existingSessionsResponse = await api.get("/health/workouts");
        const allSessions = existingSessionsResponse.data || [];

        console.log(
          " Tìm session cho workout:",
          workout.title,
          "isCompleted:",
          isCompleted
        );

        // Tìm session hôm nay trước
        let existingSession = allSessions.find(
          (s) => s.title === workout.title && s.date === today
        );

        // Nếu không có session hôm nay, tìm session mới nhất (bất kỳ ngày nào)
        if (!existingSession) {
          const matchingSessions = allSessions.filter(
            (s) => s.title === workout.title
          );

          existingSession = matchingSessions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateB.getTime() !== dateA.getTime()) {
              return dateB.getTime() - dateA.getTime();
            }
            return (b.startTime || "").localeCompare(a.startTime || "");
          })[0];
        }

        if (existingSession) {
          // Cập nhật session đã tồn tại
          const result = await api.put(
            `/health/workouts/${existingSession.id}/complete`,
            { completed: isCompleted }
          );
          return result.data;
        } else if (isCompleted) {
          // Chỉ tạo session mới nếu đang đánh dấu hoàn thành
          const now = new Date().toTimeString().slice(0, 5) + ":00";
          const newSession = {
            title: workout.title,
            level: workout.level,
            durationMinutes: workout.duration || workout.durationMinutes,
            calories: workout.calories,
            date: today,
            startTime: now,
            thumbnail: workout.thumbnail,
            completed: true,
            description: workout.description,
            category: workout.category,
            instructor: workout.instructor,
            equipment: workout.equipment,
            difficulty: workout.difficulty,
            rating: workout.rating,
            youtubeUrl: workout.youtubeUrl,
          };
          const result = await api.post("/health/workouts", newSession);
          return result.data;
        } else {
          return null;
        }
      } catch (error) {
        console.error(" Error creating/updating workout session:", error);
        throw error;
      }
    },
    {
      onMutate: async ({ workout, isCompleted }) => {
        await queryClient.cancelQueries("userWorkouts");
        const previousUserWorkouts = queryClient.getQueryData("userWorkouts");
        queryClient.setQueryData("userWorkouts", (old = []) => {
          const exists = old.find((w) => w.title === workout.title);
          if (exists) {
            return old.map((w) =>
              w.title === workout.title ? { ...w, completed: isCompleted } : w
            );
          } else {
            return [
              ...old,
              {
                ...workout,
                id: `temp-${Date.now()}`,
                completed: isCompleted,
                date: new Date().toISOString().split("T")[0],
              },
            ];
          }
        });
        isCompleted
          ? notifications.workoutCompleted(workout?.title || "Bài tập")
          : notifications.workoutUncompleted(workout?.title || "Bài tập");
        return { previousUserWorkouts };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData("userWorkouts", context.previousUserWorkouts);
        notifications.actionFailed(
          t("fitnessAction") || "thực hiện thao tác fitness"
        );
      },
      onSettled: () => {
        setTimeout(() => {
          queryClient.invalidateQueries("userWorkouts");
        }, 1000);
      },
      onSuccess: (result) => {
        if (result) {
          queryClient.setQueryData("userWorkouts", (old = []) => {
            return old.map(w => w.title === result.title ? result : w);
          });
        }
      }
    }
  );

  const toggleComplete = (id) => {
    console.log(" toggleComplete được gọi với ID:", id);
    console.log(" completed array hiện tại:", completed);
    console.log(
      " allWorkouts:",
      allWorkouts.map((w) => ({ id: w.id, title: w.title }))
    );

    // FIX: Tìm workout bằng ID hoặc index
    const workout = allWorkouts.find((w) => {
      if (w.id === id) return true;
      // Nếu ID là temp-{index}, tìm bằng index
      if (id && id.toString().startsWith("temp-")) {
        const index = parseInt(id.toString().replace("temp-", ""));
        return allWorkouts.indexOf(w) === index;
      }
      return false;
    });

    if (!workout) {
      console.warn(" Không tìm thấy workout với ID:", id);
      return;
    }

    console.log(" Tìm thấy workout:", workout.title);

    // Kiểm tra xem đã hoàn thành chưa (dựa vào title)
    const isCurrentlyCompleted = completed.includes(workout.title);
    const isCompleted = !isCurrentlyCompleted; // Toggle: nếu đang completed thì hủy, nếu chưa thì đánh dấu

    console.log(" Trạng thái:", {
      workoutTitle: workout.title,
      isCurrentlyCompleted,
      willSetCompleted: isCompleted,
    });

    // GỌI API: Tạo hoặc cập nhật workout session
    completeMutation.mutate({ workout, isCompleted });
  };

  const startWorkout = async (workout) => {
    try {
      // Nếu có YouTube URL, mở video trong tab mới
      if (workout.youtubeUrl) {
        console.log(" Start workout - Mở YouTube URL:", workout.youtubeUrl);
        window.open(workout.youtubeUrl, "_blank", "noopener,noreferrer");
      } else {
        console.log(
          " Start workout - Không có YouTube URL, tạo session bình thường"
        );
      }

      // FIX: Kiểm tra xem đã có session hôm nay chưa để tránh duplicate
      const today = new Date().toISOString().split("T")[0];
      const existingSessions = await api.get("/health/workouts");
      const existingToday = existingSessions.data?.find(
        (s) => s.title === workout.title && s.date === today
      );

      if (existingToday) {
        // Đã có session hôm nay, chỉ cập nhật startTime
        const now = new Date().toTimeString().slice(0, 5) + ":00";
        await api.put(`/health/workouts/${existingToday.id}`, {
          startTime: now,
          completed: false,
        });
      } else {
        // Tạo workout session mới khi bắt đầu tập
        const now = new Date().toTimeString().slice(0, 5) + ":00";
        const newSession = {
          title: workout.title,
          level: workout.level,
          durationMinutes: workout.duration || workout.durationMinutes,
          calories: workout.calories,
          date: today,
          startTime: now,
          thumbnail: workout.thumbnail,
          completed: false,
          description: workout.description,
          category: workout.category,
          instructor: workout.instructor,
          equipment: workout.equipment,
          difficulty: workout.difficulty,
          rating: workout.rating,
          youtubeUrl: workout.youtubeUrl,
        };
        await api.post("/health/workouts", newSession);
      }

      queryClient.invalidateQueries("dashboardFitness");
      queryClient.invalidateQueries("userWorkouts");
      notifications.workoutStarted(workout.title);
    } catch (error) {
      console.error("Error starting workout:", error);
      notifications.actionFailed("bắt đầu bài tập");
    }
  };

  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < difficulty ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
  };

  // (Code variants giữ nguyên)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  // (JSX - return giữ nguyên)

  if (isLoadingWorkouts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Stats */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="h1 flex items-center">
              <HeartIcon className="w-8 h-8 mr-3 text-[var(--primary-600)]" />
              {t("myWorkouts") || "Bài tập của tôi"}
            </h1>
            <p className="subtitle mt-1">
              {t("fitnessExplore") || "Khám phá và theo dõi tiến độ."}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="p-2 hover:bg-[var(--neutral-100)] rounded-lg transition-colors"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
                <ListBulletIcon className="w-6 h-6 text-[var(--neutral-600)]" />
              ) : (
                <Squares2X2Icon className="w-6 h-6 text-[var(--neutral-600)]" />
              )}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              {t("filter") || "Lọc"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-700)] rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[var(--primary-600)]">
                {stats.completionRate}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">
              {t("completed") || "Hoàn thành"}
            </h3>
            <p className="text-sm text-[var(--neutral-600)]">
              {stats.completedCount}/{stats.totalWorkouts}{" "}
              {t("workouts") || "bài tập"}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-700)] rounded-xl flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[var(--accent-600)]">
                {stats.totalCalories}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">
              {t("caloriesBurned") || "Calo đốt cháy"}
            </h3>
            <p className="text-sm text-[var(--neutral-600)]">
              {t("caloriesIsBurned") || "Tổng calo đã đốt"}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#8B5CF6]">
                {stats.totalMinutes}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">
              {t("minutesExc") || "Phút tập luyện"}
            </h3>
            <p className="text-sm text-[var(--neutral-600)]">
              {t("totalMinutes") || "Tổng thời gian"}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#FACC15] rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#F59E0B]">
                {stats.avgRating}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">
              {t("avgRating") || "Đánh giá TB"}
            </h3>
            <p className="text-sm text-[var(--neutral-600)]">
              {t("avgScore") || "Điểm số trung bình"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--neutral-800)]">
                Bộ lọc và tìm kiếm
              </h3>
              <button
                className="p-2 hover:bg-[var(--neutral-100)] rounded-lg"
                onClick={() => setShowFilters(false)}
              >
                <XMarkIcon className="w-5 h-5 text-[var(--neutral-600)]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                <input
                  type="text"
                  placeholder={t("searchExc") || "Tìm kiếm bài tập"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>

              <select
                className="input"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l === "All"
                      ? t("all") + " " + t("level")
                      : t(l.toLowerCase())}
                  </option>
                ))}
              </select>

              <select
                className="input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? t("all") + " " + t("category") : c}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Grid/List */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="h2">
            {t("myWorkouts") || "Bài tập"} ({filtered.length})
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--neutral-600)]">
              {t("show") || "Hiển thị"}
            </span>
            <button
              className={`p-2 rounded-lg ${viewMode === "grid"
                ? "bg-[var(--primary-100)] text-[var(--primary-600)]"
                : "text-[var(--neutral-600)]"
                }`}
              onClick={() => setViewMode("grid")}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${viewMode === "list"
                ? "bg-[var(--primary-100)] text-[var(--primary-600)]"
                : "text-[var(--neutral-600)]"
                }`}
              onClick={() => setViewMode("list")}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((workout, index) => {
              // FIX: Kiểm tra trạng thái hoàn thành từ completed array (chính xác hơn)
              const isDone = completed.includes(workout.title);

              return (
                <motion.div
                  key={`workout-${workout.id || index}-${workout.title}`}
                  className="card p-6 relative group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDone && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 bg-[var(--status-healthy)] rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className="aspect-video rounded-xl mb-4 relative overflow-hidden cursor-pointer group flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (workout.youtubeUrl) {
                        console.log("🔗 Mở YouTube URL:", workout.youtubeUrl);
                        window.open(
                          workout.youtubeUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      } else {
                        console.warn(
                          " Không có YouTube URL cho workout:",
                          workout.title
                        );
                      }
                    }}
                  >
                    {workout.youtubeUrl ? (
                      <>
                        {getYouTubeThumbnail(workout.youtubeUrl) ? (
                          <img
                            src={getYouTubeThumbnail(workout.youtubeUrl)}
                            alt={workout.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(
                                " Lỗi load thumbnail:",
                                workout.youtubeUrl,
                                "Thumbnail URL:",
                                getYouTubeThumbnail(workout.youtubeUrl)
                              );
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              // Hiển thị fallback
                              const fallback =
                                e.target.parentElement.querySelector(
                                  ".youtube-fallback"
                                );
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <span className="text-white text-xs">No Thumb</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <PlayCircleIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                          <span>▶</span>
                          <span>YouTube</span>
                        </div>
                        {/* Fallback khi image không load được */}
                        <div
                          className="youtube-fallback absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] flex items-center justify-center text-6xl"
                          style={{ display: "none" }}
                        >
                          <span>{workout.thumbnail}</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] flex items-center justify-center text-6xl relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <span className="relative z-10">
                          {workout.thumbnail}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-[var(--neutral-800)] text-lg leading-tight">
                        {workout.title}
                      </h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-[var(--neutral-600)]">
                          {workout.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--neutral-600)] line-clamp-2">
                      {workout.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      <span className="badge badge-info text-xs">
                        {workout.level}
                      </span>
                      <span className="badge badge-neutral text-xs">
                        {workout.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[var(--neutral-600)]">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />{" "}
                          {workout.duration} phút
                        </span>
                        <span className="flex items-center">
                          <FireIcon className="w-4 h-4 mr-1" />{" "}
                          {workout.calories} cal
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getDifficultyStars(workout.difficulty)}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2 mt-auto">
                      <button
                        className="flex-1 btn btn-primary text-sm py-2.5"
                        onClick={() => startWorkout(workout)}
                        disabled={completeMutation.isLoading}
                        title={
                          workout.youtubeUrl
                            ? "Mở video YouTube"
                            : "Bắt đầu bài tập"
                        }
                      >
                        <PlayCircleIcon className="w-4 h-4 mr-1" />
                        {workout.youtubeUrl
                          ? "Watch Video"
                          : t("start") || "Bắt đầu"}
                      </button>
                      <button
                        className={`btn text-sm py-2.5 px-3 ${isDone ? "btn-success" : "btn-secondary"
                          }`}
                        onClick={() => toggleComplete(workout.id)}
                        disabled={completeMutation.isLoading}
                      >
                        {isDone ? "✓" : "○"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((workout, index) => {
              // FIX: Kiểm tra trạng thái hoàn thành từ completed array (chính xác hơn)
              const isDone = completed.includes(workout.title);

              return (
                <motion.div
                  key={`workout-${workout.id || index}-${workout.title}`}
                  className="card p-6 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (workout.youtubeUrl) {
                          console.log("🔗 Mở YouTube URL:", workout.youtubeUrl);
                          window.open(
                            workout.youtubeUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else {
                          console.warn(
                            "⚠️ Không có YouTube URL cho workout:",
                            workout.title
                          );
                        }
                      }}
                    >
                      {workout.youtubeUrl ? (
                        <>
                          <img
                            src={getYouTubeThumbnail(workout.youtubeUrl) || ""}
                            alt={workout.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(
                                "❌ Lỗi load thumbnail:",
                                workout.youtubeUrl
                              );
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              // Hiển thị fallback
                              const fallback =
                                e.target.parentElement.querySelector(
                                  ".youtube-fallback"
                                );
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                            <PlayCircleIcon className="w-6 h-6 text-white" />
                          </div>
                          {/* Fallback khi image không load được */}
                          <div
                            className="youtube-fallback absolute inset-0 w-full h-full bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] flex items-center justify-center text-3xl"
                            style={{ display: "none" }}
                          >
                            {workout.thumbnail}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] flex items-center justify-center text-3xl">
                          {workout.thumbnail}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-[var(--neutral-800)] text-lg">
                          {workout.title}
                        </h3>
                        {isDone && (
                          <CheckCircleIcon className="w-6 h-6 text-[var(--status-healthy)] flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-sm text-[var(--neutral-600)] mb-3 line-clamp-1">
                        {workout.description}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-[var(--neutral-600)]">
                        <span className="badge badge-info text-xs">
                          {workout.level}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />{" "}
                          {workout.duration} phút
                        </span>
                        <span className="flex items-center">
                          <FireIcon className="w-4 h-4 mr-1" />{" "}
                          {workout.calories} cal
                        </span>
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{workout.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        className="btn btn-primary text-sm py-2 px-4"
                        onClick={() => startWorkout(workout)}
                        disabled={completeMutation.isLoading}
                        title={
                          workout.youtubeUrl
                            ? "Mở video YouTube"
                            : "Bắt đầu bài tập"
                        }
                      >
                        <PlayCircleIcon className="w-4 h-4 mr-1" />
                        {workout.youtubeUrl
                          ? "Watch Video"
                          : t("start") || "Bắt đầu"}
                      </button>
                      <button
                        className={`btn text-sm py-2 px-3 ${isDone ? "btn-success" : "btn-secondary"
                          }`}
                        onClick={() => toggleComplete(workout.id)}
                        disabled={completeMutation.isLoading}
                      >
                        {isDone ? "✓" : "○"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div >


    </motion.div >
  );
};

export default NewFitness;
