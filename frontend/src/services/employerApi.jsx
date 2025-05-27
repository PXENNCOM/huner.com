// services/employerApi.js
import api from './api';

// İşveren profil hizmetleri
export const getEmployerProfile = () => {
  console.log('Calling getEmployerProfile, API base URL:', api.defaults.baseURL);
  const fullUrl = `${api.defaults.baseURL}/employer/profile`;
  console.log('Full URL being called:', fullUrl);
  
  return api.get('/employer/profile');
};

export const updateEmployerProfile = (profileData) => {
  return api.put('/employer/profile', profileData);
};

// Profil resmi yükleme
export const uploadEmployerProfileImage = (formData) => {
  return api.post('/employer/upload/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// İş ilanı hizmetleri
export const getEmployerJobs = () => {
  return api.get('/employer/jobs');
};

export const createJob = (jobData) => {
  return api.post('/employer/jobs', jobData);
};

// İş ilanı medyası yükleme
export const uploadJobMedia = (formData) => {
  return api.post('/employer/jobs/upload-media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Öğrenci detayları görüntüleme
export const getStudentDetails = (studentId) => {
  return api.get(`/employer/students/${studentId}`);
};

// Mesaj hizmetleri
export const getEmployerMessages = () => {
  return api.get('/employer/messages');
};

export const markMessageAsRead = (messageId) => {
  return api.put(`/employer/messages/${messageId}/read`);
};

// Yazılımcı talep fonksiyonları
export const createDeveloperRequest = (requestData) => {
  return api.post('/employer/developer-requests', requestData);
};

export const getDeveloperRequests = (params = {}) => {
  return api.get('/employer/developer-requests', { params });
};

export const getDeveloperRequestById = (id) => {
  return api.get(`/employer/developer-requests/${id}`);
};

export const updateDeveloperRequest = (id, requestData) => {
  return api.put(`/employer/developer-requests/${id}`, requestData);
};

export const cancelDeveloperRequest = (id) => {
  return api.delete(`/employer/developer-requests/${id}`);
};

export default {
  getEmployerProfile,
  updateEmployerProfile,
  uploadEmployerProfileImage,
  getEmployerJobs,
  createJob,
  uploadJobMedia,
  getStudentDetails,
  getEmployerMessages,
  markMessageAsRead,
   createDeveloperRequest,
  getDeveloperRequests,
  getDeveloperRequestById,
  updateDeveloperRequest,
  cancelDeveloperRequest
};