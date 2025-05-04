// services/adminApi.js

import api from './api';

// Öğrenci yönetimi
export const ogrenciYonetimi = {
  tumOgrencileriGetir: () => api.get('/admin/students'),
  bekleyenOgrencileriGetir: () => api.get('/admin/students/pending'),
  reddedilenOgrencileriGetir: () => api.get('/admin/students/rejected'),
  ogrenciOnayla: (kullaniciId) => api.put(`/admin/students/${kullaniciId}/approve`),
  ogrenciReddet: (kullaniciId, sebep) => api.put(`/admin/students/${kullaniciId}/reject`, { reason: sebep })
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

export default {
  ogrenciYonetimi,
  isYonetimi,
  isverenYonetimi,
  mesajSistemi
};