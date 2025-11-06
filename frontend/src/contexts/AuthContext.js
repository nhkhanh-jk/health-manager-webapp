import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { notifications } from '../utils/notifications';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios base URL and interceptors
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Try to validate token with backend
          const response = await axios.get('/auth/validate');
          if (response.data.valid) {
            setUser(JSON.parse(userData));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // If backend is not available, use stored user data for demo
          if (userData) {
            console.warn('Backend not available, using stored user data for demo');
            setUser(JSON.parse(userData));
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Try real API first
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const { token, employee } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(employee));
      setUser(employee);
      
      notifications.loginSuccess(employee.firstName);
      return { success: true };
    } catch (error) {
      console.warn('Backend login failed, trying demo mode:', error.message);
      
      // Demo mode - Mock login for testing UI
      const demoUsers = {
        'admin@company.com': {
          id: 1,
          email: 'admin@company.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          department: 'IT',
          position: 'System Administrator',
          phoneNumber: '0123456789',
          hireDate: '2020-01-01'
        },
        'hr@company.com': {
          id: 2,
          email: 'hr@company.com',
          firstName: 'HR',
          lastName: 'Manager',
          role: 'HR',
          department: 'Human Resources',
          position: 'HR Manager',
          phoneNumber: '0123456788',
          hireDate: '2020-02-01'
        },
        'manager@company.com': {
          id: 3,
          email: 'manager@company.com',
          firstName: 'Team',
          lastName: 'Manager',
          role: 'MANAGER',
          department: 'Engineering',
          position: 'Team Lead',
          phoneNumber: '0123456787',
          hireDate: '2020-03-01'
        },
        'employee@company.com': {
          id: 4,
          email: 'employee@company.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'EMPLOYEE',
          department: 'Engineering',
          position: 'Software Developer',
          phoneNumber: '0123456786',
          hireDate: '2021-01-01'
        }
      };

      const demoPasswords = {
        'admin@company.com': 'admin123',
        'hr@company.com': 'hr123',
        'manager@company.com': 'manager123',
        'employee@company.com': 'emp123'
      };

      if (demoUsers[email] && demoPasswords[email] === password) {
        const user = demoUsers[email];
        const token = 'demo-token-' + Date.now();
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        notifications.loginSuccess(`${user.firstName} (Demo Mode)`);
        return { success: true };
      } else {
        const message = 'Email hoặc mật khẩu không đúng';
        notifications.actionFailed('đăng nhập');
        return { success: false, error: message };
      }
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll create a new user
      // In a real app, this would make an API call to your backend
      const newUser = {
        id: Date.now(), // Simple ID generation for demo
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'USER',
        department: 'Health',
        position: 'Health Tracker',
        isActive: true,
        weight: 70, // Default values
        height: 170,
        bloodGroup: 'A+',
        age: userData.age,
        gender: userData.gender
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    notifications.logoutSuccess();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Role-based permission functions
  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const canManageEmployees = () => {
    return hasAnyRole(['ADMIN', 'HR', 'MANAGER']);
  };

  const canApproveAbsences = () => {
    return hasAnyRole(['ADMIN', 'HR', 'MANAGER']);
  };

  const canAccessDocuments = () => {
    return user !== null; // All authenticated users can access documents
  };

  const canManageDocuments = () => {
    return hasAnyRole(['ADMIN', 'HR']);
  };

  const canViewAllEmployees = () => {
    return hasAnyRole(['ADMIN', 'HR', 'MANAGER']);
  };

  const canEditProfile = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    canManageEmployees,
    canApproveAbsences,
    canAccessDocuments,
    canManageDocuments,
    canViewAllEmployees,
    canEditProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;