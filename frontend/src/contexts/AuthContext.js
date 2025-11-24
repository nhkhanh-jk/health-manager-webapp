import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { notifications } from '../utils/notifications'; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // --- SỬA LỖI: Map lại tên trường từ Backend (ho, ten, tuoi) sang Frontend (firstName, lastName, age) ---
        // Để Profile.js có thể hiển thị đúng
        const mappedUser = {
          ...parsedUser,
          firstName: parsedUser.ho,
          lastName: parsedUser.ten,
          age: parsedUser.tuoi,
          gender: parsedUser.gioiTinh,
          // Đảm bảo không bị lỗi undefined khi profile.js cố gắng đọc
          tuoi: parsedUser.tuoi || 0,
          gioiTinh: parsedUser.gioiTinh || 'Nam',
        };
        setUser(mappedUser);
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false); 
  }, []);

  // Hàm xử lý chung sau khi đăng nhập/đăng ký thành công
  const handleAuthSuccess = (data) => {
    const { token, user } = data; 
    
    // Map lại user từ Backend sang Frontend
    const mappedUser = {
        ...user,
        firstName: user.ho,
        lastName: user.ten,
        age: user.tuoi,
        gender: user.gioiTinh,
        tuoi: user.tuoi || 0,
        gioiTinh: user.gioiTinh || 'Nam',
    };

    setToken(token);
    setUser(mappedUser);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mappedUser));

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    navigate('/dashboard');
    notifications.loginSuccess(user.ho || user.email);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, matKhau: password }); // Sửa password -> matKhau
      handleAuthSuccess(response.data);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      // Dữ liệu đã được map đúng ho, ten, matKhau, tuoi, gioiTinh trong Register.js
      const response = await api.post('/auth/register', userData);
      //handleAuthSuccess(response.data);
      notifications.actionSuccess("Đăng ký");
      navigate('/login');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  // --- MỚI: Thêm hàm cập nhật hồ sơ thật ---
  const updateUser = async (payload) => {
    try {
        // Gửi payload tới endpoint PUT /api/user/{id}
        const response = await api.put(`/user/${payload.id}`, payload);

        const updatedUser = response.data;
        
        // Map lại user từ Backend và cập nhật local state
        const mappedUser = {
            ...updatedUser,
            firstName: updatedUser.ho,
            lastName: updatedUser.ten,
            age: updatedUser.tuoi,
            gender: updatedUser.gioiTinh,
            tuoi: updatedUser.tuoi || 0,
            gioiTinh: updatedUser.gioiTinh || 'Nam',
        };

        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));

        return { success: true };
    } catch (error) {
        // Log lỗi chi tiết nếu có
        console.error("Lỗi cập nhật hồ sơ:", error.response);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.';
        return { success: false, error: errorMessage };
    }
  };

  // xóa tài khoản

  const deleteUser = async () => {
    if (!user || !user.id) {
        return { success: false, error: 'Người dùng chưa đăng nhập.' };
    }
    const userId = user.id;

    try {
        await api.delete(`/user/${userId}`);
        
        // BƯỚC QUAN TRỌNG: Đăng xuất người dùng sau khi xóa tài khoản
        logout(); 
        notifications.deleteAccountSuccess("Tài khoản đã được xóa thành công."); 
        
        return { success: true };
    } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error.response);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Không thể xóa tài khoản. Vui lòng thử lại.';
        return { success: false, error: errorMessage };
    }
};
  // --- HẾT CODE MỚI ---

  const updatePassword = async (currentPassword, newPassword) => {
    // 1. Kiểm tra User đang đăng nhập
    if (!user || !user.id) {
        return { success: false, error: 'Người dùng chưa đăng nhập.' };
    }
    
    const userId = user.id; // Lấy ID của người dùng từ state hiện tại

    try {
        // Gửi yêu cầu PUT tới endpoint đổi mật khẩu (Backend đã cấu hình)
        const response = await api.put(`/user/${userId}/password`, { 
            currentPassword: currentPassword,
            newPassword: newPassword // Phải khớp với tên trường 'newPassword' trong DTO (PasswordUpdateRequest) của Backend
        });

        notifications.changedPasswordSuccess("Đổi mật khẩu thành công!");
        
        return { success: true };
    } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error.response);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Không thể cập nhật mật khẩu. Vui lòng thử lại.';
        return { success: false, error: errorMessage };
    }
};
// --- HẾT CODE MỚI ---

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
    //notifications.logoutSuccess();
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    updatePassword,
    deleteUser, // Cung cấp hàm mới
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
