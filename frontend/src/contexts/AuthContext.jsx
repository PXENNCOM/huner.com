//AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Context oluşturma
const AuthContext = createContext();

// Provider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Token'ı state olarak tutuyoruz
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Component mount olduğunda kullanıcı bilgilerini kontrol et
useEffect(() => {
  const checkLoggedIn = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = authService.getCurrentUser();
    
    console.log('Stored token on init:', storedToken ? 'exists' : 'none');
    console.log('Stored user on init:', storedUser ? 'exists' : 'none');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      
      // Token'ı doğrudan güncelle - bu kritik adım
      authService.updateAuthHeader(storedToken);
      console.log('Token found, authorization header updated directly');
    }
    setLoading(false);
  };
  
  checkLoggedIn();
}, []);

  // Giriş işlemi
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      console.log('Login successful, token received:', data.token ? 'Yes' : 'No');
      
      if (data.token) {
        // Önce header'ı güncelle, sonra localStorage'a kaydet
        authService.updateAuthHeader(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Auth header directly updated after login');
        
        // State'i güncelle
        setToken(data.token);
        setUser(data.user);
        
          // Kullanıcı türüne göre yönlendirme
      switch (data.user.userType) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'employer':
          navigate('/employer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Giriş başarısız'
    };
  }
};

// Kayıt işlemi
const register = async (userData) => {
  try {
    const data = await authService.register(userData);
    
    // ✅ Backend'den gelen tüm bilgileri döndür
    console.log('Register response from backend:', data);
    
    return { 
      success: true, 
      userId: data.userId,                          // ← EKLE
      needsEmailVerification: data.needsEmailVerification,  // ← EKLE
      emailSent: data.emailSent,                    // ← EKLE
      message: data.message,
      data 
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Kayıt başarısız'
    };
  }
};

  // Çıkış işlemi
  const logout = () => {
    console.log('Logging out, clearing token and user data');
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/signin');
  };

  // Token'ı yenile - bu fonksiyonu API içinde kullanmak yerine doğrudan burada tanımlı bırakıyoruz
  const refreshToken = (newToken) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('token', newToken);
      console.log('Token refreshed and stored');
    }
  };

  // Context değerleri
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Context hook'u
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;