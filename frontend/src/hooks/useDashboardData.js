// hooks/useDashboardData.js
import { useEffect, useState } from 'react';
import { 
  getStudentProfile, 
  getAssignedJobs, 
  getActiveEvents, 
  getActiveProjectIdeas,
  getStudentProjects,
  getStudentMessages
} from '../services/api';

export const useDashboardData = () => {
  const [profileData, setProfileData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedProjects: 0,
    upcomingEvents: 0,
    projectIdeas: 0,
    attendedEvents: 0,
    unreadMessages: 0
  });

  // Helper function to safely extract data from API responses
  const extractData = (response, fallback = []) => {
    if (response?.data?.data) {
      return Array.isArray(response.data.data) ? response.data.data : fallback;
    } else if (response?.data) {
      return Array.isArray(response.data) ? response.data : fallback;
    } else if (Array.isArray(response)) {
      return response;
    }
    return fallback;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Dashboard: Starting to fetch all data...');
      
      // Profil verilerini getir
      const profileResponse = await getStudentProfile();
      console.log('Dashboard: Profile response:', profileResponse);
      setProfileData(profileResponse.data);
      
      // Stats hesaplama için değişkenler
      let activeJobs = 0;
      let completedProjects = 0;
      let upcomingEvents = 0;
      let projectIdeasCount = 0;
      let unreadMessages = 0;

      // Atanan işleri getir
      try {
        console.log('Dashboard: Fetching jobs...');
        const jobsResponse = await getAssignedJobs();
        console.log('Dashboard: Jobs response:', jobsResponse);
        
        const jobsData = extractData(jobsResponse, []);
        console.log('Dashboard: Extracted jobs data:', jobsData);
        
        setJobs(jobsData.slice(0, 3)); // İlk 3 iş
        
        // Aktif işleri say (in_progress, assigned veya approved status'ü olanlar)
        activeJobs = jobsData.filter(job => 
          ['in_progress', 'assigned', 'approved'].includes(job.status)
        ).length;
        
        console.log('Dashboard: Active jobs count:', activeJobs);
      } catch (err) {
        console.log('İşler yüklenemedi:', err);
        setJobs([]);
      }

      // Projeleri getir
      try {
        console.log('Dashboard: Fetching projects...');
        const projectsResponse = await getStudentProjects();
        console.log('Dashboard: Projects response:', projectsResponse);
        
        const projectsData = extractData(projectsResponse, []);
        setProjects(projectsData.slice(0, 3)); // İlk 3 proje
        
        // Tamamlanan projeleri say
        completedProjects = projectsData.length; // Tüm projeler tamamlanmış sayılır
        
        console.log('Dashboard: Completed projects count:', completedProjects);
      } catch (err) {
        console.log('Projeler yüklenemedi:', err);
        setProjects([]);
      }

      // Etkinlikleri getir
      try {
        console.log('Dashboard: Fetching events...');
        const eventsResponse = await getActiveEvents();
        const eventsData = extractData(eventsResponse, []);
        setEvents(eventsData.slice(0, 3)); // İlk 3 etkinlik
        
        // Yaklaşan etkinlikleri say (gelecekteki etkinlikler)
        const today = new Date();
        upcomingEvents = eventsData.filter(event => {
          const eventDate = new Date(event.eventDate);
          return eventDate >= today;
        }).length;
        
        console.log('Dashboard: Upcoming events count:', upcomingEvents);
      } catch (err) {
        console.log('Etkinlikler yüklenemedi:', err);
        setEvents([]);
      }

      // Proje fikirlerini getir
      try {
        console.log('Dashboard: Fetching project ideas...');
        const projectIdeasResponse = await getActiveProjectIdeas();
        const projectIdeasData = extractData(projectIdeasResponse, []);
        setProjectIdeas(projectIdeasData.slice(0, 4)); // İlk 4 proje fikri
        
        projectIdeasCount = projectIdeasData.length;
        
        console.log('Dashboard: Project ideas count:', projectIdeasCount);
      } catch (err) {
        console.log('Proje fikirleri yüklenemedi:', err);
        setProjectIdeas([]);
      }

      // Mesajları getir
      try {
        console.log('Dashboard: Fetching messages...');
        const messagesResponse = await getStudentMessages();
        const messagesData = extractData(messagesResponse, []);
        setMessages(messagesData.slice(0, 3)); // İlk 3 mesaj
        
        unreadMessages = messagesData.filter(msg => !msg.isRead).length;
        
        console.log('Dashboard: Unread messages count:', unreadMessages);
      } catch (err) {
        console.log('Mesajlar yüklenemedi:', err);
        setMessages([]);
      }
      
      // Stats'ları güncelle - her durumda çalışır
      const newStats = {
        activeJobs,
        completedProjects,
        upcomingEvents,
        projectIdeas: projectIdeasCount,
        attendedEvents: 0, // Bu ayrı bir endpoint'ten gelecek
        unreadMessages
      };
      
      console.log('Dashboard: Setting stats:', newStats);
      setStats(newStats);
      
      console.log('Dashboard: All data fetched successfully');
      setLoading(false);
    } catch (err) {
      console.error('Dashboard verileri yüklenirken hata:', err);
      console.error('Error details:', err.response?.data);
      setError('Bilgiler yüklenirken bir hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    profileData,
    jobs,
    events,
    projectIdeas,
    projects,
    messages,
    stats,
    loading,
    error,
    refetch
  };
};