// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Kayıt ve giriş
router.post('/register', authController.register);
router.post('/login', authController.login);

// ✅ EMAIL DOĞRULAMA ROUTE'LARI EKLE
router.post('/verify-email', authController.verifyEmail);  // ← EKLE
router.post('/resend-verification-code', authController.resendVerificationCode);  // ← EKLE

router.post('/test-email', authController.testEmail);  // ← EKLE


// Şifre sıfırlama
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);

module.exports = router;