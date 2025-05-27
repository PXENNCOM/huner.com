// pages/student/components/StudentLayout.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Footer from '../../../partials/Footer';

import { 
  MdDashboard, 
  MdPerson, 
  MdWorkOutline, 
  MdCollections,
  MdMessage,
  MdSettings,
  MdEventNote,
  MdContactSupport 
} from 'react-icons/md';

const StudentLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationLinks = [
    { 
      path: '/student/dashboard', 
      name: 'Dashboard', 
      icon: <MdDashboard className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/profile', 
      name: 'Profil', 
      icon: <MdPerson className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/portfolio', 
      name: 'Portfolyo', 
      icon: <MdCollections className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/jobs', 
      name: 'İşler', 
      icon: <MdWorkOutline className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/events', 
      name: 'Etkinlikler', 
      icon: <MdEventNote className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/project-ideas', 
      name: 'Proje Fikirleri', 
      icon: <MdContactSupport  className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/messages', 
      name: 'Mesajlar', 
      icon: <MdMessage className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/student/settings', 
      name: 'Ayarlar', 
      icon: <MdSettings className="w-5 h-5 mr-2" /> 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">      
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Sidebar */}
        <div className="bg-white shadow-md w-full md:w-64 md:min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                {user?.email?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Öğrenci
                </p>
              </div>
            </div>
          </div>
          
          <nav className="p-4">
            <ul>
              {navigationLinks.map((link) => (
                <li key={link.path} className="mb-2">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                      }`
                    }
                  >
                    {link.icon}
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentLayout;