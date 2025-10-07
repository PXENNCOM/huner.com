import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({
    students: false,
    employers: false,
    jobs: false
  });

 const menuItems = [
  { path: '/admin/dashboard', label: 'Ana Sayfa', icon: '📊' },
  { 
    path: '/admin/students', 
    label: 'Öğrenci Yönetimi', 
    icon: '👨‍🎓',
    subItems: [
      { path: '/admin/students', label: 'Tüm Öğrenciler' },
      { path: '/admin/students/pending', label: 'Onay Bekleyenler' }
    ]
  },
  { path: '/admin/employers', label: 'İşveren Yönetimi', icon: '🏢' },
  { path: '/admin/jobs', label: 'İş İlanları', icon: '💼' },
  
  // YENİ EKLENEN
  { path: '/admin/talent-search', label: 'Yetenek Arama', icon: '🎯' },
  
  { path: '/admin/events', label: 'Etkinlik Yönetimi', icon: '🎯' },
  { path: '/admin/project-ideas', label: 'Proje Fikri Kütüphanesi', icon: '💡' },
  { path: '/admin/messages', label: 'Mesajlar', icon: '✉️' }
];
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const isSubActive = (path) => {
    if (path === '/admin/students') {
      return location.pathname === path || 
             (location.pathname.startsWith('/admin/students/') && 
              !location.pathname.includes('/pending'));
    }
    return location.pathname === path;
  };

  const toggleExpand = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
            <React.Fragment key={item.path}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.label.toLowerCase().split(' ')[0])}
                    className={`flex items-center justify-between w-full px-6 py-3 mt-2 text-gray-700 hover:bg-gray-100
                      ${isActive(item.path) ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span>{expanded[item.label.toLowerCase().split(' ')[0]] ? '▼' : '▶'}</span>
                  </button>
                  
                  {expanded[item.label.toLowerCase().split(' ')[0]] && (
                    <div className="pl-12">
                      {item.subItems.map(subItem => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-6 py-2 text-sm text-gray-600 hover:text-gray-900
                            ${isSubActive(subItem.path) ? 'text-blue-600 font-medium' : ''}`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 mt-2 text-gray-700 hover:bg-gray-100
                    ${isActive(item.path) ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </React.Fragment>
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