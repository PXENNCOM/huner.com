// routes/employer.routes.js
const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Tüm rotaları koruma
router.use(authMiddleware.verifyToken, authMiddleware.isEmployer);

// Profil yönetimi
router.get('/profile', employerController.getProfile);
router.put('/profile', employerController.updateProfile);

// İş ilanları
router.post('/jobs', employerController.createJob);
router.get('/jobs', employerController.getJobs);

router.get('/students/:id', employerController.getStudentDetails);

router.get('/messages', employerController.getMyMessages);
router.put('/messages/:id/read', employerController.markMessageAsRead);


module.exports = router;