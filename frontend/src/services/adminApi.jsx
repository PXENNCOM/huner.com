// services/adminApi.js
import api from './api';

// Öğrenci yönetimi
export const ogrenciYonetimi = {
  tumOgrencileriGetir: () => api.get('/admin/students'),
  bekleyenOgrencileriGetir: () => api.get('/admin/students/pending'),
  reddedilenOgrencileriGetir: () => api.get('/admin/students/rejected'),
  ogrenciOnayla: (kullaniciId) => api.put(`/admin/students/${kullaniciId}/approve`),
  ogrenciReddet: (kullaniciId, sebep) => api.put(`/admin/students/${kullaniciId}/reject`, { reason: sebep }),
  // Yeni eklenen servisler
  ogrenciDetayGetir: (ogrenciId) => api.get(`/admin/students/${ogrenciId}`),
  ogrenciProjeleriGetir: (ogrenciId) => api.get(`/admin/students/${ogrenciId}/projects`)
};

// İş ilanı yönetimi
export const isYonetimi = {
  tumIsleriGetir: () => api.get('/admin/jobs'),
  bekleyenIsleriGetir: () => api.get('/admin/jobs/pending'),
  isOnayla: (isId) => api.put(`/admin/jobs/${isId}/approve`),
  isAta: (veri) => api.post('/admin/jobs/assign', veri),
  isDurumunuGuncelle: (isId, veri) => api.put(`/admin/jobs/${isId}/status`, veri),
  ilerlemNotuEkle: (isId, veri) => api.post(`/admin/jobs/${isId}/progress-note`, veri)
};

// İşveren yönetimi
export const isverenYonetimi = {
  tumIsverenleriGetir: () => api.get('/admin/employers')
};

// Mesajlaşma sistemi
export const mesajSistemi = {
  mesajGonder: (veri) => api.post('/admin/messages', veri),
  gonderilenMesajlariGetir: () => api.get('/admin/messages'),
  mesajIstatistikleriGetir: (mesajId) => api.get(`/admin/messages/${mesajId}/stats`)
};

// Etkinlik yönetimi
export const getEvents = () => {
  return api.get('/admin/events');
};

export const createEvent = (eventData) => {
  return api.post('/admin/events', eventData);
};

export const getEventById = (id) => {
  return api.get(`/admin/events/${id}`);
};

export const updateEvent = (id, eventData) => {
  return api.put(`/admin/events/${id}`, eventData);
};

export const deleteEvent = (id) => {
  return api.delete(`/admin/events/${id}`);
};

export const updateEventStatus = (id, status) => {
  return api.put(`/admin/events/${id}/status`, { status });
};

// PROJE FİKRİ YÖNETİMİ
export const projeYonetimi = {
  tumProjeleriGetir: () => api.get('/admin/project-ideas'),
  projeOlustur: (projeVerisi) => api.post('/admin/project-ideas', projeVerisi),
  projeDetayGetir: (projeId) => api.get(`/admin/project-ideas/${projeId}`),
  projeGuncelle: (projeId, projeVerisi) => api.put(`/admin/project-ideas/${projeId}`, projeVerisi),
  projeSil: (projeId) => api.delete(`/admin/project-ideas/${projeId}`),
  projeDurumunuGuncelle: (projeId, durum) => api.put(`/admin/project-ideas/${projeId}/status`, { status: durum })
};

// Proje fikri API fonksiyonları (alternatif kullanım için)
export const getProjectIdeas = () => {
  return api.get('/admin/project-ideas');
};

export const createProjectIdea = (projectData) => {
  return api.post('/admin/project-ideas', projectData);
};

export const getProjectIdeaById = (id) => {
  return api.get(`/admin/project-ideas/${id}`);
};

export const updateProjectIdea = (id, projectData) => {
  return api.put(`/admin/project-ideas/${id}`, projectData);
};

export const deleteProjectIdea = (id) => {
  return api.delete(`/admin/project-ideas/${id}`);
};

export const updateProjectIdeaStatus = (id, status) => {
  return api.put(`/admin/project-ideas/${id}/status`, { status });
};

export const yazilimciTalepleri = {
  tumTalepleriGetir: (params = {}) => api.get('/admin/developer-requests', { params }),
  talepDetayiGetir: (talepId) => api.get(`/admin/developer-requests/${talepId}`),
  durumGuncelle: (talepId, veri) => api.put(`/admin/developer-requests/${talepId}/status`, veri),
  istatistikleriGetir: () => api.get('/admin/developer-requests/stats'),
  yazilimciAta: (talepId, veri) => api.post(`/admin/developer-requests/${talepId}/assign`, veri)
};

// İşveren detayları
export const isverenDetay = {
  isverenBilgisiGetir: (isverenId) => api.get(`/admin/employers/${isverenId}`)
};


export const talentArama = {
  yetenekAra: (filtreler) => api.post('/talent/search', filtreler),
  yetenekDetayiGetir: (ogrenciId) => api.get(`/talent/${ogrenciId}`),
  filtreSecenekleriGetir: () => api.get('/talent/filters/options')
};

export default {
  ogrenciYonetimi,
  isYonetimi,
  isverenYonetimi,
  mesajSistemi,
  projeYonetimi,
   yazilimciTalepleri, 
  isverenDetay,
  talentArama       
};