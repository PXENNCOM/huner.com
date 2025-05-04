// pages/student/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, updateStudentProfile } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('view');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getStudentProfile();
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Profil bilgileri yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (formData) => {
    try {
      setLoading(true);
      await updateStudentProfile(formData);
      
      // Güncel verileri getir
      const response = await getStudentProfile();
      setProfileData(response.data);
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setActiveTab('view');
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Profil güncellenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('view')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'view'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Görüntüle
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'edit'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Düzenle
            </button>
          </nav>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 border-b border-red-100">
            {error}
          </div>
        )}

        {updateSuccess && (
          <div className="p-4 bg-green-50 text-green-500 border-b border-green-100">
            Profil başarıyla güncellendi!
          </div>
        )}

        <div className="p-6">
          {activeTab === 'view' ? (
            <ProfileView profile={profileData?.profile} />
          ) : (
            <ProfileEdit 
              profile={profileData?.profile} 
              onSubmit={handleUpdateProfile} 
              onCancel={() => setActiveTab('view')} 
            />
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;