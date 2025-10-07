// routes/employer.routes.js - Debug eklenmeli versiyon
const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');
const profileCheckMiddleware = require('../middleware/profileCheck.middleware');

console.log('🔧 Loading employer routes...');

// Debug middleware - Her employer route'u için
router.use((req, res, next) => {
  console.log(`📍 Employer Route Hit: ${req.method} ${req.originalUrl}`);
  console.log(`📍 Route Path: ${req.route?.path || 'N/A'}`);
  console.log(`📍 User Info:`, req.user ? { id: req.user.id, userType: req.user.userType } : 'No user');
  next();
});

// Tüm rotaları koruma
router.use(authMiddleware.verifyToken, authMiddleware.isEmployer);

// Profil yönetimi (profil kontrolü gerekmez)
router.get('/profile', (req, res, next) => {
  console.log('🎯 GET /profile route hit');
  next();
}, employerController.getProfile);

router.put('/profile', (req, res, next) => {
  console.log('🎯 PUT /profile route hit');
  next();
}, employerController.updateProfile);

// Profil resmi yükleme
router.post('/upload/profile-image', 
  uploadMiddleware.uploadProfileImage, 
  employerController.uploadProfileImage
);

// İş ilanları
router.post('/jobs', 
  profileCheckMiddleware.checkEmployerProfile, 
  employerController.createJob
);

router.get('/jobs', (req, res, next) => {
  console.log('🎯 GET /jobs route hit');
  next();
}, employerController.getJobs);

// İş ilanı medyası yükleme
router.post('/jobs/upload-media', 
  profileCheckMiddleware.checkEmployerProfile, 
  uploadMiddleware.uploadJobMedia, 
  employerController.uploadJobMedia
);

// Öğrenci detayları
router.get('/students/:id', employerController.getStudentDetails);

// Mesajlar
router.get('/messages', (req, res, next) => {
  console.log('🎯 GET /messages route hit');
  next();
}, employerController.getMyMessages);

router.put('/messages/:id/read', employerController.markMessageAsRead);

// Yazılımcı talepleri
router.post('/developer-requests', 
  profileCheckMiddleware.checkEmployerProfile, 
  employerController.createDeveloperRequest
);

router.get('/developer-requests', (req, res, next) => {
  console.log('🎯 GET /developer-requests route hit');
  next();
}, employerController.getDeveloperRequests);

router.get('/developer-requests/:id', employerController.getDeveloperRequestById);

router.put('/developer-requests/:id', 
  profileCheckMiddleware.checkEmployerProfile, 
  employerController.updateDeveloperRequest
);

router.delete('/developer-requests/:id', employerController.cancelDeveloperRequest);

// Route'ları konsola yazdır
console.log('📋 Employer routes loaded:');
router.stack.forEach((layer, index) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`  ${index + 1}. ${methods.padEnd(10)} /api/employer${layer.route.path}`);
  }
});

module.exports = router;