// pages/student/components/ProfilePanel.jsx
import React, { useState, useEffect } from 'react';
import { MdPerson, MdClose, MdEdit, MdVisibility } from 'react-icons/md';
import ProfileViewDark from './ProfileViewDark';
import ProfileEditDark from './ProfileEditDark';

const ProfilePanel = ({ isOpen, onClose }) => {
  const [profileTab, setProfileTab] = useState('view');
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Panel açıldığında profil verilerini yükle
  useEffect(() => {
    if (isOpen && !profileData) {
      loadProfileData();
    }
  }, [isOpen]);

  const loadProfileData = async () => {
    setProfileLoading(true);
    
    try {
      const { getStudentProfile } = await import('../../../../services/api');
      const response = await getStudentProfile();
      setProfileData(response.data);
      setProfileLoading(false);
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const { updateStudentProfile, getStudentProfile } = await import('../../../../services/api');
      await updateStudentProfile(formData);
      
      // Güncel verileri getir
      const response = await getStudentProfile();
      setProfileData(response.data);
      
      setProfileTab('view');
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop - Desktop only */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm hidden md:block"
        onClick={onClose}
      ></div>
      
      {/* Panel - Full screen on mobile, sidebar on desktop */}
      <div className="relative w-full md:ml-auto md:w-[75%] lg:w-[60%] xl:w-[50%] h-full bg-blue-900/95 backdrop-blur-xl md:border-l border-blue-800/50 overflow-hidden flex flex-col">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-blue-800/50 bg-blue-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MdPerson className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors text-blue-200 hover:text-white"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Tabs */}
        <div className="border-b border-blue-800/50">
          <nav className="flex px-4 md:px-6">
            <button
              onClick={() => setProfileTab('view')}
              className={`py-3 px-3 md:px-4 text-sm font-medium transition-colors flex items-center space-x-2 ${
                profileTab === 'view'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-blue-400 hover:text-blue-200'
              }`}
            >
              <MdVisibility className="w-4 h-4" />
              <span>View</span>
            </button>
            <button
              onClick={() => setProfileTab('edit')}
              className={`py-3 px-3 md:px-4 text-sm font-medium transition-colors flex items-center space-x-2 ${
                profileTab === 'edit'
                  ? 'text-blue-300 border-b-2 border-blue-400'
                  : 'text-blue-400 hover:text-blue-200'
              }`}
            >
              <MdEdit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </nav>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-blue-900/50">
          {profileLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="max-w-4xl">
              {profileTab === 'view' ? (
                <ProfileViewDark profile={profileData?.profile} />
              ) : (
                <ProfileEditDark 
                  profile={profileData?.profile}
                  onSubmit={handleProfileUpdate}
                  onCancel={() => setProfileTab('view')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;