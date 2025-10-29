import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  MdDashboard,
  MdWork,
  MdCollections,
  MdCalendarToday,
  MdLightbulb,
  MdMessage,
  MdPerson,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdBusiness
} from 'react-icons/md';

import ProfilePanel from './Profile/ProfilePanel';
import PortfolioPanel from './Portfolio/PortfolioPanel';
import WorkExperiencePanel from './WorkExperienceView/WorkExperiencePanel';
import JobsPanel from './jops/JobsPanel';
import EventsPanel from './event/EventsPanel';
import ProjectIdeasPanel from './projectIdeas/ProjectIdeasPanel';
import MessagesPanel from './message/MessagesPanel';

const StudentLayout = ({  
  children,
  // Dashboard'dan gelen panel state'leri (opsiyonel)
  isProfilePanelOpen: externalIsProfilePanelOpen,
  setIsProfilePanelOpen: externalSetIsProfilePanelOpen,
  isPortfolioPanelOpen: externalIsPortfolioPanelOpen,
  setIsPortfolioPanelOpen: externalSetIsPortfolioPanelOpen,
  isWorkExperiencePanelOpen: externalIsWorkExperiencePanelOpen,
  setIsWorkExperiencePanelOpen: externalSetIsWorkExperiencePanelOpen,
  isJobsPanelOpen: externalIsJobsPanelOpen,
  setIsJobsPanelOpen: externalSetIsJobsPanelOpen,
  isEventsPanelOpen: externalIsEventsPanelOpen,
  setIsEventsPanelOpen: externalSetIsEventsPanelOpen,
  isProjectIdeasPanelOpen: externalIsProjectIdeasPanelOpen,
  setIsProjectIdeasPanelOpen: externalSetIsProjectIdeasPanelOpen,
  isMessagesPanelOpen: externalIsMessagesPanelOpen,
  setIsMessagesPanelOpen: externalSetIsMessagesPanelOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Internal state'ler (fallback olarak)
  const [internalIsProfilePanelOpen, setInternalIsProfilePanelOpen] = useState(false);
  const [internalIsPortfolioPanelOpen, setInternalIsPortfolioPanelOpen] = useState(false);
  const [internalIsWorkExperiencePanelOpen, setInternalIsWorkExperiencePanelOpen] = useState(false);
  const [internalIsJobsPanelOpen, setInternalIsJobsPanelOpen] = useState(false);
  const [internalIsEventsPanelOpen, setInternalIsEventsPanelOpen] = useState(false);
  const [internalIsProjectIdeasPanelOpen, setInternalIsProjectIdeasPanelOpen] = useState(false);
  const [internalIsMessagesPanelOpen, setInternalIsMessagesPanelOpen] = useState(false);

  // External props varsa onları kullan, yoksa internal state'leri kullan
  const isProfilePanelOpen = externalIsProfilePanelOpen !== undefined ? externalIsProfilePanelOpen : internalIsProfilePanelOpen;
  const setIsProfilePanelOpen = externalSetIsProfilePanelOpen || setInternalIsProfilePanelOpen;
  
  const isPortfolioPanelOpen = externalIsPortfolioPanelOpen !== undefined ? externalIsPortfolioPanelOpen : internalIsPortfolioPanelOpen;
  const setIsPortfolioPanelOpen = externalSetIsPortfolioPanelOpen || setInternalIsPortfolioPanelOpen;

  const isWorkExperiencePanelOpen = externalIsWorkExperiencePanelOpen !== undefined ? externalIsWorkExperiencePanelOpen : internalIsWorkExperiencePanelOpen;
  const setIsWorkExperiencePanelOpen = externalSetIsWorkExperiencePanelOpen || setInternalIsWorkExperiencePanelOpen;
  
  const isJobsPanelOpen = externalIsJobsPanelOpen !== undefined ? externalIsJobsPanelOpen : internalIsJobsPanelOpen;
  const setIsJobsPanelOpen = externalSetIsJobsPanelOpen || setInternalIsJobsPanelOpen;
  
  const isEventsPanelOpen = externalIsEventsPanelOpen !== undefined ? externalIsEventsPanelOpen : internalIsEventsPanelOpen;
  const setIsEventsPanelOpen = externalSetIsEventsPanelOpen || setInternalIsEventsPanelOpen;
  
  const isProjectIdeasPanelOpen = externalIsProjectIdeasPanelOpen !== undefined ? externalIsProjectIdeasPanelOpen : internalIsProjectIdeasPanelOpen;
  const setIsProjectIdeasPanelOpen = externalSetIsProjectIdeasPanelOpen || setInternalIsProjectIdeasPanelOpen;
  
  const isMessagesPanelOpen = externalIsMessagesPanelOpen !== undefined ? externalIsMessagesPanelOpen : internalIsMessagesPanelOpen;
  const setIsMessagesPanelOpen = externalSetIsMessagesPanelOpen || setInternalIsMessagesPanelOpen;

  const navigationLinks = [
    { 
      path: '/student/dashboard', 
      name: 'Dashboard', 
      icon: MdDashboard
    },
    { 
      path: '/student/profile', 
      name: 'Profil', 
      icon: MdPerson,
      isProfile: true 
    },
    { 
      path: '/student/work-experience', 
      name: 'İş Deneyimi', 
      icon: MdBusiness,
      isWorkExperience: true 
    },
    { 
      path: '/student/portfolio', 
      name: 'Portfolyo', 
      icon: MdCollections,
      isPortfolio: true
    },
    { 
      path: '/student/jobs', 
      name: 'İşler', 
      icon: MdWork,
      isJobs: true
    },
    { 
      path: '/student/events', 
      name: 'Etkinlikler', 
      icon: MdCalendarToday,
      isEvents: true
    },
    { 
      path: '/student/project-ideas', 
      name: 'Proje Fikirleri', 
      icon: MdLightbulb,
      isProjectIdeas: true
    },
    { 
      path: '/student/messages', 
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

  const closeAllPanels = () => {
    setIsProfilePanelOpen(false);
    setIsPortfolioPanelOpen(false);
    setIsWorkExperiencePanelOpen(false);
    setIsJobsPanelOpen(false);
    setIsEventsPanelOpen(false);
    setIsProjectIdeasPanelOpen(false);
    setIsMessagesPanelOpen(false);
  };

  const handleNavigation = (link) => {
    setIsMobileMenuOpen(false); // Close mobile menu
    
    if (link.isProfile) {
      setIsProfilePanelOpen(true);
      setIsPortfolioPanelOpen(false);
      setIsWorkExperiencePanelOpen(false);
      setIsJobsPanelOpen(false);
      setIsEventsPanelOpen(false);
      setIsProjectIdeasPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isPortfolio) {
      setIsPortfolioPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsWorkExperiencePanelOpen(false);
      setIsJobsPanelOpen(false);
      setIsEventsPanelOpen(false);
      setIsProjectIdeasPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isWorkExperience) {
      setIsWorkExperiencePanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsPortfolioPanelOpen(false);
      setIsJobsPanelOpen(false);
      setIsEventsPanelOpen(false);
      setIsProjectIdeasPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isJobs) {
      setIsJobsPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsPortfolioPanelOpen(false);
      setIsWorkExperiencePanelOpen(false);
      setIsEventsPanelOpen(false);
      setIsProjectIdeasPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isEvents) {
      setIsEventsPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsPortfolioPanelOpen(false);
      setIsWorkExperiencePanelOpen(false);
      setIsJobsPanelOpen(false);
      setIsProjectIdeasPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isProjectIdeas) {
      setIsProjectIdeasPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsPortfolioPanelOpen(false);
      setIsWorkExperiencePanelOpen(false);
      setIsJobsPanelOpen(false);
      setIsEventsPanelOpen(false);
      setIsMessagesPanelOpen(false);
    } else if (link.isMessages) {
      setIsMessagesPanelOpen(true);
      setIsProfilePanelOpen(false);
      setIsPortfolioPanelOpen(false);
      setIsWorkExperiencePanelOpen(false);
      setIsJobsPanelOpen(false);
      setIsEventsPanelOpen(false);
      setIsProjectIdeasPanelOpen(false);
    } else {
      navigate(link.path);
      closeAllPanels();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-black relative">
      <main className="w-full px-2 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-32">
        {children}
      </main>

      {/* Panels */}
      <ProfilePanel 
        isOpen={isProfilePanelOpen}
        onClose={() => setIsProfilePanelOpen(false)}
      />
      
      <PortfolioPanel 
        isOpen={isPortfolioPanelOpen}
        onClose={() => setIsPortfolioPanelOpen(false)}
      />

      <WorkExperiencePanel 
        isOpen={isWorkExperiencePanelOpen}
        onClose={() => setIsWorkExperiencePanelOpen(false)}
      />

      <JobsPanel 
        isOpen={isJobsPanelOpen}
        onClose={() => setIsJobsPanelOpen(false)}
      />

      <EventsPanel 
        isOpen={isEventsPanelOpen}
        onClose={() => setIsEventsPanelOpen(false)}
      />

      <ProjectIdeasPanel 
        isOpen={isProjectIdeasPanelOpen}
        onClose={() => setIsProjectIdeasPanelOpen(false)}
      />

      <MessagesPanel 
        isOpen={isMessagesPanelOpen}
        onClose={() => setIsMessagesPanelOpen(false)}
      />

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-blue-900/95 backdrop-blur-xl rounded-t-3xl p-6 border-t border-blue-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Menü</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-blue-300 hover:text-white hover:bg-blue-700/50 rounded-lg"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = isActivePath(link.path) || 
                                (link.isProfile && isProfilePanelOpen) ||
                                (link.isPortfolio && isPortfolioPanelOpen) ||
                                (link.isWorkExperience && isWorkExperiencePanelOpen) ||
                                (link.isJobs && isJobsPanelOpen) ||
                                (link.isEvents && isEventsPanelOpen) ||
                                (link.isProjectIdeas && isProjectIdeasPanelOpen) ||
                                (link.isMessages && isMessagesPanelOpen);
                
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/50'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              <MdLogout className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden sm:block">
          <div className="relative max-w-lg mx-auto px-4 py-3 mb-4">
            <nav className="flex items-center justify-center">
              <div className="flex items-center bg-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700/50 p-1.5 space-x-1">
                {/* Left side icons (first 4) */}
                <div className="flex items-center space-x-1">
                  {navigationLinks.slice(0, 4).map((link) => {
                    const IconComponent = link.icon;
                    const isActive = isActivePath(link.path) || 
                                    (link.isProfile && isProfilePanelOpen) ||
                                    (link.isPortfolio && isPortfolioPanelOpen) ||
                                    (link.isWorkExperience && isWorkExperiencePanelOpen) ||
                                    (link.isJobs && isJobsPanelOpen) ||
                                    (link.isEvents && isEventsPanelOpen) ||
                                    (link.isProjectIdeas && isProjectIdeasPanelOpen) ||
                                    (link.isMessages && isMessagesPanelOpen);
                    
                    return (
                      <button
                        key={link.path}
                        onClick={() => handleNavigation(link)}
                        className={`relative p-3 rounded-2xl transition-all duration-300 group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                            : 'text-blue-300 hover:text-blue-400 hover:bg-blue-700/50 hover:scale-105'
                        }`}
                        title={link.name}
                      >
                        <IconComponent className="w-6 h-6" />
                        
                        {isActive && (
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Center logout button */}
                <div className="mx-2">
                  <button
                    onClick={handleLogout}
                    className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transform hover:scale-110 transition-all duration-300"
                    title="Sign Out"
                  >
                    <MdLogout className="w-6 h-6" />
                  </button>
                </div>

                {/* Right side icons (last 4) */}
                <div className="flex items-center space-x-1">
                  {navigationLinks.slice(4).map((link) => {
                    const IconComponent = link.icon;
                    const isActive = isActivePath(link.path) || 
                                    (link.isProfile && isProfilePanelOpen) ||
                                    (link.isPortfolio && isPortfolioPanelOpen) ||
                                    (link.isWorkExperience && isWorkExperiencePanelOpen) ||
                                    (link.isJobs && isJobsPanelOpen) ||
                                    (link.isEvents && isEventsPanelOpen) ||
                                    (link.isProjectIdeas && isProjectIdeasPanelOpen) ||
                                    (link.isMessages && isMessagesPanelOpen);
                    
                    return (
                      <button
                        key={link.path}
                        onClick={() => handleNavigation(link)}
                        className={`relative p-3 rounded-2xl transition-all duration-300 group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
                            : 'text-blue-300 hover:text-blue-400 hover:bg-blue-700/50 hover:scale-105'
                        }`}
                        title={link.name}
                      >
                        <IconComponent className="w-6 h-6" />
                        
                        {isActive && (
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="sm:hidden bg-blue-900/95 backdrop-blur-xl border-t border-blue-700/50">
          <div className="flex items-center justify-around p-2">
            {/* Quick Access Icons (most used) */}
            {navigationLinks.slice(0, 4).map((link) => {
              const IconComponent = link.icon;
              const isActive = isActivePath(link.path) || 
                              (link.isProfile && isProfilePanelOpen) ||
                              (link.isPortfolio && isPortfolioPanelOpen) ||
                              (link.isWorkExperience && isWorkExperiencePanelOpen) ||
                              (link.isJobs && isJobsPanelOpen) ||
                              (link.isEvents && isEventsPanelOpen);
              
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link)}
                  className={`relative p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-300 hover:text-white hover:bg-blue-700/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full"></div>
                  )}
                </button>
              );
            })}
            
            {/* Menu Button for remaining items */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 text-blue-300 hover:text-white hover:bg-blue-700/50 rounded-xl transition-all duration-200"
            >
              <MdMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;