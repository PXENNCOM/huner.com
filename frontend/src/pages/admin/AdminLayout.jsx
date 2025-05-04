// pages/admin/AdminLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Ana Sayfa', icon: '📊' },
    { path: '/admin/students', label: 'Öğrenci Yönetimi', icon: '👨‍🎓' },
    { path: '/admin/employers', label: 'İşveren Yönetimi', icon: '🏢' },
    { path: '/admin/jobs', label: 'İş İlanları', icon: '💼' },
    { path: '/admin/messages', label: 'Mesajlar', icon: '✉️' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Kenar Menü */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Hüner Admin</h1>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 mt-2 text-gray-700 hover:bg-gray-100
                ${isActive(item.path) ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 mt-4 text-gray-700 hover:bg-gray-100"
          >
            <span className="mr-3">🚪</span>
            <span>Çıkış</span>
          </button>
        </nav>
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;