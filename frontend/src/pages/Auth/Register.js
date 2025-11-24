import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';
// --- MỚI: Thêm Spinner ---
import LoadingSpinner from '../../components/UI/LoadingSpinner'; 
// --- HẾT CODE MỚI ---

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  // --- SỬA LỖI: Đổi 'password' thành 'matKhau' để khớp backend ---
  const password = watch('matKhau'); 
  // const password = watch('password'); // --- CŨ ---

  const onSubmit = async (data) => {
    
    setIsLoading(true);
    const result = await registerUser(data); // data bây giờ sẽ có { ho, ten, matKhau, ... }

    if (result.success) {
      //navigate('/dashboard'); 
    } else {
      const errorMessage = result.error || t('registrationError');
      
      if (errorMessage.includes('Email đã được sử dụng') || errorMessage.includes('email already exists')) {
          setError('email', { 
              type: 'manual', 
              message: errorMessage 
          });
      }
      toast.error(errorMessage);

    } 

    setIsLoading(false);
    
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/image0.jpg')" }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            className="flex flex-col items-center -mb-20 -mt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
              <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-80 h-80 object-contain"
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-teal-600 drop-shadow-md mb-2">
            {t('createAccount')}
          </h1>
        </div>

        {/* Registration Form */}
        <motion.div
          className="card p-8"
          style={{
            backgroundColor: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* --- SỬA LỖI: Đổi 'firstName' -> 'ho' --- */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  {t('firstName')}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                  <input
                    {...register('ho', { required: t('firstNameRequired') })}
                    className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                    placeholder={t('enterFirstName')}
                  />
                </div>
                {errors.ho && (
                  <p className="text-[var(--status-danger)] text-xs mt-1">{errors.ho.message}</p>
                )}
              </div>

              {/* --- SỬA LỖI: Đổi 'lastName' -> 'ten' --- */}
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  {t('lastName')}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                  <input
                    {...register('ten', { required: t('lastNameRequired') })}
                    className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                    placeholder={t('enterLastName')}
                  />
                </div>
                {errors.ten && (
                  <p className="text-[var(--status-danger)] text-xs mt-1">{errors.ten.message}</p>
                )}
              </div>
            </div>

            {/* Email (Đã đúng) */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                <input
                  {...register('email', {
                    required: t('emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('invalidEmail')
                    }
                  })}
                  type="email"
                  className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                  placeholder={t('enterEmail')}
                />
              </div>
              {errors.email && (
                <p className="text-[var(--status-danger)] text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* --- SỬA LỖI: Đổi 'password' -> 'matKhau' --- */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                {t('Password')}
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                <input
                  {...register('matKhau', {
                    required: t('passwordRequired'),
                    minLength: {
                      value: 6,
                      message: t('passwordMinLength')
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                  placeholder={t('enterPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-400)] hover:text-[var(--neutral-600)]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.matKhau && (
                <p className="text-[var(--status-danger)] text-xs mt-1">{errors.matKhau.message}</p>
              )}
            </div>

            {/* --- SỬA LỖI: Đổi 'confirmPassword' -> 'xacNhanMatKhau' (và logic validate) --- */}
            <div>
              <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                {t('confirmPassword')}
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--neutral-400)]" />
                <input
                  {...register('xacNhanMatKhau', {
                    required: t('confirmPasswordRequired'),
                    validate: value => value === password || t('passwordsDoNotMatch') // 'password' này là biến watch('matKhau') ở trên
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full border border-gray-200 rounded-lg py-3 pl-10 pr-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                  placeholder={t('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-400)] hover:text-[var(--neutral-600)]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.xacNhanMatKhau && (
                <p className="text-[var(--status-danger)] text-xs mt-1">{errors.xacNhanMatKhau.message}</p>
              )}
            </div>

            {/* --- SỬA LỖI: Đổi 'age' -> 'tuoi' và 'gender' -> 'gioiTinh' --- */}
            <div className="grid grid-cols-2 gap-4">
              {/* age */}
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  {t('age')}
                </label>
                <input
                  {...register('tuoi', { 
                    required: t('ageRequired'),
                    valueAsNumber: true, // Đảm bảo gửi đi là số
                    min: { value: 1, message: t('invalidAge') },
                    max: { value: 120, message: t('invalidAge') }
                  })}
                  type="number"
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 text-[var(--neutral-800)] placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 [appearance:textfield]"
                  placeholder={t('inputAge')}
                />
                {errors.tuoi && (
                  <p className="text-[var(--status-danger)] text-xs mt-1">{errors.tuoi.message}</p>
                )}
              </div>

              {/* gender */}
              <div>
                <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">
                  {t('gender')}
                </label>
                <select
                  {...register('gioiTinh', { required: t('genderRequired') })}
                  className="w-full border border-gray-200 rounded-lg py-3 px-4 text-[var(--neutral-800)] placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                >  
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="other">{t('other')}</option>
                </select>
                {errors.gioiTinh && (
                  <p className="text-[var(--status-danger)] text-xs mt-1">{errors.gioiTinh.message}</p>
                )}
              </div>
            </div>
            {/* --- HẾT SỬA LỖI --- */}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-br from-sky-300 to-blue-400 text-white font-medium py-3 rounded-lg shadow-md hover:from-sky-400 hover:to-blue-500 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                // --- SỬA LỖI: Dùng Spinner thay vì div xoay ---
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>{t('createAcc')}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-[var(--neutral-600)]">
              {t('alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium hover:underline"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {t('signIn')}
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
