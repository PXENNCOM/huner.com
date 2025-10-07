// controllers/employer.controller.js
const db = require('../models');
const EmployerProfile = db.EmployerProfile;
const Job = db.Job;

// İşveren profili oluştur/güncelle
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = {
      fullName: req.body.fullName,
      companyName: req.body.companyName,
      position: req.body.position,
      industry: req.body.industry,
      companyWebsite: req.body.companyWebsite,
      phoneNumber: req.body.phoneNumber,
      city: req.body.city,
      address: req.body.address,
      age: req.body.age,
      profileImage: req.body.profileImage || null
    };
    
    // Profil var mı kontrol et
    let profile = await EmployerProfile.findOne({ where: { userId } });
    
    if (profile) {
      // Güncelle
      await profile.update(profileData);
    } else {
      // Oluştur
      profile = await EmployerProfile.create({
        ...profileData,
        userId
      });
    }
    
    res.status(200).json({
      message: 'Profil başarıyla güncellendi',
      profile
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İşveren profilini getir
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting profile for userId:', userId);
    
    let profile = await EmployerProfile.findOne({ 
      where: { userId },
      include: [
        {
          model: db.User,
          attributes: ['email'] // Sadece email bilgisini al
        }
      ]
    });
    
    console.log('Profile found:', profile ? 'Yes' : 'No');
    
    if (!profile) {
      console.log('Profile not found, creating default profile for userId:', userId);
      
      // Kullanıcı bilgilerini al
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }
      
      // Varsayılan profil oluştur
      profile = await EmployerProfile.create({
        userId: userId,
        fullName: null,
        companyName: null,
        position: null,
        industry: null,
        companyWebsite: null,
        phoneNumber: null,
        city: null,
        address: null,
        age: null,
        profileImage: null
      });
      
      // User ilişkisini manuel olarak ekle
      profile.User = user;
      
      console.log('Default profile created:', profile.id);
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İş ilanı oluştur
exports.createJob = async (req, res) => {
  try {
    // İşveren profilini bul
    const employerProfile = await EmployerProfile.findOne({ where: { userId: req.user.id } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }
    
    // İş ilanı oluştur
    const job = await Job.create({
      employerId: employerProfile.id,
      title: req.body.title,
      description: req.body.description,
      media: req.body.media,
      status: 'pending' // Admin onayı bekliyor
    });
    
    res.status(201).json({
      message: 'İş ilanı başarıyla oluşturuldu ve onay bekliyor',
      job
    });
  } catch (error) {
    console.error('İş ilanı oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İşveren iş ilanlarını getir
exports.getJobs = async (req, res) => {
  try {
    // İşveren profilini bul veya oluştur
    let employerProfile = await EmployerProfile.findOne({ where: { userId: req.user.id } });
    
    if (!employerProfile) {
      console.log('Employer profile not found, creating for userId:', req.user.id);
      
      // Varsayılan profil oluştur
      employerProfile = await EmployerProfile.create({
        userId: req.user.id,
        fullName: null,
        companyName: null,
        position: null,
        industry: null,
        companyWebsite: null,
        phoneNumber: null,
        city: null,
        address: null,
        age: null,
        profileImage: null
      });
    }
    
    // İş ilanlarını getir
    const jobs = await Job.findAll({ 
      where: { employerId: employerProfile.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('İş ilanları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// controllers/employer.controller.js
exports.getStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const studentProfile = await db.StudentProfile.findOne({
      where: { id: studentId },
      include: [
        {
          model: db.User,
          attributes: ['email'] // E-posta bilgisini dahil et
        }
      ]
    });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    res.status(200).json(studentProfile);
  } catch (error) {
    console.error('Öğrenci detayları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};




// controllers/employer.controller.js - mesaj fonksiyonları ekle

// İşverenin mesajlarını getir
exports.getMyMessages = async (req, res) => {
  try {
    const employerProfile = await db.EmployerProfile.findOne({ where: { userId: req.user.id } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }
    
    const messages = await db.MessageRecipient.findAll({
      where: {
        recipientId: employerProfile.id,
        recipientType: 'employer'
      },
      include: [
        {
          model: db.AdminMessage,
          attributes: ['id', 'title', 'content', 'priority', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Mesajı okundu olarak işaretle
exports.markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const employerProfile = await db.EmployerProfile.findOne({ where: { userId: req.user.id } });
    
    const recipient = await db.MessageRecipient.findOne({
      where: {
        messageId,
        recipientId: employerProfile.id,
        recipientType: 'employer'
      }
    });
    
    if (!recipient) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    
    await recipient.update({
      isRead: true,
      readAt: new Date()
    });
    
    res.status(200).json({ message: 'Mesaj okundu olarak işaretlendi' });
  } catch (error) {
    console.error('Mesaj okuma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// controllers/employer.controller.js (Mevcut dosyaya ekle)
// Profil resmi yükleme
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const userId = req.user.id;
    const filename = req.file.filename;

    // İşveren profilini bul
    const profile = await EmployerProfile.findOne({ where: { userId } });

    if (profile) {
      // Eski profil resmini kontrol et ve sil (isteğe bağlı)
      if (profile.profileImage) {
        const oldImagePath = path.join(process.cwd(), 'uploads/profile-images', profile.profileImage);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Eski resim silinirken hata:', err);
          }
        }
      }

      // Profil resmini güncelle
      await profile.update({ profileImage: filename });
    } else {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }

    res.status(200).json({
      message: 'Profil resmi başarıyla yüklendi',
      filename: filename
    });
  } catch (error) {
    console.error('Profil resmi yükleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İş ilanı medyası yükleme
exports.uploadJobMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }

    const filenames = req.files.map(file => file.filename);

    res.status(200).json({
      message: 'Medya dosyaları başarıyla yüklendi',
      filenames: filenames
    });
  } catch (error) {
    console.error('İş ilanı medyası yükleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yazılımcı talep formu oluştur
exports.createDeveloperRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // İşveren profilini bul
    const employerProfile = await db.EmployerProfile.findOne({ where: { userId } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }

    // Gelen verileri doğrula
    const {
      projectTitle,
      projectDescription,
      projectType,
      technologies,
      experienceLevel,
      workType,
      startDate,
      workStyle,
      duration,
      location,
      workHours,
      teamSize,
      communicationLanguages,
      industryExperience,
      priority,
      budgetRange
    } = req.body;

    // Zorunlu alanları kontrol et
    if (!projectTitle || !projectDescription || !projectType || !experienceLevel || 
        !workType || !startDate || !duration || !workStyle || !workHours || !teamSize) {
      return res.status(400).json({ 
        message: 'Zorunlu alanlar eksik',
        required: ['projectTitle', 'projectDescription', 'projectType', 'experienceLevel', 
                  'workType', 'startDate','duration', 'workStyle', 'workHours', 'teamSize']
      });
    }

    // Yazılımcı talebini oluştur
    const developerRequest = await db.DeveloperRequest.create({
      employerId: employerProfile.id,
      projectTitle,
      projectDescription,
      projectType,
      technologies: technologies || [],
      experienceLevel,
      workType,
      startDate,
      duration,
      workStyle,
      location: location || null,
      workHours,
      teamSize,
      communicationLanguages: communicationLanguages || [],
      industryExperience: industryExperience || null,
      priority: priority || 'normal',
      budgetRange: budgetRange || null,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Yazılımcı talebi başarıyla oluşturuldu',
      request: developerRequest
    });

  } catch (error) {
    console.error('Yazılımcı talebi oluşturma hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// İşverenin yazılımcı taleplerini getir
exports.getDeveloperRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // İşveren profilini bul veya oluştur
    let employerProfile = await db.EmployerProfile.findOne({ where: { userId } });
    
    if (!employerProfile) {
      console.log('Employer profile not found, creating for userId:', userId);
      
      // Varsayılan profil oluştur
      employerProfile = await db.EmployerProfile.create({
        userId: userId,
        fullName: null,
        companyName: null,
        position: null,
        industry: null,
        companyWebsite: null,
        phoneNumber: null,
        city: null,
        address: null,
        age: null,
        profileImage: null
      });
    }

    // Yazılımcı taleplerini getir
    const requests = await db.DeveloperRequest.findAll({ 
      where: { employerId: employerProfile.id },
      order: [['createdAt', 'DESC']]
    });
    
    // JSON alanları parse et
    const parsedRequests = requests.map(request => {
      const requestData = request.toJSON();
      
      // Technologies parse et
      if (requestData.technologies && typeof requestData.technologies === 'string') {
        try {
          requestData.technologies = JSON.parse(requestData.technologies);
        } catch (e) {
          console.warn('Technologies parse error for request', requestData.id, ':', e);
          requestData.technologies = [];
        }
      }
      
      // Communication languages parse et
      if (requestData.communicationLanguages && typeof requestData.communicationLanguages === 'string') {
        try {
          requestData.communicationLanguages = JSON.parse(requestData.communicationLanguages);
        } catch (e) {
          console.warn('CommunicationLanguages parse error for request', requestData.id, ':', e);
          requestData.communicationLanguages = [];
        }
      }
      
      // Array olmayan durumlar için fallback
      if (!Array.isArray(requestData.technologies)) {
        requestData.technologies = [];
      }
      
      if (!Array.isArray(requestData.communicationLanguages)) {
        requestData.communicationLanguages = [];
      }
      
      return requestData;
    });
    
    res.status(200).json({ requests: parsedRequests });

  } catch (error) {
    console.error('Yazılımcı talepleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.getDeveloperRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;
    
    // İşveren profilini bul
    const employerProfile = await db.EmployerProfile.findOne({ where: { userId } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }

    // Yazılımcı talebini getir
    const request = await db.DeveloperRequest.findOne({
      where: { 
        id: requestId, 
        employerId: employerProfile.id 
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Yazılımcı talebi bulunamadı' });
    }

    // JSON parse et
    const requestData = request.toJSON();
    
    // Technologies parse et
    if (requestData.technologies && typeof requestData.technologies === 'string') {
      try {
        requestData.technologies = JSON.parse(requestData.technologies);
      } catch (e) {
        console.warn('Technologies parse error:', e);
        requestData.technologies = [];
      }
    }
    
    // Communication languages parse et
    if (requestData.communicationLanguages && typeof requestData.communicationLanguages === 'string') {
      try {
        requestData.communicationLanguages = JSON.parse(requestData.communicationLanguages);
      } catch (e) {
        console.warn('CommunicationLanguages parse error:', e);
        requestData.communicationLanguages = [];
      }
    }
    
    // Array olmayan durumlar için fallback
    if (!Array.isArray(requestData.technologies)) {
      requestData.technologies = [];
    }
    
    if (!Array.isArray(requestData.communicationLanguages)) {
      requestData.communicationLanguages = [];
    }

    res.status(200).json(requestData);

  } catch (error) {
    console.error('Yazılımcı talebi getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yazılımcı talebini güncelle (sadece pending durumundayken)
exports.updateDeveloperRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;
    
    // İşveren profilini bul
    const employerProfile = await db.EmployerProfile.findOne({ where: { userId } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }

    // Yazılımcı talebini bul
    const request = await db.DeveloperRequest.findOne({
      where: { 
        id: requestId, 
        employerId: employerProfile.id 
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Yazılımcı talebi bulunamadı' });
    }

    // Sadece pending durumundaki talepler güncellenebilir
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Sadece beklemedeki talepler güncellenebilir',
        currentStatus: request.status
      });
    }

    // Güncelleme verilerini hazırla
    const updateData = {};
    const allowedFields = [
      'projectTitle', 'projectDescription', 'projectType', 'technologies',
      'experienceLevel', 'workType', 'duration', 'startDate', 'workStyle',
      'location', 'workHours', 'teamSize', 'communicationLanguages',
      'industryExperience', 'priority', 'budgetRange'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Güncelle
    await request.update(updateData);

    res.status(200).json({
      message: 'Yazılımcı talebi başarıyla güncellendi',
      request
    });

  } catch (error) {
    console.error('Yazılımcı talebi güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yazılımcı talebini iptal et
exports.cancelDeveloperRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;
    
    // İşveren profilini bul
    const employerProfile = await db.EmployerProfile.findOne({ where: { userId } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }

    // Yazılımcı talebini bul
    const request = await db.DeveloperRequest.findOne({
      where: { 
        id: requestId, 
        employerId: employerProfile.id 
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Yazılımcı talebi bulunamadı' });
    }

    // Sadece pending ve reviewing durumundaki talepler iptal edilebilir
    if (!['pending', 'reviewing'].includes(request.status)) {
      return res.status(400).json({ 
        message: 'Bu durumda olan talepler iptal edilemez',
        currentStatus: request.status
      });
    }

    // İptal et
    await request.update({ status: 'cancelled' });

    res.status(200).json({
      message: 'Yazılımcı talebi başarıyla iptal edildi'
    });

  } catch (error) {
    console.error('Yazılımcı talebi iptal etme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};
