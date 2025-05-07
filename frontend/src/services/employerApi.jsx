// services/employerApi.js
import api from './api';

// İşveren profil hizmetleri
export const getEmployerProfile = () => {
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

export default {
  getEmployerProfile,
  updateEmployerProfile,
  uploadEmployerProfileImage,
  getEmployerJobs,
  createJob,
  uploadJobMedia,
  getStudentDetails,
  getEmployerMessages,
  markMessageAsRead
};