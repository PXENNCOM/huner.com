import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  MdDashboard,
  MdPerson,
  MdCode,
  MdMessage,
  MdWork,
  MdLogout
} from 'react-icons/md';

import EmployerProfilePanel from './Profile/EmployerProfilePanel';
import DeveloperRequestsPanel from './DeveloperRequests/DeveloperRequestsPanel';
import MessagesPanel from './Messages/MessagesPanel';
import JobsPanel from './jops/JobsPanel';

const EmployerLayout = ({ 
  children,
  // Dashboard'dan gelen panel state'leri (opsiyonel)
  isProfilePanelOpen: externalIsProfilePanelOpen,
  setIsProfilePanelOpen: externalSetIsProfilePanelOpen,
  isDeveloperRequestsPanelOpen: externalIsDeveloperRequestsPanelOpen,
  setIsDeveloperRequestsPanelOpen: externalSetIsDeveloperRequestsPanelOpen,
  isJobsPanelOpen: externalIsJobsPanelOpen,
  setIsJobsPanelOpen: externalSetIsJobsPanelOpen,
  isMessagesPanelOpen: externalIsMessagesPanelOpen,
  setIsMessagesPanelOpen: externalSetIsMessagesPanelOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Internal state'ler (fallback olarak)
  const [internalIsProfilePanelOpen, setInternalIsProfilePanelOpen] = useState(false);
  const [internalIsDeveloperRequestsPanelOpen, setInternalIsDeveloperRequestsPanelOpen] = useState(false);
  const [internalIsJobsPanelOpen, setInternalIsJobsPanelOpen] = useState(false);
  const [internalIsMessagesPanelOpen, setInternalIsMessagesPanelOpen] = useState(false);

  // External props varsa onları kullan, yoksa internal state'leri kullan
  const isProfilePanelOpen = externalIsProfilePanelOpen !== undefined ? externalIsProfilePanelOpen : internalIsProfilePanelOpen;
  const setIsProfilePanelOpen = externalSetIsProfilePanelOpen || setInternalIsProfilePanelOpen;
  
  const isDeveloperRequestsPanelOpen = externalIsDeveloperRequestsPanelOpen !== undefined ? externalIsDeveloperRequestsPanelOpen : internalIsDeveloperRequestsPanelOpen;
  const setIsDeveloperRequestsPanelOpen = externalSetIsDeveloperRequestsPanelOpen || setInternalIsDeveloperRequestsPanelOpen;
  
  const isJobsPanelOpen = externalIsJobsPanelOpen !== undefined ? externalIsJobsPanelOpen : internalIsJobsPanelOpen;
  const setIsJobsPanelOpen = externalSetIsJobsPanelOpen || setInternalIsJobsPanelOpen;
  
  const isMessagesPanelOpen = externalIsMessagesPanelOpen !== undefined ? externalIsMessagesPanelOpen : internalIsMessagesPanelOpen;
  const setIsMessagesPanelOpen = externalSetIsMessagesPanelOpen || setInternalIsMessagesPanelOpen;

  const navigationLinks = [
    { 
      path: '/employer/dashboard', 
      name: 'Ana Sayfa', 
      icon: MdDashboard
    },
    { 
      path: '/employer/profile', 
      name: 'Profil', 
      icon: MdPerson,
      isProfile: true 
    },
    { 
      path: '/employer/developer-requests', 
      name: 'Yazılımcı Taleplerim', 
      icon: MdCode,
      isDeveloperRequests: true
    },
    { 
      path: '/employer/jobs', 
      name: 'İş İlanları', 
      icon: MdWork,
      isJobs: true
    },
    { 
      path: '/employer/messages', 
      name: 'Mesajlar', 
      icon: MdMessage,
      isMessages: true
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (link) => {
    if (link.isProfile) {
      setIsProfilePanelOpen(true);
      setIsDeveloperRequestsPanelOpen(false);
      setIsMessagesPanelOpen(false);
      setIsJobsPanelOpen(false);
    } else if (link.isDeveloperRequests) {
      setIsDeveloperRequestsPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsMessagesPanelOpen(false);
      setIsJobsPanelOpen(false);
    } else if (link.isJobs) {
      setIsJobsPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsDeveloperRequestsPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isMessages) {
      setIsMessagesPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsDeveloperRequestsPanelOpen(false);
      setIsJobsPanelOpen(false);
    } else {
      navigate(link.path);
      setIsProfilePanelOpen(false);
      setIsDeveloperRequestsPanelOpen(false);
      setIsMessagesPanelOpen(false);
      setIsJobsPanelOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative">
      <main className="w-full px-4 py-6 pb-40">
        {children}
      </main>

      {/* Panels */}
      <EmployerProfilePanel 
        isOpen={isProfilePanelOpen}
        onClose={() => setIsProfilePanelOpen(false)}
      />
      
      <DeveloperRequestsPanel 
        isOpen={isDeveloperRequestsPanelOpen}
        onClose={() => setIsDeveloperRequestsPanelOpen(false)}
      />

      <JobsPanel 
        isOpen={isJobsPanelOpen}
        onClose={() => setIsJobsPanelOpen(false)}
      />

      <MessagesPanel 
        isOpen={isMessagesPanelOpen}
        onClose={() => setIsMessagesPanelOpen(false)}
      />

      {/* Bottom Navigation */}
      <div className="fixed bottom-14 left-0 right-0 z-40">
        <div className="relative max-w-lg mx-auto px-4 py-3">
          <nav className="flex items-center justify-center">
            <div className="flex items-center bg-blue-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700/50 p-1.5 space-x-1">
              {/* Left side icons (first 3) */}
              <div className="flex items-center space-x-1">
                {navigationLinks.slice(0, 3).map((link) => {
                  const IconComponent = link.icon;
                  const isActive = isActivePath(link.path) || 
                                  (link.isProfile && isProfilePanelOpen) ||
                                  (link.isDeveloperRequests && isDeveloperRequestsPanelOpen);
                  
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleNavigation(link)}
                      className={`relative p-3 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                          : 'text-blue-200 hover:text-blue-100 hover:bg-blue-700/50 hover:scale-105'
                      }`}
                      title={link.name}
                    >
                      <IconComponent className="w-6 h-6" />
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Ripple effect */}
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                        isActive ? '' : 'group-hover:bg-blue-500/10'
                      }`}></div>
                    </button>
                  );
                })}
              </div>

              {/* Center logout button */}
              <div className="mx-2">
                <button
                  onClick={handleLogout}
                  className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transform hover:scale-110 transition-all duration-300 group relative overflow-hidden"
                  title="Çıkış Yap"
                >
                  <MdLogout className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-30 animate-ping"></div>
                </button>
              </div>

              {/* Right side icons (last 2) */}
              <div className="flex items-center space-x-1">
                {navigationLinks.slice(3).map((link) => {
                  const IconComponent = link.icon;
                  const isActive = isActivePath(link.path) || 
                                  (link.isJobs && isJobsPanelOpen) ||
                                  (link.isMessages && isMessagesPanelOpen);
                  
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleNavigation(link)}
                      className={`relative p-3 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                          : 'text-blue-200 hover:text-blue-100 hover:bg-blue-700/50 hover:scale-105'
                      }`}
                      title={link.name}
                    >
                      <IconComponent className="w-6 h-6" />
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Ripple effect */}
                      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                        isActive ? '' : 'group-hover:bg-blue-500/10'
                      }`}></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default EmployerLayout;