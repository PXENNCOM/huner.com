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
    
    const profile = await EmployerProfile.findOne({ 
      where: { userId },
      include: [
        {
          model: db.User,
          attributes: ['email'] // Sadece email bilgisini al
        }
      ]
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profil bulunamadı' });
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
    // İşveren profilini bul
    const employerProfile = await EmployerProfile.findOne({ where: { userId: req.user.id } });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }
    
    // İş ilanlarını getir
    const jobs = await Job.findAll({ where: { employerId: employerProfile.id } });
    
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