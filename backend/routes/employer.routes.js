// routes/employer.routes.js
const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

// Tüm rotaları koruma
router.use(authMiddleware.verifyToken, authMiddleware.isEmployer);

// Profil yönetimi
router.get('/profile', employerController.getProfile);
router.put('/profile', employerController.updateProfile);

// Profil resmi yükleme
router.post('/upload/profile-image', uploadMiddleware.uploadProfileImage, employerController.uploadProfileImage);

// İş ilanları
router.post('/jobs', employerController.createJob);
router.get('/jobs', employerController.getJobs);

// İş ilanı medyası yükleme
router.post('/jobs/upload-media', uploadMiddleware.uploadJobMedia, employerController.uploadJobMedia);

// Öğrenci detayları
router.get('/students/:id', employerController.getStudentDetails);

// Mesajlar
router.get('/messages', employerController.getMyMessages);
router.put('/messages/:id/read', employerController.markMessageAsRead);

router.post('/developer-requests', employerController.createDeveloperRequest);
router.get('/developer-requests', employerController.getDeveloperRequests);
router.get('/developer-requests/:id', employerController.getDeveloperRequestById);
router.put('/developer-requests/:id', employerController.updateDeveloperRequest);
router.delete('/developer-requests/:id', employerController.cancelDeveloperRequest);

module.exports = router;