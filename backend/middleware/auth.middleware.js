// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');
const User = db.User;

// JWT token doğrulama
exports.verifyToken = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(403).json({ message: 'Token sağlanmadı! Header yok.' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ 
        message: 'Token format hatası! Bearer ile başlamalı.', 
        receivedHeader: authHeader 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: 'Token ayrıştırılamadı!' });
    }
        
    try {
      // Token doğrulama işlemi
      const decoded = jwt.verify(token, config.jwtSecret);
      console.log('Token başarıyla doğrulandı:', decoded.id, decoded.userType);
      
      // Kullanıcı kontrolü
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı!' });
      }
      
      // userType kontrolü
      if (user.userType !== decoded.userType) {
        return res.status(401).json({ 
          message: 'Token kullanıcı tipi uyuşmuyor!',
          tokenType: decoded.userType,
          dbType: user.userType
        });
      }
      
      // Kullanıcı bilgilerini istek nesnesine ekle
      req.user = {
        id: user.id,
        email: user.email,
        userType: user.userType
      };
      
      next();
    } catch (jwtError) {
      console.error('JWT doğrulama hatası:', jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token süresi dolmuş!',
          expiredAt: jwtError.expiredAt
        });
      }
      
      return res.status(401).json({ 
        message: 'Geçersiz token!', 
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Token doğrulama genel hata:', error);
    return res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İşveren erişim kontrolü
exports.isEmployer = (req, res, next) => {
  if (req.user.userType !== 'employer') {
    return res.status(403).json({ message: 'Bu işlem için işveren yetkisi gerekiyor!' });
  }
  next();
};


// Admin erişim kontrolü
exports.isAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekiyor!' });
  }
  next();
};

exports.isStudent = (req, res, next) => {
  console.log('User type check:', req.user.userType); // Kullanıcı tipini kontrol et
  
  if (req.user.userType !== 'student') {
    return res.status(403).json({ 
      message: 'Bu işlem için öğrenci yetkisi gerekiyor!',
      currentType: req.user.userType 
    });
  }
  next();
};