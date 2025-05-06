// controllers/auth.controller.js
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// controllers/auth.controller.js - register fonksiyonunda
exports.register = async (req, res) => {
  try {
    const { email, password, userType, fullName, linkedinProfile, githubProfile } = req.body;
    
    // E-posta kontrolü
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
    }
    
    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Kullanıcı oluşturma
    const user = await User.create({
      email,
      password: hashedPassword,
      userType,
      approvalStatus: userType === 'student' ? 'pending' : 'approved'
    });
    
    // Öğrenci için otomatik profil oluştur
    if (userType === 'student') {
      await db.StudentProfile.create({
        userId: user.id,
        // Gönderilen bilgileri kullan, yoksa null set et
        fullName: fullName || null,
        linkedinProfile: linkedinProfile || null,
        githubProfile: githubProfile || null,
        // Diğer alanlar için boş değerler
        age: null,
        city: null,
        school: null,
        educationLevel: null,
        currentGrade: null,
        department: null,
        languages: null,
        studentDocument: null,
        skills: null,
        profileImage: null,
        shortBio: null
      });
    }
    
    res.status(201).json({
      message: 'Kullanıcı kaydı başarıyla tamamlandı',
      userId: user.id,
      approvalStatus: user.approvalStatus
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kullanıcıyı bulma
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }
    
    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }
    
    // Onay durumu kontrolü
    if (user.userType === 'student' && user.approvalStatus !== 'approved') {
      if (user.approvalStatus === 'pending') {
        return res.status(403).json({ message: 'Hesabınız henüz onaylanmadı. Lütfen admin onayını bekleyin.' });
      } else if (user.approvalStatus === 'rejected') {
        return res.status(403).json({ 
          message: 'Hesabınız reddedildi.',
          reason: user.rejectionReason || 'Belirtilmemiş'
        });
      }
    }
    
    // JWT token oluşturma
    const token = jwt.sign(
      { id: user.id, userType: user.userType, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    console.log('Oluşturulan token:', token.substring(0, 15) + '...');
    console.log('Token payload:', { id: user.id, userType: user.userType, email: user.email });
    
    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType
      }

      
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

