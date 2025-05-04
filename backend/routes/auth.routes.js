// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Kayıt ol
router.post('/register', authController.register);

// Giriş yap
router.post('/login', authController.login);

module.exports = router;