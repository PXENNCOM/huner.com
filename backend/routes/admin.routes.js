// Tam routes dosyası:
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
router.get('/students/:id', adminController.getStudentDetails);
router.get('/students/:id/projects', adminController.getStudentProjects);

// İş veren yönetimi
router.get('/employers', adminController.getAllEmployers);

// MESAJ YÖNETİMİ
router.post('/messages', adminController.sendMessage);
router.get('/messages', adminController.getSentMessages);
router.get('/messages/:id/stats', adminController.getMessageStats);

// ETKİNLİK YÖNETİMİ
router.get('/events', adminController.getAllEvents);
router.post('/events', adminController.createEvent);
router.get('/events/:id', adminController.getEventById);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);
router.put('/events/:id/status', adminController.updateEventStatus);

// PROJE FİKRİ YÖNETİMİ
router.get('/project-ideas', adminController.getAllProjectIdeas);
router.post('/project-ideas', adminController.createProjectIdea);
router.get('/project-ideas/:id', adminController.getProjectIdeaById);
router.put('/project-ideas/:id', adminController.updateProjectIdea);
router.delete('/project-ideas/:id', adminController.deleteProjectIdea);
router.put('/project-ideas/:id/status', adminController.updateProjectIdeaStatus);

// Admin yazılımcı talepleri rotaları
router.get('/developer-requests', adminController.getAllDeveloperRequests);
router.get('/developer-requests/stats', adminController.getDeveloperRequestStats);
router.get('/developer-requests/:id', adminController.getDeveloperRequestByIdAdmin);
router.put('/developer-requests/:id/status', adminController.updateDeveloperRequestStatus);
router.post('/developer-requests/:id/assign', adminController.assignDeveloperToRequest);
router.get('/employers/:id', adminController.getEmployerDetails);


module.exports = router;