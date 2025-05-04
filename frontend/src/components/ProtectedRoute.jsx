import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Yükleme durumunda bekleyelim
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Kullanıcı giriş yapmamışsa signin sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  // Eğer rol kontrolü yapılıyorsa ve kullanıcının rolü uygun değilse, ana sayfaya yönlendir
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  // Tüm koşullar sağlanıyorsa, çocuk bileşenleri göster
  return children;
};

export default ProtectedRoute;