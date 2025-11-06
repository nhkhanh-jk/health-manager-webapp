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

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || 'Nam',
    bloodGroup: user?.bloodGroup || '',
    height: user?.height || '',
    weight: user?.weight || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = async () => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      updateUser({ ...user, ...formData });
      notifications.profileUpdated();
      setIsEditing(false);
    } catch (e) {
      notifications.actionFailed('cập nhật hồ sơ');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      age: user?.age || '',
      gender: user?.gender || 'Nam',
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
            <button className="btn btn-secondary" onClick={handleCancel}>
              <XMarkIcon className="w-5 h-5 mr-2" />
              {t('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <CheckIcon className="w-5 h-5 mr-2" />
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
              disabled={!isEditing}
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

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="h3 mb-6">{t('changePassword')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('currentPassword')}</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('newPassword')}</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--neutral-700)] mb-2">{t('confirmPassword')}</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="mt-6">
          <button
            className="btn btn-primary"
            onClick={() => notifications.passwordChanged()}
          >
            {t('changePassword')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

