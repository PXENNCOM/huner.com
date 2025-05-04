// controllers/student.controller.js
const db = require('../models');
const StudentProfile = db.StudentProfile;
const StudentProject = db.StudentProject;

// Öğrenci profili oluştur/güncelle
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = {
      fullName: req.body.fullName,
      age: req.body.age,
      city: req.body.city,
      school: req.body.school,
      educationLevel: req.body.educationLevel,
      currentGrade: req.body.currentGrade,
      department: req.body.department,
      languages: req.body.languages,
      linkedinProfile: req.body.linkedinProfile,
      githubProfile: req.body.githubProfile,
      // Mevcut alanlar
      studentDocument: req.body.studentDocument || null,
      skills: req.body.skills,
      profileImage: req.body.profileImage || null,
      shortBio: req.body.shortBio || null
    };
    
    // Bio uzunluğunu kontrol et
    if (profileData.shortBio && profileData.shortBio.length > 280) {
      return res.status(400).json({ message: 'Bio en fazla 280 karakter olmalıdır' });
    }
    
    // LinkedIn ve GitHub URL formatlarını kontrol et
    if (profileData.linkedinProfile && !profileData.linkedinProfile.includes('linkedin.com')) {
      return res.status(400).json({ message: 'Geçerli bir LinkedIn profil URL\'si girin' });
    }
    
    if (profileData.githubProfile && !profileData.githubProfile.includes('github.com')) {
      return res.status(400).json({ message: 'Geçerli bir GitHub profil URL\'si girin' });
    }
    
    // Mevcut profili kontrol et
    let profile = await StudentProfile.findOne({ where: { userId } });
    
    if (profile) {
      // Güncelle
      await profile.update(profileData);
    } else {
      // Oluştur
      profile = await StudentProfile.create({
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

// controllers/student.controller.js - getProfile fonksiyonu
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let profile = await db.StudentProfile.findOne({ 
      where: { userId },
      include: [
        {
          model: db.User,
          attributes: ['email', 'approvalStatus']
        }
      ]
    });
    
    // Profil yoksa oluştur
    if (!profile) {
      profile = await db.StudentProfile.create({
        userId,
        fullName: null,
        age: null,
        city: null,
        school: null,
        educationLevel: null,
        currentGrade: null,
        department: null,
        languages: null,
        linkedinProfile: null,
        githubProfile: null,
        studentDocument: null,
        skills: null,
        profileImage: null,
        shortBio: null
      });
      
      // İlişkili kullanıcı bilgilerini al
      const user = await db.User.findByPk(userId, {
        attributes: ['email', 'approvalStatus']
      });
      
      // Profil objesine kullanıcı bilgilerini manuel olarak ekle
      profile.dataValues.User = user;
    }
    
    // Profil tamamlanma yüzdesini hesapla
    const totalFields = Object.keys(db.StudentProfile.rawAttributes).length - 3;
    let completedFields = 0;
    
    Object.keys(profile.dataValues).forEach(key => {
      if (profile[key] && key !== 'id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt') {
        completedFields++;
      }
    });
    
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    
    res.status(200).json({
      profile,
      completionPercentage
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.addProject = async (req, res) => {
  try {
    // Öğrenci profilini bul
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    // Proje oluştur
    const project = await StudentProject.create({
      studentId: studentProfile.id,
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies,
      media: req.body.media,
      githubUrl: req.body.githubUrl || null,
      liveUrl: req.body.liveUrl || null,
      projectType: req.body.projectType || 'personal'
    });
    
    res.status(201).json({
      message: 'Proje başarıyla eklendi',
      project
    });
  } catch (error) {
    console.error('Proje ekleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Projeleri getir
exports.getProjects = async (req, res) => {
  try {
    // Öğrenci profilini bul
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    // Projeleri getir
    const projects = await StudentProject.findAll({ where: { studentId: studentProfile.id } });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Projeleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    const project = await db.StudentProject.findOne({
      where: { 
        id: projectId,
        studentId: studentProfile.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Proje detayı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Atanan işleri görüntüle (öğrenci için salt okunur)
exports.getAssignedJobs = async (req, res) => {
  try {
    // Öğrenci profilini bul
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    // Atanan işleri getir
    const jobs = await db.Job.findAll({ 
      where: { 
        assignedTo: studentProfile.id
      },
      include: [
        {
          model: db.EmployerProfile,
          attributes: ['fullName', 'companyName']
        }
      ]
    });
    
    // İş durumlarını daha anlaşılır hale getir
    const enhancedJobs = jobs.map(job => {
      const jobData = job.toJSON();
      
      // Durumu Türkçe ve daha açıklayıcı hale getir
      let statusDescription = '';
      let statusColor = '';
      
      switch(job.status) {
        case 'pending':
          statusDescription = 'Beklemede';
          statusColor = 'orange';
          break;
        case 'approved':
          statusDescription = 'Onaylandı';
          statusColor = 'blue';
          break;
        case 'in_progress':
          statusDescription = 'Devam Ediyor';
          statusColor = 'green';
          break;
        case 'completed':
          statusDescription = 'Tamamlandı';
          statusColor = 'teal';
          break;
        case 'cancelled':
          statusDescription = 'İptal Edildi';
          statusColor = 'red';
          break;
        default:
          statusDescription = job.status;
          statusColor = 'gray';
      }
      
      // Zaman bilgisi ekle
      let timeInfo = '';
      const now = new Date();
      
      if (job.dueDate) {
        const dueDate = new Date(job.dueDate);
        
        if (job.status === 'in_progress') {
          const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0) {
            timeInfo = `Teslim tarihine ${diffDays} gün kaldı`;
          } else if (diffDays === 0) {
            timeInfo = 'Bugün teslim edilmesi gerekiyor';
          } else {
            timeInfo = `Teslim tarihi ${Math.abs(diffDays)} gün geçti`;
          }
        }
      }
      
      jobData.statusDescription = statusDescription;
      jobData.statusColor = statusColor;
      jobData.timeInfo = timeInfo;
      
      return jobData;
    });
    
    res.status(200).json(enhancedJobs);
  } catch (error) {
    console.error('Atanan işleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// Proje güncelle
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    const project = await db.StudentProject.findOne({
      where: { 
        id: projectId,
        studentId: studentProfile.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    
    // Projeyi güncelle
    const updatedProject = await project.update({
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies,
      media: req.body.media,
      githubUrl: req.body.githubUrl,
      liveUrl: req.body.liveUrl,
      projectType: req.body.projectType,
      isVisible: req.body.isVisible !== undefined ? req.body.isVisible : true
    });
    
    res.status(200).json({
      message: 'Proje başarıyla güncellendi',
      project: updatedProject
    });
  } catch (error) {
    console.error('Proje güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// Proje sil
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    const project = await db.StudentProject.findOne({
      where: { 
        id: projectId,
        studentId: studentProfile.id
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    
    // Projeyi sil
    await project.destroy();
    
    res.status(200).json({
      message: 'Proje başarıyla silindi'
    });
  } catch (error) {
    console.error('Proje silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Proje sıralamasını güncelle
exports.updateProjectOrder = async (req, res) => {
  try {
    const { projectOrder } = req.body; // [id1, id2, id3, ...] formatında proje ID'leri
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    // Sıralama için bir alan eklenmediyse, önce modeli güncelleyelim
    // Bu, SQL ile yapılabilir veya sequelize.sync({ alter: true }) ile
    
    // Her bir projeyi sırayla güncelle
    for (let i = 0; i < projectOrder.length; i++) {
      await db.StudentProject.update(
        { displayOrder: i },
        { 
          where: { 
            id: projectOrder[i],
            studentId: studentProfile.id
          }
        }
      );
    }
    
    res.status(200).json({
      message: 'Proje sıralaması başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Proje sıralama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// İş detaylarını görüntüle
exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.id;
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    // İşi bul
    const job = await db.Job.findOne({ 
      where: { 
        id: jobId,
        assignedTo: studentProfile.id
      },
      include: [
        {
          model: db.EmployerProfile,
          attributes: ['fullName', 'companyName', 'phoneNumber', 'email', 'city', 'address']
        }
      ]
    });
    
    if (!job) {
      return res.status(404).json({ message: 'İş bulunamadı veya size atanmamış' });
    }
    
    // Durumu daha anlaşılır hale getir
    const jobData = job.toJSON();
    
    let statusDescription = '';
    let statusColor = '';
    
    switch(job.status) {
      case 'pending':
        statusDescription = 'Beklemede';
        statusColor = 'orange';
        break;
      case 'approved':
        statusDescription = 'Onaylandı';
        statusColor = 'blue';
        break;
      case 'in_progress':
        statusDescription = 'Devam Ediyor';
        statusColor = 'green';
        break;
      case 'completed':
        statusDescription = 'Tamamlandı';
        statusColor = 'teal';
        break;
      case 'cancelled':
        statusDescription = 'İptal Edildi';
        statusColor = 'red';
        break;
      default:
        statusDescription = job.status;
        statusColor = 'gray';
    }
    
    // Zaman bilgisi ekle
    let timeInfo = '';
    const now = new Date();
    
    if (job.dueDate) {
      const dueDate = new Date(job.dueDate);
      
      if (job.status === 'in_progress') {
        const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
          timeInfo = `Teslim tarihine ${diffDays} gün kaldı`;
        } else if (diffDays === 0) {
          timeInfo = 'Bugün teslim edilmesi gerekiyor';
        } else {
          timeInfo = `Teslim tarihi ${Math.abs(diffDays)} gün geçti`;
        }
      }
    }
    
    // Başlangıç ve bitiş tarihlerini formatla
    let dateInfo = '';
    if (job.startDate) {
      const startDate = new Date(job.startDate).toLocaleDateString('tr-TR');
      
      if (job.dueDate) {
        const dueDate = new Date(job.dueDate).toLocaleDateString('tr-TR');
        dateInfo = `Başlangıç: ${startDate} - Bitiş: ${dueDate}`;
      } else {
        dateInfo = `Başlangıç: ${startDate}`;
      }
    }
    
    jobData.statusDescription = statusDescription;
    jobData.statusColor = statusColor;
    jobData.timeInfo = timeInfo;
    jobData.dateInfo = dateInfo;
    
    res.status(200).json(jobData);
  } catch (error) {
    console.error('İş detayları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// İşi tamamla
exports.completeJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const studentProfile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    // İşi bul ve kontrol et
    const job = await db.Job.findOne({ 
      where: { 
        id: jobId,
        assignedTo: studentProfile.id,
        status: 'assigned'
      }
    });
    
    if (!job) {
      return res.status(404).json({ message: 'İş bulunamadı veya size atanmamış' });
    }
    
    // İşi tamamlandı olarak işaretle
    await job.update({ status: 'completed' });
    
    res.status(200).json({ 
      message: 'İş başarıyla tamamlandı olarak işaretlendi',
      job
    });
  } catch (error) {
    console.error('İş tamamlama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};



// controllers/student.controller.js
exports.getEmployerDetails = async (req, res) => {
  try {
    const employerId = req.params.id;
    
    const employerProfile = await db.EmployerProfile.findOne({
      where: { id: employerId },
      include: [
        {
          model: db.User,
          attributes: ['email'] // E-posta bilgisini dahil et
        }
      ]
    });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }
    
    res.status(200).json(employerProfile);
  } catch (error) {
    console.error('İşveren detayları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};





// controllers/student.controller.js - getMyMessages fonksiyonu ekle
exports.getMyMessages = async (req, res) => {
  try {
    const studentProfile = await db.StudentProfile.findOne({ where: { userId: req.user.id } });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    const messages = await db.MessageRecipient.findAll({
      where: {
        recipientId: studentProfile.id,
        recipientType: 'student'
      },
      include: [
        {
          model: db.AdminMessage,
          attributes: ['id', 'title', 'content', 'priority', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Found messages:', messages.length); // Debug log
    
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
    const studentProfile = await db.StudentProfile.findOne({ where: { userId: req.user.id } });
    
    const recipient = await db.MessageRecipient.findOne({
      where: {
        messageId,
        recipientId: studentProfile.id,
        recipientType: 'student'
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