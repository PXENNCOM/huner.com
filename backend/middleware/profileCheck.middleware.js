// middleware/profileCheck.middleware.js
const db = require('../models');

// İşveren profili kontrol middleware'i
exports.checkEmployerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // İşveren profilini bul
    const employerProfile = await db.EmployerProfile.findOne({ 
      where: { userId } 
    });
    
    if (!employerProfile) {
      return res.status(400).json({ 
        message: 'Profil bulunamadı. Önce profilinizi oluşturun.',
        redirectTo: '/employer/profile'
      });
    }
    
    // Zorunlu alanları kontrol et
    const requiredFields = [
      'fullName', 
      'companyName', 
      'position', 
      'industry', 
      'phoneNumber', 
      'city', 
      'address'
    ];
    
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!employerProfile[field] || employerProfile[field].trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      const fieldNames = {
        fullName: 'Ad Soyad',
        companyName: 'Şirket Adı',
        position: 'Pozisyon',
        industry: 'Sektör',
        phoneNumber: 'Telefon Numarası',
        city: 'Şehir',
        address: 'Adres'
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
      
      return res.status(400).json({ 
        message: `Profil bilgileriniz eksik. Lütfen şu alanları doldurun: ${missingFieldNames}`,
        missingFields: missingFields,
        redirectTo: '/employer/profile'
      });
    }
    
    // Profil tamamsa devam et
    req.employerProfile = employerProfile;
    next();
    
  } catch (error) {
    console.error('Profil kontrol hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// YENİ EKLENEN FONKSİYON - Rol kontrolü middleware'i
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // req.user.userType token'dan geliyor (auth.middleware.js'den)
    const userType = req.user?.userType;
    
    console.log('🔐 Role Check:', {
      userType,
      allowedRoles,
      hasAccess: allowedRoles.includes(userType)
    });
    
    if (!userType) {
      return res.status(401).json({ 
        success: false,
        message: 'Kullanıcı tipi bulunamadı' 
      });
    }
    
    // Kullanıcının rolü izin verilen roller arasında mı?
    if (!allowedRoles.includes(userType)) {
      return res.status(403).json({ 
        success: false,
        message: 'Bu işlem için yetkiniz yok',
        requiredRoles: allowedRoles,
        yourRole: userType
      });
    }
    
    console.log('✅ Role check passed');
    next();
  };
};