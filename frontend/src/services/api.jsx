import axios from 'axios';

// API temel URL'si
const API_URL = 'http://localhost:3001/api';


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
  }
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

export default api;