// routes/student.routes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

// Tüm rotaları koruma
router.use(authMiddleware.verifyToken, authMiddleware.isStudent);

// Profil yönetimi
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// Dosya yükleme
router.post('/upload/profile-image', uploadMiddleware.uploadProfileImage, uploadController.uploadProfileImage);

// Proje yönetimi
router.post('/projects', studentController.addProject);
router.get('/projects', studentController.getProjects);
router.get('/projects/:id', studentController.getProject);
router.put('/projects/:id', studentController.updateProject);
router.delete('/projects/:id', studentController.deleteProject);
router.post('/projects/order', studentController.updateProjectOrder);
router.post('/projects/:projectId/media', uploadMiddleware.uploadProjectMedia, uploadController.uploadProjectMedia);

// İş takibi
router.get('/assigned-jobs', studentController.getAssignedJobs);
router.get('/assigned-jobs/:id', studentController.getJobDetails);

router.get('/messages', studentController.getMyMessages); 
router.put('/messages/:id/read', studentController.markMessageAsRead);

module.exports = router;