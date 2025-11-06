import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ScissorsIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';
import axios from 'axios';

const MedicalHistoryOverview = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockData = useMemo(() => [
    {
      id: 1,
      date: '2024-12-01',
      title: t('medicalHistory.checkup'),
      notes: t('medicalHistory.checkupNotes'),
      status: 'completed',
      type: 'checkup'
    },
    {
      id: 2,
      date: '2024-11-15',
      title: t('medicalHistory.vaccination'),
      notes: t('medicalHistory.vaccinationNotes'),
      status: 'completed',
      type: 'vaccination'
    },
    {
      id: 3,
      date: '2024-10-20',
      title: t('medicalHistory.headache'),
      notes: t('medicalHistory.headacheNotes'),
      status: 'ongoing',
      type: 'symptom'
    },
    {
      id: 4,
      date: '2024-09-10',
      title: t('medicalHistory.allergy'),
      notes: t('medicalHistory.allergyNotes'),
      status: 'resolved',
      type: 'allergy'
    },
    {
      id: 5,
      date: '2024-08-05',
      title: t('medicalHistory.surgery'),
      notes: t('medicalHistory.surgeryNotes'),
      status: 'completed',
      type: 'surgery'
    }
  ], [t]);

  const loadMedicalHistory = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API, fallback to mock data
      try {
        const response = await axios.get('/health/history');
        setMedicalHistory(response.data.items || []);
      } catch (error) {
        console.log('Using mock data for Medical History');
        setMedicalHistory(mockData);
      }
    } catch (error) {
      console.error('Error loading medical history:', error);
      setMedicalHistory(mockData);
    } finally {
      setLoading(false);
    }
  }, [mockData]);

  useEffect(() => {
    loadMedicalHistory();
  }, [loadMedicalHistory]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'green', icon: CheckCircleIcon, text: t('medicalHistory.completed') };
      case 'ongoing':
        return { color: 'yellow', icon: ClockIcon, text: t('medicalHistory.ongoing') };
      case 'resolved':
        return { color: 'blue', icon: CheckCircleIcon, text: t('medicalHistory.resolved') };
      default:
        return { color: 'gray', icon: ExclamationTriangleIcon, text: t('medicalHistory.unknown') };
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case 'checkup':
        return { color: 'blue', text: t('medicalHistory.typeCheckup') };
      case 'vaccination':
        return { color: 'green', text: t('medicalHistory.typeVaccination') };
      case 'symptom':
        return { color: 'red', text: t('medicalHistory.typeSymptom') };
      case 'allergy':
        return { color: 'yellow', text: t('medicalHistory.typeAllergy') };
      case 'surgery':
        return { color: 'purple', text: t('medicalHistory.typeSurgery') };
      default:
        return { color: 'gray', text: t('medicalHistory.typeOther') };
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ date: '', title: '', notes: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      title: item.title,
      notes: item.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`/health/history/${editingItem.id}`, formData);
      } else {
        await axios.post('/health/history', formData);
      }
      await loadMedicalHistory();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving medical history:', error);
      // In demo mode, just update local state
      if (editingItem) {
        setMedicalHistory(prev => prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, ...formData }
            : item
        ));
      } else {
        const newItem = {
          id: Date.now(),
          ...formData,
          status: 'completed',
          type: 'checkup'
        };
        setMedicalHistory(prev => [newItem, ...prev]);
      }
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('medicalHistory.confirmDelete'))) {
      try {
        await axios.delete(`/health/history/${id}`);
        await loadMedicalHistory();
      } catch (error) {
        console.error('Error deleting medical history:', error);
        // In demo mode, just update local state
        setMedicalHistory(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl p-6 shadow-sm ${
          theme === 'dark' 
            ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)]' 
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {t('medicalHistory.title')}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {t('medicalHistory.subtitle')}
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <PlusIcon className="w-5 h-5 mr-2" /> {t('medicalHistory.addNew')}
          </button>
          {/* <Button
            onClick={openCreateModal}
            className="flex items-center space-x-2"
            icon={PlusIcon}
          >
            {t('medicalHistory.addNew')}
          </Button> */}
{/* 
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <PlusIcon className="w-5 h-5 mr-2" /> {t('createReminder')}
          </button> */}

        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
            theme === 'dark' 
              ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)]' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-700)] flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{t('medicalHistory.total')}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {medicalHistory.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
            theme === 'dark' 
              ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)]' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-600)] to-[var(--accent-700)] flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{t('medicalHistory.completed')}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {medicalHistory.filter(item => item.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
            theme === 'dark' 
              ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)]' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{t('medicalHistory.ongoing')}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {medicalHistory.filter(item => item.status === 'ongoing').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <div className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
            theme === 'dark' 
              ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)]' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FACC15] flex items-center justify-center">
                <ScissorsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{t('medicalHistory.surgery')}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {medicalHistory.filter(item => item.type === 'surgery').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Medical History List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.25 }}
      >
        <div className={`rounded-xl p-6 shadow-sm ${
          theme === 'dark' 
            ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)]' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {t('medicalHistory.listTitle')}
            </h2>
          </div>

          <div className="space-y-4">
            {medicalHistory.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 mx-auto text-[var(--neutral-500)] mb-4" />
                <p className="text-[var(--text-secondary)] mb-4">
                  {t('medicalHistory.noData')}
                </p>
                <Button
                  onClick={openCreateModal}
                  icon={PlusIcon}
                >
                  {t('medicalHistory.addFirst')}
                </Button>
              </div>
            ) : (
              medicalHistory.map((item, index) => {
                const statusInfo = getStatusInfo(item.status);
                const typeInfo = getTypeInfo(item.type);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: 0.3 + index * 0.05 }}
                    className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-[var(--glass-bg-primary)] border-[var(--glass-border)] hover:border-[var(--glass-border-light)]' 
                        : 'bg-white border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-3 h-3 rounded-full bg-${statusInfo.color}-500`} />
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            {item.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                            {typeInfo.text}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)] mb-3">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-4 h-4" />
                            <span>{statusInfo.text}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          icon={PencilIcon}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          icon={TrashIcon}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? t('medicalHistory.editTitle') : t('medicalHistory.addTitle')}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              {t('medicalHistory.date')}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="glass-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              {t('medicalHistory.titleLabel')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="glass-input w-full"
              placeholder={t('medicalHistory.titlePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              {t('medicalHistory.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="glass-input w-full resize-none"
              placeholder={t('medicalHistory.notesPlaceholder')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              {t('medicalHistory.cancel')}
            </Button>
            <Button type="submit">
              {editingItem ? t('medicalHistory.update') : t('medicalHistory.add')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MedicalHistoryOverview;
