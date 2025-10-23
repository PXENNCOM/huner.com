import axios from 'axios';

// API temel URL'si - Environment'a göre otomatik ayarlanıyor
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🌐 API URL:', API_URL); // Debug için

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// api.js'deki interceptor'ı düzelt
api.interceptors.request.use(
  (config) => {
    // Her istekte localStorage'dan token'ı taze olarak alıyoruz
    const token = localStorage.getItem('token');
    console.log('Request URL:', config.url);
    console.log('Using token (first 15 chars):', token ? token.substring(0, 15) + '...' : 'none');
    
    if (token) {
      // Doğru formatta Authorization header'ı ayarla
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Debug için header'ı kontrol et
      console.log('Request headers.Authorization:', config.headers['Authorization']);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı ekle (hata ayıklama için)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 hatası varsa token süresi dolmuş olabilir
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized error:', error.config.url);
      console.log('Current auth header:', error.config.headers['Authorization']);
      // İsterseniz buraya otomatik çıkış veya token yenileme mantığı ekleyebilirsiniz
    }
    return Promise.reject(error);
  }
);

export const updateAuthHeader = (token) => {
  if (token) {
    // Doğrudan defaults yerine interceptor'da da güncelleme yapmayı dene
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth header updated with token:', token.substring(0, 15) + '...');
    console.log('Full header after update:', api.defaults.headers.common['Authorization']);
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Auth header cleared');
  }
};

// Authentication ile ilgili servisler
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  setUserData: (token, user) => {
    console.log('Setting new token in localStorage');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // API header'ını güncelle - bu satır çok önemli
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  // Oturum bilgilerini temizle
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // API header'ını temizle
    delete api.defaults.headers.common['Authorization'];
  },

   isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  updateAuthHeader: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Auth header updated with token');
    } else {
      delete api.defaults.headers.common['Authorization'];
      console.log('Auth header cleared');
    }
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

   // Şifre sıfırlama fonksiyonları
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/request-password-reset', { email });
    return response.data;
  },
  
  verifyResetCode: async (resetToken, code) => {
    const response = await api.post('/auth/verify-reset-code', { 
      resetToken, 
      code 
    });
    return response.data;
  },
  
  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    const response = await api.post('/auth/reset-password', { 
      resetToken, 
      newPassword, 
      confirmPassword 
    });
    return response.data;
  }
};

// Şifre sıfırlama isteği gönder
export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/request-password-reset', { email });
  return response.data;
};

// SMS kodunu doğrula
export const verifyResetCode = async (resetToken, code) => {
  const response = await api.post('/auth/verify-reset-code', { 
    resetToken, 
    code 
  });
  return response.data;
};

// Yeni şifre belirle
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  const response = await api.post('/auth/reset-password', { 
    resetToken, 
    newPassword, 
    confirmPassword 
  });
  return response.data;
};

// Öğrenci profili al
export const getStudentProfile = () => {
  console.log('API Base URL:', API_URL); // API URL'yi kontrol et
  console.log('Calling student profile with token:', localStorage.getItem('token'));
  console.log('Full API URL:', `${API_URL}/student/profile`); // Tam URL
  return api.get('/student/profile'); // Bu yolu kontrol et
};

// Öğrenci profilini güncelle
export const updateStudentProfile = (profileData) => {
  return api.put('/student/profile', profileData);
};

// Profil resmi yükle
export const uploadProfileImage = (formData) => {
  return api.post('/student/upload/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Öğrenci projelerini al
export const getStudentProjects = () => {
  return api.get('/student/projects');
};

// Proje detayı al
export const getStudentProject = (projectId) => {
  return api.get(`/student/projects/${projectId}`);
};

// Yeni proje ekle
export const addStudentProject = (projectData) => {
  return api.post('/student/projects', projectData);
};

// Proje güncelle
export const updateStudentProject = (projectId, projectData) => {
  return api.put(`/student/projects/${projectId}`, projectData);
};

// Proje sil
export const deleteProject = (projectId) => {
  return api.delete(`/student/projects/${projectId}`);
};

// Proje medyası yükle
export const uploadProjectMedia = (projectId, formData) => {
  return api.post(`/student/projects/${projectId}/media`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      
    },
  });
};

// Öğrenciye atanan işleri al
export const getAssignedJobs = () => {
  return api.get('/student/assigned-jobs');
};

// İş detayını al
export const getJobDetail = (jobId) => {
  return api.get(`/student/assigned-jobs/${jobId}`);
};

export const getStudentMessages = () => {
  return api.get('/student/messages');
};

export const markMessageAsRead = (messageId) => {
  return api.put(`/student/messages/${messageId}/read`);
};

// services/adminApi.js'ye eklenecek
export const getEvents = () => api.get('/admin/events');
export const createEvent = (eventData) => api.post('/admin/events', eventData);
export const updateEvent = (id, eventData) => api.put(`/admin/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);

// services/studentApi.js'ye eklenecek  
export const getActiveEvents = () => api.get('/student/events');
export const getEventDetails = (id) => api.get(`/student/events/${id}`);

export const getActiveProjectIdeas = (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== 'all') searchParams.append('category', params.category);
  if (params.difficulty && params.difficulty !== 'all') searchParams.append('difficulty', params.difficulty);
  if (params.search) searchParams.append('search', params.search);
  
  const queryString = searchParams.toString();
  const url = queryString ? `/student/project-ideas?${queryString}` : '/student/project-ideas';
  
  return api.get(url);
};

export const getProjectIdeaDetails = (id) => {
  return api.get(`/student/project-ideas/${id}`);
};

export const getSimilarProjectIdeas = (id) => {
  return api.get(`/student/project-ideas/${id}/similar`);
};

// İş deneyimlerini al
export const getWorkExperiences = () => {
  return api.get('/student/work-experiences');
};

// Tek iş deneyimi al
export const getWorkExperience = (experienceId) => {
  return api.get(`/student/work-experiences/${experienceId}`);
};

// Yeni iş deneyimi ekle
export const addWorkExperience = (experienceData) => {
  return api.post('/student/work-experiences', experienceData);
};

// İş deneyimi güncelle
export const updateWorkExperience = (experienceId, experienceData) => {
  return api.put(`/student/work-experiences/${experienceId}`, experienceData);
};

// İş deneyimi sil
export const deleteWorkExperience = (experienceId) => {
  return api.delete(`/student/work-experiences/${experienceId}`);
};

export default api;