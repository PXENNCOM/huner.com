// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Tüm rotaları koruma
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

// İş ilanı yönetimi
router.get('/jobs/pending', adminController.getPendingJobs);
router.put('/jobs/:id/approve', adminController.approveJob);
router.post('/jobs/assign', adminController.assignJobToStudent);
router.put('/jobs/:id/status', adminController.updateJobStatus);
router.post('/jobs/:id/progress-note', adminController.addProgressNote);
router.get('/jobs', adminController.getAllJobs);

// Öğrenci yönetimi
router.get('/students', adminController.getAllStudents);
router.get('/students/pending', adminController.getPendingStudents);
router.get('/students/rejected', adminController.getRejectedStudents);
router.put('/students/:id/approve', adminController.approveStudent);
router.put('/students/:id/reject', adminController.rejectStudent);

// İş veren yönetimi
router.get('/employers', adminController.getAllEmployers);

// MESAJ YÖNETİMİ - YENİ EKLENECEK
router.post('/messages', adminController.sendMessage);
router.get('/messages', adminController.getSentMessages);
router.get('/messages/:id/stats', adminController.getMessageStats);

module.exports = router;