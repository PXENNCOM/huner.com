// routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

// Public rotalar (kimlik doğrulama gerektirmez)
router.get('/', jobController.getApprovedJobs);
router.get('/:id', jobController.getJobDetails);

module.exports = router;