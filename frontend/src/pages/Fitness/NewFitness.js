import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  BoltIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { notifications } from '../../utils/notifications';

const mockWorkouts = [
  { 
    id: 1, 
    title: 'Cardio buổi sáng', 
    level: 'Beginner', 
    duration: 10, 
    calories: 80, 
    category: 'Cardio', 
    thumbnail: '🏃',
    description: 'Khởi động ngày mới với bài tập cardio nhẹ nhàng',
    difficulty: 2,
    rating: 4.5,
    instructor: 'Coach Anna',
    equipment: 'Không cần dụng cụ',
    benefits: ['Tăng cường tim mạch', 'Đốt cháy calo', 'Năng lượng tích cực']
  },
  { 
    id: 2, 
    title: 'HIIT toàn thân', 
    level: 'Intermediate', 
    duration: 20, 
    calories: 200, 
    category: 'HIIT', 
    thumbnail: '💪',
    description: 'Bài tập cường độ cao giúp đốt cháy mỡ thừa hiệu quả',
    difficulty: 4,
    rating: 4.8,
    instructor: 'Coach Mike',
    equipment: 'Thảm tập',
    benefits: ['Đốt cháy mỡ', 'Tăng sức bền', 'Xây dựng cơ bắp']
  },
  { 
    id: 3, 
    title: 'Yoga thư giãn', 
    level: 'Beginner', 
    duration: 15, 
    calories: 60, 
    category: 'Yoga', 
    thumbnail: '🧘',
    description: 'Thư giãn tinh thần và cơ thể với các tư thế yoga cơ bản',
    difficulty: 1,
    rating: 4.7,
    instructor: 'Coach Sarah',
    equipment: 'Thảm yoga',
    benefits: ['Giảm stress', 'Tăng độ dẻo dai', 'Cải thiện tư thế']
  },
  { 
    id: 4, 
    title: 'Sức mạnh cơ bản', 
    level: 'Intermediate', 
    duration: 25, 
    calories: 180, 
    category: 'Strength', 
    thumbnail: '🏋️',
    description: 'Xây dựng cơ bắp và sức mạnh với các bài tập cơ bản',
    difficulty: 3,
    rating: 4.6,
    instructor: 'Coach David',
    equipment: 'Tạ tay, ghế',
    benefits: ['Tăng cơ bắp', 'Cải thiện sức mạnh', 'Tăng mật độ xương']
  },
  { 
    id: 5, 
    title: 'Stretching buổi tối', 
    level: 'Beginner', 
    duration: 10, 
    calories: 40, 
    category: 'Stretch', 
    thumbnail: '🤸',
    description: 'Thư giãn cơ thể sau một ngày làm việc với các động tác kéo giãn',
    difficulty: 1,
    rating: 4.4,
    instructor: 'Coach Lisa',
    equipment: 'Không cần dụng cụ',
    benefits: ['Giảm căng cơ', 'Cải thiện lưu thông máu', 'Ngủ ngon hơn']
  },
  { 
    id: 6, 
    title: 'Cardio nâng cao', 
    level: 'Advanced', 
    duration: 30, 
    calories: 300, 
    category: 'Cardio', 
    thumbnail: '🚴',
    description: 'Thử thách bản thân với bài tập cardio cường độ cao',
    difficulty: 5,
    rating: 4.9,
    instructor: 'Coach Tom',
    equipment: 'Máy chạy bộ, xe đạp',
    benefits: ['Tăng sức bền', 'Đốt cháy nhiều calo', 'Cải thiện tim mạch']
  },
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All', 'Cardio', 'HIIT', 'Yoga', 'Strength', 'Stretch'];

const NewFitness = () => {
  const { t, language } = useLanguage();
  const [levelFilter, setLevelFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [completed, setCompleted] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalWorkouts = mockWorkouts.length;
    const completedCount = completed.length;
    const totalCalories = mockWorkouts
      .filter(w => completed.includes(w.id))
      .reduce((sum, w) => sum + w.calories, 0);
    const totalMinutes = mockWorkouts
      .filter(w => completed.includes(w.id))
      .reduce((sum, w) => sum + w.duration, 0);
    
    return {
      totalWorkouts,
      completedCount,
      totalCalories,
      totalMinutes,
      completionRate: totalWorkouts > 0 ? Math.round((completedCount / totalWorkouts) * 100) : 0
    };
  }, [completed]);

  const filtered = useMemo(() => {
    return mockWorkouts.filter(w => {
      const matchesLevel = levelFilter === 'All' || w.level === levelFilter;
      const matchesCategory = categoryFilter === 'All' || w.category === categoryFilter;
      const matchesSearch = searchQuery === '' || 
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [levelFilter, categoryFilter, searchQuery]);

  const toggleComplete = (id) => {
    const workout = mockWorkouts.find(w => w.id === id);
    const isCompleting = !completed.includes(id);
    
    setCompleted(prev => 
      isCompleting ? [...prev, id] : prev.filter(x => x !== id)
    );
    
    if (isCompleting && workout) {
      notifications.workoutCompleted(workout.title);
    } else if (workout) {
      notifications.workoutUncompleted(workout.title);
    }
  };

  const startWorkout = (workout) => {
    notifications.workoutStarted(workout.title);
  };

  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        className={`w-4 h-4 ${i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
              {t('myWorkouts')}
            </h1>
            <p className="subtitle mt-1">{t('fitnessExplore')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="p-2 hover:bg-[var(--neutral-100)] rounded-lg transition-colors"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
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
              {t('filter')}
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
              <span className="text-2xl font-bold text-[var(--primary-600)]">{stats.completionRate}%</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">{t('completed')}</h3>
            <p className="text-sm text-[var(--neutral-600)]">{stats.completedCount}/{stats.totalWorkouts} {t('workouts')}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-700)] rounded-xl flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[var(--accent-600)]">{stats.totalCalories}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">{t('caloriesBurned')}</h3>
            <p className="text-sm text-[var(--neutral-600)]">{t('caloriesIsBurned')}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#8B5CF6]">{stats.totalMinutes}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">{t('minutesExc')}</h3>
            <p className="text-sm text-[var(--neutral-600)]">{t('totalMinutes')}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#FACC15] rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#F59E0B]">4.7</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--neutral-800)] mb-1">{t('avgRating')}</h3>
            <p className="text-sm text-[var(--neutral-600)]">{t('avgScore')}</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--neutral-800)]">Bộ lọc và tìm kiếm</h3>
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
                  placeholder= {t('searchExc')}
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
                {levels.map(l => (
                  <option key={l} value={l}>
                    {l === 'All' ? t('all') + ' ' + t('level') : t(l.toLowerCase())}
                  </option>
                ))}
              </select>
              
              <select 
                className="input" 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c === 'All' ? t('all') + ' ' + t('category') : c}
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
          <h2 className="h2">{t('myWorkouts')} ({filtered.length})</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--neutral-600)]">{t('show')}</span>
            <button
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : 'text-[var(--neutral-600)]'}`}
              onClick={() => setViewMode('grid')}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : 'text-[var(--neutral-600)]'}`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(workout => {
              const isDone = completed.includes(workout.id);
              return (
                <motion.div
                  key={workout.id}
                  className="card p-6 relative group hover:shadow-xl transition-all duration-300"
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
                  
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] mb-4 flex items-center justify-center text-6xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <span className="relative z-10">{workout.thumbnail}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-[var(--neutral-800)] text-lg leading-tight">{workout.title}</h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-[var(--neutral-600)]">{workout.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[var(--neutral-600)] line-clamp-2">{workout.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="badge badge-info text-xs">{workout.level}</span>
                      <span className="badge badge-neutral text-xs">{workout.category}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-[var(--neutral-600)]">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" /> {workout.duration} phút
                        </span>
                        <span className="flex items-center">
                          <FireIcon className="w-4 h-4 mr-1" /> {workout.calories} cal
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getDifficultyStars(workout.difficulty)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button 
                        className="flex-1 btn btn-primary text-sm py-2.5" 
                        onClick={() => startWorkout(workout)}
                      >
                        <PlayCircleIcon className="w-4 h-4 mr-1" /> {t('start')}
                      </button>
                      <button
                        className={`btn text-sm py-2.5 px-3 ${isDone ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => toggleComplete(workout.id)}
                      >
                        {isDone ? '✓' : '○'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(workout => {
              const isDone = completed.includes(workout.id);
              return (
                <motion.div
                  key={workout.id}
                  className="card p-6 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary-100)] to-[var(--accent-100)] flex items-center justify-center text-3xl flex-shrink-0">
                      {workout.thumbnail}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-[var(--neutral-800)] text-lg">{workout.title}</h3>
                        {isDone && (
                          <CheckCircleIcon className="w-6 h-6 text-[var(--status-healthy)] flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-[var(--neutral-600)] mb-3 line-clamp-1">{workout.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-[var(--neutral-600)]">
                        <span className="badge badge-info text-xs">{workout.level}</span>
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" /> {workout.duration} phút
                        </span>
                        <span className="flex items-center">
                          <FireIcon className="w-4 h-4 mr-1" /> {workout.calories} cal
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
                      >
                        <PlayCircleIcon className="w-4 h-4 mr-1" /> {t('start')}
                      </button>
                      <button
                        className={`btn text-sm py-2 px-3 ${isDone ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => toggleComplete(workout.id)}
                      >
                        {isDone ? '✓' : '○'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Weekly Progress */}
      <motion.div variants={itemVariants}>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="h2 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2 text-[var(--primary-600)]" />
              {t('weeklyProgress')}
            </h2>
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-[var(--status-healthy)]" />
              <span className="text-sm font-medium text-[var(--status-healthy)]">+12% so với tuần trước</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {(language === 'vi' ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((day, i) => {
              const done = i < 3;
              const isToday = i === new Date().getDay() - 1;
              return (
                <div key={day} className="text-center">
                  <div className={`w-full aspect-square rounded-xl flex items-center justify-center mb-2 relative ${
                    done 
                      ? 'bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-600)] shadow-lg' 
                      : 'bg-[var(--neutral-100)]'
                  } ${isToday ? 'ring-2 ring-[var(--primary-600)] ring-offset-2' : ''}`}>
                    {done && <CheckCircleIcon className="w-8 h-8 text-white" />}
                    {isToday && !done && (
                      <div className="w-3 h-3 bg-[var(--primary-600)] rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[var(--neutral-600)]">{day}</p>
                  {isToday && (
                    <p className="text-xs text-[var(--primary-600)] font-medium mt-1">{t('today')}</p>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-[var(--primary-50)] to-[var(--accent-50)] rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--neutral-800)]">{t('weekgoal')}</h3>
                <p className="text-sm text-[var(--neutral-600)]">Hoàn thành 5 bài tập</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--primary-600)]">3/5</div>
                <div className="w-24 h-2 bg-[var(--neutral-200)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewFitness;

