// backend/routes/talent.routes.js
const express = require('express');
const router = express.Router();
const talentController = require('../controllers/talent.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/profileCheck.middleware');

// Tüm route'lar authentication gerektirir
router.use(verifyToken);

// Sadece employer ve admin erişebilir
router.use(checkRole(['employer', 'admin']));

// Routes - ÖNEMLİ: /filters/options önce olmalı
router.get('/filters/options', talentController.getFilterOptions);
router.post('/search', talentController.searchTalents);
router.get('/:id', talentController.getTalentDetails);

module.exports = router;