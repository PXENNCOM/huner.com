// pages/student/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios'; // Axios'u import edin
import { getStudentProfile, getAssignedJobs } from '../../services/api';
import StudentLayout from './components/StudentLayout';
import ProfileCompletionCard from './components/ProfileCompletionCard';
import JobsPreviewCard from './components/JobsPreviewCard';
import PortfolioPreviewCard from './components/PortfolioPreviewCard';
import QuickActionsCard from './components/QuickActionsCard';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Token kontrolü
    console.log('Token:', localStorage.getItem('token'));
    console.log('Token header:', `Bearer ${localStorage.getItem('token')}`);
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Token'ı direkt localStorage'dan alın
        const token = localStorage.getItem('token');
        console.log('Fetching profile with token:', token ? token.substring(0, 15) + '...' : 'none');
        
        // Doğrudan axios ile test
        try {
          const directResponse = await axios.get('http://localhost:3001/api/student/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Direct API response:', directResponse.data);
          
          // Test başarılıysa, verileri ayarla
          setProfileData(directResponse.data);
          
          // İşleri getir - bu da aynı token ile yapılmalı
          const jobsResponse = await axios.get('http://localhost:3001/api/student/assigned-jobs', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setJobs(jobsResponse.data);
        } catch (apiErr) {
          console.error('API direct call error:', apiErr);
          console.error('Error response:', apiErr.response?.status, apiErr.response?.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Bilgiler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-500">
          {error}
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Hoş Geldin, {profileData?.profile?.fullName || user?.email}
          </h1>
          <p className="text-gray-600">Hüner platformunda durumunu kontrol et ve işlerini yönet.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ProfileCompletionCard 
            profile={profileData?.profile} 
            completionPercentage={profileData?.completionPercentage} 
          />
          
          <JobsPreviewCard jobs={jobs} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PortfolioPreviewCard projects={profileData?.projects} />
          
          <QuickActionsCard 
            onUpdateProfile={() => navigate('/student/profile')}
            onAddProject={() => navigate('/student/portfolio/add')}
          />
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;