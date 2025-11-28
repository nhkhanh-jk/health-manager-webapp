import React, { useState } from 'react';
import {
  CameraIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { notifications } from '../../utils/notifications';
// --- MỚI: Import Loading Spinner ---
import LoadingSpinner from '../../components/UI/LoadingSpinner'; 
// --- HẾT CODE MỚI ---

const Profile = () => {
  // const { user, updateUser } = useAuth();
  const { user, updateUser, updatePassword } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  // --- MỚI: Thêm state loading ---
  const [isSaving, setIsSaving] = useState(false);
  // --- HẾT CODE MỚI ---

  const [passwordData, setPasswordData] = useState({
      currentPassword: '', 
      newPassword: '',
      confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sử dụng tên trường của Frontend để tiện quản lý state
  const [formData, setFormData] = useState({
    firstName: user?.ho || '',
    lastName: user?.ten || '',
    email: user?.email || '',
    age: user?.tuoi || 0, // Dùng user?.tuoi
    gender: user?.gioiTinh || 'Nam', // Dùng user?.gioiTinh
    bloodGroup: user?.bloodGroup || '',
    height: user?.height || '',
    weight: user?.weight || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // --- SỬA LỖI LƯU: Xóa mock call và thêm API call thật ---
  const handleSave = async () => {
    setIsSaving(true);
    
    // 1. Map dữ liệu từ Frontend sang tên trường Backend
    const payload = {
      id: user?.id,
      ho: formData.firstName,
      ten: formData.lastName,
      email: formData.email, // Email không nên thay đổi
      tuoi: parseInt(formData.age), // Đảm bảo là số nguyên
      gioiTinh: formData.gender,
      bloodGroup: formData.bloodGroup,
      height: formData.height,
      weight: formData.weight,
      phone: formData.phone,
      address: formData.address,
    };

    // 2. Gọi hàm updateUser (sẽ được sửa trong AuthContext.js)
    try {
      const result = await updateUser(payload);

      if (result.success) {
        notifications.profileUpdated();
        setIsEditing(false);
      } else {
        notifications.actionFailed(result.error || t('updateProfile'));
      }
      
    } catch (e) {
      notifications.actionFailed(t('updateProfile') + ': ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };
  // --- HẾT SỬA LỖI LƯU ---

  // --- THÊM HÀM XỬ LÝ INPUT MẬT KHẨU ---
   const handlePasswordChange = (e) => {
     setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
   };
// ------------------------------------

// --- THÊM HÀM XỬ LÝ ĐỔI MẬT KHẨU ---
   const handleChangePassword = async () => {
     const { currentPassword, newPassword, confirmPassword } = passwordData;

     if (newPassword.length < 6) {
        return notifications.warning(t('passwordLengthError'));
     }
     if (newPassword !== confirmPassword) {
        return notifications.warning(t('passwordMismatch'));
     }
     if (!currentPassword) { // <-- THÊM KIỂM TRA MẬT KHẨU HIỆN TẠI
        return notifications.warning(t('currentPasswordRequired')); 
        // (Bạn cần thêm key 'currentPasswordRequired' vào file ngôn ngữ)
    }

     setIsChangingPassword(true);

     try {
        const result = await updatePassword(currentPassword, newPassword);

        if (result.success) {
          // Reset form sau khi thành công (AuthContext đã xử lý logout)
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          if (result.error && result.error.includes("Mật khẩu hiện tại không chính xác")) {
        // Hiển thị thông báo rõ ràng, không bị thêm tiền tố "Không thể..."
            notifications.warning("Mật khẩu hiện tại không chính xác!"); 
        } else {
            // Dùng actionFailed cho các lỗi chung khác
            notifications.actionFailed(result.error || t('changePassword'));
    }
        }

     } catch (e) {
        notifications.actionFailed(t('changePassword') + ': ' + e.message);
     } finally {
        setIsChangingPassword(false);
     }
   };

  const handleCancel = () => {
    // Đảm bảo lấy lại dữ liệu mới nhất từ user context khi hủy
    setFormData({
      firstName: user?.ho || '',
      lastName: user?.ten || '',
      email: user?.email || '',
      age: user?.tuoi || 0,
      gender: user?.gioiTinh || 'Nam',
      bloodGroup: user?.bloodGroup || '',
      height: user?.height || '',
      weight: user?.weight || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="h1">{t('myProfile')}</h1>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <PencilSquareIcon className="w-5 h-5 mr-2" />
            {t('edit')}
          </button>
        ) : (
          <div className="flex space-x-3">
            <button className="btn btn-secondary" onClick={handleCancel} disabled={isSaving}>
              <XMarkIcon className="w-5 h-5 mr-2" />
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <LoadingSpinner size="sm" /> : <CheckIcon className="w-5 h-5 mr-2" />}
              {t('save')}
            </button>
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <div className="card p-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-600)] flex items-center justify-center text-white text-4xl font-bold">
              {/* --- SỬA LỖI: Dùng ho, ten --- */}
              {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
            </div>
            <button
              className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              onClick={() => notifications.avatarUpdated()}
            >
              <CameraIcon className="w-5 h-5 text-[var(--neutral-600)]" />
            </button>
          </div>
          <div>
            <h2 className="h2">{formData.firstName} {formData.lastName}</h2>
            <p className="subtitle mt-1">{formData.email}</p>
            <div className="flex space-x-3 mt-3">
              <span className="badge badge-info">ID: {user?.id || 'N/A'}</span>
              <span className="badge badge-healthy">{t('active')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card p-6">
        <h3 className="h3 mb-6">{t('personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('firstName')}</label>
            <input
              className="input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('lastName')}</label>
            <input
              className="input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">Email</label>
            <input
              className="input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={true} // Email không cho phép sửa
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('phone')}</label>
            <input
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              placeholder={t('enterPhone')}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('address')}</label>
            <input
              className="input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              placeholder={t('enterAddress')}
            />
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="card p-6">
        <h3 className="h3 mb-6">{t('healthInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('age')}</label>
            <input
              className="input"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('gender')}</label>
            <select
              className="input"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              disabled={!isEditing}
            >
              <option value="Nam">{t('male')}</option>
              <option value="Nữ">{t('female')}</option>
              <option value="Khác">{t('other')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('bloodGroup')}</label>
            <select
              className="input"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              disabled={!isEditing}
            >
              <option value="">{t('selectBloodGroup')}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('height')} ({t('cm')})</label>
            <input
              className="input"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              disabled={!isEditing}
              placeholder="170"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('weight')} ({t('kg')})</label>
            <input
              className="input"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              disabled={!isEditing}
              placeholder="70.0"
            />
          </div>
        </div>
      </div>

      {/* Change Password (Giữ nguyên) */}
      <div className="card p-6">
        <h3 className="h3 mb-6">{t('changePassword')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('currentPassword')}</label>
            {/* <input className="input" type="password" placeholder="••••••••" /> */}
            <input 
                className="input" 
                type="password" 
                name="currentPassword" // <--- THÊM NAME
                value={passwordData.currentPassword} // <--- THÊM VALUE
                onChange={handlePasswordChange} // <--- THÊM ONCHANGE
                placeholder="••••••••" 
                disabled={isChangingPassword} // <--- THÊM DISABLED
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('newPassword')}</label>
            {/* <input className="input" type="password" placeholder="••••••••" /> */}
            <input 
                className="input" 
                type="password" 
                name="newPassword" // <--- THÊM NAME
                value={passwordData.newPassword} // <--- THÊM VALUE
                onChange={handlePasswordChange} // <--- THÊM ONCHANGE
                placeholder="••••••••"
                disabled={isChangingPassword} // <--- THÊM DISABLED
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('confirmPassword')}</label>
            {/* <input className="input" type="password" placeholder="••••••••" /> */}
            <input 
                className="input" 
                type="password" 
                name="confirmPassword" // <--- THÊM NAME
                value={passwordData.confirmPassword} // <--- THÊM VALUE
                onChange={handlePasswordChange} // <--- THÊM ONCHANGE
                placeholder="••••••••" 
                disabled={isChangingPassword} // <--- THÊM DISABLED
            />
          </div>
        </div>
        <div className="mt-6">
          {/* <button
            className="btn btn-primary"
            onClick={() => notifications.passwordChanged()}
          >
            {t('changePassword')}
          </button> */}
          <button
             className="btn btn-primary"
             onClick={handleChangePassword} // <--- SỬA DÒNG NÀY
            disabled={isChangingPassword} // <--- THÊM DISABLED
          >
             {isChangingPassword ? <LoadingSpinner size="sm" /> : t('changePassword')} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;