import React, { useState } from "react";
import {
  BellIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { notifications } from "../../utils/notifications";

import { useAuth } from "../../contexts/AuthContext";

const Settings = () => {
  const { deleteUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const [isDeleting, setIsDeleting] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    reminders: true,
    workouts: true,
    measurements: true,
    aiSuggestions: false,
  });

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    notifications.languageChanged(lang);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    notifications.themeChanged(theme === "light" ? "dark" : "light");
  };

  const handleNotificationToggle = (key) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    notifications.settingsSaved();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("confirmDeleteAccount"))) {
      // Cần thêm key này vào file ngôn ngữ
      return; // Hủy nếu người dùng không xác nhận
    }

    setIsDeleting(true);

    const result = await deleteUser();

    // Nếu xóa không thành công (ví dụ: lỗi mạng, lỗi server), hiển thị thông báo
    if (!result.success) {
      notifications.actionFailed(result.error || t("deleteAccount"));
    }

    setIsDeleting(false);
    // Lưu ý: Nếu thành công, AuthContext đã gọi logout() và chuyển hướng.
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="h1">{t("settings")}</h1>
        <p className="subtitle mt-1">{t("customizeExperience")}</p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="h3 mb-6 flex items-center">
          <SunIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
          {t("appearance")}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)]">
            <div>
              <p className="font-semibold text-[var(--neutral-800)]">
                {t("theme")}
              </p>
              <p className="text-sm text-[var(--neutral-500)]">
                {t("themeDescription")}
              </p>
            </div>
            <button
              className={`relative w-16 h-8 rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-[var(--primary-600)]"
                  : "bg-[var(--neutral-300)]"
              }`}
              onClick={handleThemeToggle}
            >
              <div
                className={`absolute top-1 ${
                  theme === "dark" ? "right-1" : "left-1"
                } w-6 h-6 bg-white rounded-full transition-all shadow-md flex items-center justify-center`}
              >
                {theme === "dark" ? (
                  <MoonIcon className="w-4 h-4 text-[var(--primary-600)]" />
                ) : (
                  <SunIcon className="w-4 h-4 text-[var(--neutral-600)]" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="card p-6">
        <h2 className="h3 mb-6 flex items-center">
          <GlobeAltIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
          {t("language")} / Language
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              language === "vi"
                ? "border-[var(--primary-600)] bg-[var(--primary-50)]"
                : "border-[var(--neutral-200)] hover:border-[var(--neutral-300)]"
            }`}
            onClick={() => handleLanguageChange("vi")}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-semibold text-[var(--neutral-800)]">
                  {t("vietnamese")}
                </p>
                <p className="text-sm text-[var(--neutral-500)]">Vietnamese</p>
              </div>
              {language === "vi" && (
                <CheckIcon className="w-6 h-6 text-[var(--primary-600)]" />
              )}
            </div>
          </button>
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              language === "en"
                ? "border-[var(--primary-600)] bg-[var(--primary-50)]"
                : "border-[var(--neutral-200)] hover:border-[var(--neutral-300)]"
            }`}
            onClick={() => handleLanguageChange("en")}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-semibold text-[var(--neutral-800)]">
                  {t("english")}
                </p>
                <p className="text-sm text-[var(--neutral-500)]">English</p>
              </div>
              {language === "en" && (
                <CheckIcon className="w-6 h-6 text-[var(--primary-600)]" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="h3 mb-6 flex items-center">
          <BellIcon className="w-5 h-5 mr-2 text-[var(--primary-600)]" />
          {t("notifications")}
        </h2>
        <div className="space-y-4">
          {Object.entries({
            reminders: t("medicationReminders"),
            workouts: t("workoutNotifications"),
            measurements: t("measurementNotifications"),
            aiSuggestions: t("aiSuggestions"),
          }).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg bg-[var(--neutral-50)] border border-[var(--neutral-200)]"
            >
              <div>
                <p className="font-semibold text-[var(--neutral-800)]">
                  {label}
                </p>
                <p className="text-sm text-[var(--neutral-500)]">
                  {notificationPrefs[key] ? t("enabled") : t("disabled")}
                </p>
              </div>
              <button
                className={`relative w-16 h-8 rounded-full transition-colors ${
                  notificationPrefs[key]
                    ? "bg-[var(--status-healthy)]"
                    : "bg-[var(--neutral-300)]"
                }`}
                onClick={() => handleNotificationToggle(key)}
              >
                <div
                  className={`absolute top-1 ${
                    notificationPrefs[key] ? "right-1" : "left-1"
                  } w-6 h-6 bg-white rounded-full transition-all shadow-md`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-2 border-red-200">
        <h2 className="h3 mb-4 text-[var(--status-danger)]">
          {t("dangerZone")}
        </h2>
        <p className="text-sm text-[var(--neutral-600)] mb-4">
          {t("deleteAccountWarning")}
        </p>
        {/* <button className="btn btn-danger">
          {t('deleteAccount')}
        </button> */}
        <button
          className="btn btn-danger"
          onClick={handleDeleteAccount} // <--- GẮN HÀM MỚI
          disabled={isDeleting} // <--- VÔ HIỆU HÓA KHI ĐANG XÓA
        >
          {isDeleting ? "..." : t("deleteAccount")}
        </button>
      </div>
    </div>
  );
};

export default Settings;
