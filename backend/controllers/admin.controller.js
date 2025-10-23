// controllers/admin.controller.js
const db = require('../models');
const Job = db.Job;
const StudentProfile = db.StudentProfile;
const EmployerProfile = db.EmployerProfile;

// Bekleyen iş ilanlarını getir
exports.getPendingJobs = async (req, res) => {
  try {
    const pendingJobs = await Job.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: EmployerProfile,
          attributes: ['fullName', 'companyName']
        }
      ]
    });
    
    res.status(200).json(pendingJobs);
  } catch (error) {
    console.error('Bekleyen iş ilanları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İş ilanını onayla
exports.approveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const job = await Job.findByPk(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'İş ilanı bulunamadı' });
    }
    
    if (job.status !== 'pending') {
      return res.status(400).json({ message: 'Bu iş ilanı zaten onaylanmış veya reddedilmiş' });
    }
    
    // İlanı onayla
    await job.update({ status: 'approved' });
    
    res.status(200).json({
      message: 'İş ilanı başarıyla onaylandı',
      job
    });
  } catch (error) {
    console.error('İş ilanı onaylama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.assignJobToStudent = async (req, res) => {
  try {
    const { jobId, studentId, startDate, dueDate } = req.body;
    
    // İş ilanını kontrol et
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'İş ilanı bulunamadı' });
    }
    
    if (job.status !== 'approved') {
      return res.status(400).json({ message: 'Bu iş ilanı henüz onaylanmamış' });
    }
    
    // Öğrenciyi kontrol et
    const student = await StudentProfile.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    // Tarihleri kontrol et
    const now = new Date();
    const start = startDate ? new Date(startDate) : now;
    const due = dueDate ? new Date(dueDate) : null;
    
    if (due && due <= start) {
      return res.status(400).json({ message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır' });
    }
    
    // İşi öğrenciye ata
    await job.update({
      assignedTo: studentId,
      status: 'in_progress', // Doğrudan in_progress yapıyoruz
      startDate: start,
      dueDate: due
    });
    
    res.status(200).json({
      message: 'İş başarıyla öğrenciye atandı',
      job
    });
  } catch (error) {
    console.error('İş atama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İş durumunu güncelle
exports.updateJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status, notes } = req.body;
    
    if (!['in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz iş durumu. Sadece "in_progress", "completed" veya "cancelled" olabilir.' });
    }
    
    const job = await Job.findByPk(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'İş ilanı bulunamadı' });
    }
    
    const updateData = { 
      status: status,
      notes: notes || job.notes
    };
    
    // Eğer iş tamamlandıysa, tamamlanma tarihini ayarla
    if (status === 'completed') {
      updateData.completedDate = new Date();
    }
    
    // İş durumunu güncelle
    await job.update(updateData);
    
    let message = '';
    if (status === 'in_progress') message = 'İş devam ediyor olarak işaretlendi';
    else if (status === 'completed') message = 'İş tamamlandı olarak işaretlendi';
    else if (status === 'cancelled') message = 'İş iptal edildi olarak işaretlendi';
    
    res.status(200).json({
      message: message,
      job
    });
  } catch (error) {
    console.error('İş durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İlerleme notu ekle
exports.addProgressNote = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { progressNote } = req.body;
    
    const job = await Job.findByPk(jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'İş ilanı bulunamadı' });
    }
    
    if (job.status !== 'in_progress') {
      return res.status(400).json({ message: 'Sadece devam eden işlere ilerleme notu eklenebilir' });
    }
    
    // Mevcut notları kontrol et ve yeni notu ekle
    const currentNotes = job.progressNotes ? job.progressNotes : '';
    const dateStr = new Date().toLocaleString();
    const newNote = `[${dateStr}] ${progressNote}\n\n`;
    const updatedNotes = newNote + currentNotes;
    
    // İlerleme notunu güncelle
    await job.update({ progressNotes: updatedNotes });
    
    res.status(200).json({
      message: 'İlerleme notu başarıyla eklendi',
      job
    });
  } catch (error) {
    console.error('İlerleme notu ekleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};



// Tüm öğrencileri getir
exports.getAllStudents = async (req, res) => {
  try {
    // ✅ Users tablosundan student'ları çek, profil opsiyonel olsun
    const users = await db.User.findAll({
      where: {
        userType: 'student'
      },
      include: [
        {
          model: db.StudentProfile,
          required: false  // ← LEFT JOIN (profil yoksa da getir)
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Veriyi düzenle (frontend'in beklediği formata çevir)
    const students = users.map(user => {
      const profile = user.StudentProfile || {};
      return {
        id: profile.id || null,
        userId: user.id,
        fullName: profile.fullName || 'Belirtilmemiş',
        age: profile.age,
        phoneNumber: profile.phoneNumber,
        city: profile.city,
        school: profile.school || 'Belirtilmemiş',
        educationLevel: profile.educationLevel,
        currentGrade: profile.currentGrade,
        department: profile.department,
        languages: profile.languages,
        linkedinProfile: profile.linkedinProfile,
        githubProfile: profile.githubProfile,
        studentDocument: profile.studentDocument,
        skills: profile.skills,
        profileImage: profile.profileImage,
        shortBio: profile.shortBio,
        createdAt: user.createdAt,
        updatedAt: profile.updatedAt || user.updatedAt,
        User: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          isActive: user.isActive,
          approvalStatus: user.approvalStatus
        }
      };
    });
    
    res.status(200).json(students);
  } catch (error) {
    console.error('Öğrencileri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Tüm iş ilanlarını getir
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: EmployerProfile,
          attributes: ['fullName', 'companyName']
        },
        {
          model: StudentProfile,
          attributes: ['fullName', 'school'],
          as: 'AssignedStudent'
        }
      ]
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('İş ilanlarını getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


// controllers/admin.controller.js
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await db.EmployerProfile.findAll({
      include: [
        {
          model: db.User,
          attributes: ['email', 'createdAt', 'isActive']
        }
      ]
    });
    
    res.status(200).json(employers);
  } catch (error) {
    console.error('İşverenleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};


exports.getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await db.User.findAll({
      where: {
        userType: 'student',
        approvalStatus: 'pending'
      }
    });
    
    res.status(200).json(pendingStudents);
  } catch (error) {
    console.error('Onay bekleyen öğrencileri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Reddedilen öğrencileri getir
exports.getRejectedStudents = async (req, res) => {
  try {
    const rejectedStudents = await db.User.findAll({
      where: {
        userType: 'student',
        approvalStatus: 'rejected'
      }
    });
    
    res.status(200).json(rejectedStudents);
  } catch (error) {
    console.error('Reddedilen öğrencileri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Öğrenci kaydını onayla
exports.approveStudent = async (req, res) => {
  try {
    const userId = req.params.id;
    
    console.log('Onaylama isteği alındı, User ID:', userId);
    
    const user = await db.User.findOne({
      where: {
        id: userId,
        userType: 'student'
      }
    });
    
    if (!user) {
      console.log('Öğrenci bulunamadı, ID:', userId);
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    console.log('Bulunan kullanıcı:', {
      id: user.id,
      email: user.email,
      approvalStatus: user.approvalStatus
    });
    
    // Öğrenciyi onayla
    await user.update({ 
      approvalStatus: 'approved', 
      rejectionReason: null 
    });
    
    console.log('Öğrenci başarıyla onaylandı');
    
    res.status(200).json({
      message: 'Öğrenci kaydı başarıyla onaylandı',
      user: {
        id: user.id,
        email: user.email,
        approvalStatus: 'approved'
      }
    });
  } catch (error) {
    console.error('Öğrenci onaylama hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu',
      error: error.message 
    });
  }
};

// Öğrenci kaydını reddet
exports.rejectStudent = async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;
    
    console.log('Reddetme isteği alındı, User ID:', userId, 'Sebep:', reason);
    
    const user = await db.User.findOne({
      where: {
        id: userId,
        userType: 'student'
      }
    });
    
    if (!user) {
      console.log('Öğrenci bulunamadı, ID:', userId);
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    console.log('Bulunan kullanıcı:', {
      id: user.id,
      email: user.email,
      approvalStatus: user.approvalStatus
    });
    
    // Öğrenciyi reddet
    await user.update({ 
      approvalStatus: 'rejected',
      rejectionReason: reason || 'Belirtilmemiş'
    });
    
    console.log('Öğrenci başarıyla reddedildi');
    
    res.status(200).json({
      message: 'Öğrenci kaydı reddedildi',
      user: {
        id: user.id,
        email: user.email,
        approvalStatus: 'rejected',
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    console.error('Öğrenci reddetme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu',
      error: error.message 
    });
  }
};




// controllers/admin.controller.js - sendMessage function
exports.sendMessage = async (req, res) => {
  try {
    const { title, content, recipientType, sendType, selectedRecipients, priority } = req.body;
    
    console.log('Received data:', { title, content, recipientType, sendType, selectedRecipients, priority });
    
    // Mesajı oluştur
    const message = await db.AdminMessage.create({
      title,
      content,
      recipientType,
      sendType,
      priority: priority || 'normal'
    });
    
    // Alıcıları belirle
    let recipients = [];
    
    if (sendType === 'all') {
      if (recipientType === 'students') {
        recipients = await db.StudentProfile.findAll();
      } else {
        recipients = await db.EmployerProfile.findAll();
      }
    } else if (sendType === 'selected') {
      // Seçilen alıcıları işle
      if (recipientType === 'students') {
        recipients = await db.StudentProfile.findAll({
          where: {
            id: selectedRecipients.map(id => parseInt(id)) // string'leri number'a çevir
          }
        });
      } else {
        recipients = await db.EmployerProfile.findAll({
          where: {
            id: selectedRecipients.map(id => parseInt(id)) // string'leri number'a çevir
          }
        });
      }
    }
    
    // Alıcı kayıtlarını oluştur
    for (const recipient of recipients) {
      console.log('Creating message recipient for:', recipient.id);
      await db.MessageRecipient.create({
        messageId: message.id,
        recipientId: recipient.id,
        recipientType: recipientType.slice(0, -1) // 'students' -> 'student'
      });
    }
    
    res.status(201).json({
      message: 'Mesaj başarıyla gönderildi',
      messageId: message.id,
      recipientCount: recipients.length
    });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu',
      error: error.message 
    });
  }
};

// Gönderilen mesajları listele
exports.getSentMessages = async (req, res) => {
  try {
    const messages = await db.AdminMessage.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.MessageRecipient,
          attributes: ['recipientId', 'recipientType', 'isRead']
        }
      ]
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Mesaj istatistiklerini getir
exports.getMessageStats = async (req, res) => {
  try {
    const messageId = req.params.id;
    
    const stats = await db.MessageRecipient.findAll({
      where: { messageId },
      attributes: [
        'recipientType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRecipients'],
        [sequelize.fn('SUM', sequelize.cast(sequelize.col('isRead'), 'integer')), 'readCount']
      ],
      group: ['recipientType']
    });
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Mesaj istatistiklerini getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};



// Detaylı öğrenci bilgilerini getir
exports.getStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Öğrenci profilini al
    const student = await db.StudentProfile.findOne({
      where: { id: studentId },
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'createdAt', 'isActive', 'approvalStatus', 'rejectionReason']
        }
      ]
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    console.error('Öğrenci detayları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.getStudentProjects = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Öğrenci profilini kontrol et
    const student = await db.StudentProfile.findByPk(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    // Projeleri getir
    const projects = await db.StudentProject.findAll({
      where: { studentId: studentId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Öğrenci projeleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await db.Event.findAll({
      order: [['eventDate', 'ASC']]
    });
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Etkinlikleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, image, eventDate, location, organizer } = req.body;
    
    // Tarih kontrolü
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ message: 'Etkinlik tarihi bugünden sonra olmalıdır' });
    }
    
    const event = await db.Event.create({
      title,
      description,
      image: image || null,
      eventDate,
      location,
      organizer,
      status: 'active'
    });
    
    res.status(201).json({
      message: 'Etkinlik başarıyla oluşturuldu',
      event
    });
  } catch (error) {
    console.error('Etkinlik oluşturma hatası:', error);
    
    // Sequelize validation hatalarını kontrol et
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Doğrulama hatası',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const event = await db.Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Etkinlik detayı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, image, eventDate, location, organizer, status } = req.body;
    
    const event = await db.Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }
    
    // Tarih kontrolü (sadece eventDate güncelleniyorsa)
    if (eventDate) {
      const selectedDate = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return res.status(400).json({ message: 'Etkinlik tarihi bugünden sonra olmalıdır' });
      }
    }
    
    const updatedEvent = await event.update({
      title: title || event.title,
      description: description || event.description,
      image: image !== undefined ? image : event.image,
      eventDate: eventDate || event.eventDate,
      location: location || event.location,
      organizer: organizer || event.organizer,
      status: status || event.status
    });
    
    res.status(200).json({
      message: 'Etkinlik başarıyla güncellendi',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Etkinlik güncelleme hatası:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Doğrulama hatası',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Etkinlik sil
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const event = await db.Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }
    
    await event.destroy();
    
    res.status(200).json({
      message: 'Etkinlik başarıyla silindi'
    });
  } catch (error) {
    console.error('Etkinlik silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { status } = req.body;
    
    if (!['active', 'inactive', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        message: 'Geçersiz durum. Sadece "active", "inactive" veya "cancelled" olabilir.' 
      });
    }
    
    const event = await db.Event.findByPk(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    }
    
    await event.update({ status });
    
    let message = '';
    if (status === 'active') message = 'Etkinlik aktif hale getirildi';
    else if (status === 'inactive') message = 'Etkinlik pasif hale getirildi';
    else if (status === 'cancelled') message = 'Etkinlik iptal edildi';
    
    res.status(200).json({
      message,
      event
    });
  } catch (error) {
    console.error('Etkinlik durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};



// Tüm proje fikirlerini getir
exports.getAllProjectIdeas = async (req, res) => {
  try {
    const projectIdeas = await db.ProjectIdea.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(projectIdeas);
  } catch (error) {
    console.error('Proje fikirlerini getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yeni proje fikri oluştur
exports.createProjectIdea = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      difficulty, 
      estimatedDays, 
      technologies, 
      resources, 
      requirements, 
      image 
    } = req.body;
    
    // Validasyon kontrolleri
    if (!title || !description || !category || !difficulty || !estimatedDays) {
      return res.status(400).json({ 
        message: 'Başlık, açıklama, kategori, zorluk ve tahmini süre alanları zorunludur' 
      });
    }

    const projectIdea = await db.ProjectIdea.create({
      title,
      description,
      category,
      difficulty,
      estimatedDays: parseInt(estimatedDays),
      technologies: technologies || null,
      resources: resources || null,
      requirements: requirements || null,
      image: image || null,
      status: 'active'
    });
    
    res.status(201).json({
      message: 'Proje fikri başarıyla oluşturuldu',
      projectIdea
    });
  } catch (error) {
    console.error('Proje fikri oluşturma hatası:', error);
    
    // Sequelize validation hatalarını kontrol et
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Doğrulama hatası',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Proje fikri detaylarını getir
exports.getProjectIdeaById = async (req, res) => {
  try {
    const projectIdeaId = req.params.id;
    
    const projectIdea = await db.ProjectIdea.findByPk(projectIdeaId);
    
    if (!projectIdea) {
      return res.status(404).json({ message: 'Proje fikri bulunamadı' });
    }
    
    res.status(200).json(projectIdea);
  } catch (error) {
    console.error('Proje fikri detayı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Proje fikri güncelle
exports.updateProjectIdea = async (req, res) => {
  try {
    const projectIdeaId = req.params.id;
    const { 
      title, 
      description, 
      category, 
      difficulty, 
      estimatedDays, 
      technologies, 
      resources, 
      requirements, 
      image, 
      status 
    } = req.body;
    
    const projectIdea = await db.ProjectIdea.findByPk(projectIdeaId);
    
    if (!projectIdea) {
      return res.status(404).json({ message: 'Proje fikri bulunamadı' });
    }
    
    const updatedProjectIdea = await projectIdea.update({
      title: title || projectIdea.title,
      description: description || projectIdea.description,
      category: category || projectIdea.category,
      difficulty: difficulty || projectIdea.difficulty,
      estimatedDays: estimatedDays ? parseInt(estimatedDays) : projectIdea.estimatedDays,
      technologies: technologies !== undefined ? technologies : projectIdea.technologies,
      resources: resources !== undefined ? resources : projectIdea.resources,
      requirements: requirements !== undefined ? requirements : projectIdea.requirements,
      image: image !== undefined ? image : projectIdea.image,
      status: status || projectIdea.status
    });
    
    res.status(200).json({
      message: 'Proje fikri başarıyla güncellendi',
      projectIdea: updatedProjectIdea
    });
  } catch (error) {
    console.error('Proje fikri güncelleme hatası:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Doğrulama hatası',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Proje fikri sil
exports.deleteProjectIdea = async (req, res) => {
  try {
    const projectIdeaId = req.params.id;
    
    const projectIdea = await db.ProjectIdea.findByPk(projectIdeaId);
    
    if (!projectIdea) {
      return res.status(404).json({ message: 'Proje fikri bulunamadı' });
    }
    
    await projectIdea.destroy();
    
    res.status(200).json({
      message: 'Proje fikri başarıyla silindi'
    });
  } catch (error) {
    console.error('Proje fikri silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Proje fikri durumunu güncelle
exports.updateProjectIdeaStatus = async (req, res) => {
  try {
    const projectIdeaId = req.params.id;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        message: 'Geçersiz durum. Sadece "active" veya "inactive" olabilir.' 
      });
    }
    
    const projectIdea = await db.ProjectIdea.findByPk(projectIdeaId);
    
    if (!projectIdea) {
      return res.status(404).json({ message: 'Proje fikri bulunamadı' });
    }
    
    await projectIdea.update({ status });
    
    const message = status === 'active' 
      ? 'Proje fikri aktif hale getirildi' 
      : 'Proje fikri pasif hale getirildi';
    
    res.status(200).json({
      message,
      projectIdea
    });
  } catch (error) {
    console.error('Proje fikri durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};





// Tüm yazılımcı taleplerini getir (Admin paneli için)
exports.getAllDeveloperRequests = async (req, res) => {
  try {
    // Sayfalama parametreleri
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filtreleme parametreleri
    const { status, priority, projectType, experienceLevel, workType } = req.query;
    const whereClause = {};

    if (status && ['pending', 'reviewing', 'approved', 'assigned', 'completed', 'cancelled'].includes(status)) {
      whereClause.status = status;
    }
    if (priority && ['normal', 'high', 'urgent'].includes(priority)) {
      whereClause.priority = priority;
    }
    if (projectType) {
      whereClause.projectType = projectType;
    }
    if (experienceLevel) {
      whereClause.experienceLevel = experienceLevel;
    }
    if (workType) {
      whereClause.workType = workType;
    }

    // Arama parametresi
    const search = req.query.search;
    if (search) {
  const { Op } = db.Sequelize; // Bu satırı ekleyin
  whereClause[Op.or] = [
    { projectTitle: { [Op.like]: `%${search}%` } },
    { projectDescription: { [Op.like]: `%${search}%` } }
  ];
}

    // Yazılımcı taleplerini getir
    const { count, rows: requests } = await db.DeveloperRequest.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [
        ['priority', 'DESC'], // Önce acil olanlar
        ['createdAt', 'DESC'] // Sonra en yeniler
      ],
      include: [
        {
          model: db.EmployerProfile,
          include: [
            {
              model: db.User,
              attributes: ['email']
            }
          ]
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      requests,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit
      },
      stats: {
        total: count,
        pending: await db.DeveloperRequest.count({ where: { status: 'pending' } }),
        reviewing: await db.DeveloperRequest.count({ where: { status: 'reviewing' } }),
        approved: await db.DeveloperRequest.count({ where: { status: 'approved' } }),
        assigned: await db.DeveloperRequest.count({ where: { status: 'assigned' } }),
        urgent: await db.DeveloperRequest.count({ where: { priority: 'urgent' } })
      }
    });

  } catch (error) {
    console.error('Admin yazılımcı talepleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Belirli bir yazılımcı talebini getir (Admin)
exports.getDeveloperRequestByIdAdmin = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await db.DeveloperRequest.findByPk(requestId, {
      include: [
        {
          model: db.EmployerProfile,
          include: [
            {
              model: db.User,
              attributes: ['email']
            }
          ]
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Yazılımcı talebi bulunamadı' });
    }

    res.status(200).json(request);

  } catch (error) {
    console.error('Admin yazılımcı talebi getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yazılımcı talebini onaylama/reddetme (Admin)
exports.updateDeveloperRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status, adminNotes } = req.body;

    // Geçerli status değerlerini kontrol et
    const validStatuses = ['pending', 'reviewing', 'approved', 'assigned', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Geçersiz status değeri',
        validStatuses
      });
    }

    const request = await db.DeveloperRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Yazılımcı talebi bulunamadı' });
    }

    // Status güncelle
    await request.update({
      status,
      adminNotes: adminNotes || request.adminNotes
    });

    // Güncellenen talebi döndür
    const updatedRequest = await db.DeveloperRequest.findByPk(requestId, {
      include: [
        {
          model: db.EmployerProfile,
          include: [
            {
              model: db.User,
              attributes: ['email']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: 'Yazılımcı talebi durumu güncellendi',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Admin yazılımcı talebi güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yazılımcı talebi istatistikleri (Admin dashboard için)
exports.getDeveloperRequestStats = async (req, res) => {
  try {
    const stats = {
      total: await db.DeveloperRequest.count(),
      byStatus: {
        pending: await db.DeveloperRequest.count({ where: { status: 'pending' } }),
        reviewing: await db.DeveloperRequest.count({ where: { status: 'reviewing' } }),
        approved: await db.DeveloperRequest.count({ where: { status: 'approved' } }),
        assigned: await db.DeveloperRequest.count({ where: { status: 'assigned' } }),
        completed: await db.DeveloperRequest.count({ where: { status: 'completed' } }),
        cancelled: await db.DeveloperRequest.count({ where: { status: 'cancelled' } })
      },
      byPriority: {
        normal: await db.DeveloperRequest.count({ where: { priority: 'normal' } }),
        high: await db.DeveloperRequest.count({ where: { priority: 'high' } }),
        urgent: await db.DeveloperRequest.count({ where: { priority: 'urgent' } })
      },
      byProjectType: {},
      byExperienceLevel: {},
      byWorkType: {},
      recentRequests: await db.DeveloperRequest.count({
        where: {
          createdAt: {
            [db.Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Son 7 gün
          }
        }
      })
    };

    // Proje tiplerine göre dağılım
    const projectTypes = ['website', 'mobile_app', 'api', 'ecommerce', 'crm', 'desktop_app', 'other'];
    for (const type of projectTypes) {
      stats.byProjectType[type] = await db.DeveloperRequest.count({ where: { projectType: type } });
    }

    // Deneyim seviyelerine göre dağılım
    const experienceLevels = ['intern', 'junior', 'mid', 'senior'];
    for (const level of experienceLevels) {
      stats.byExperienceLevel[level] = await db.DeveloperRequest.count({ where: { experienceLevel: level } });
    }

    // Çalışma türlerine göre dağılım
    const workTypes = ['freelance', 'part_time', 'full_time', 'intern'];
    for (const type of workTypes) {
      stats.byWorkType[type] = await db.DeveloperRequest.count({ where: { workType: type } });
    }

    res.status(200).json(stats);

  } catch (error) {
    console.error('Admin yazılımcı talebi istatistikleri hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Yazılımcı ataması yapma (Admin)
exports.assignDeveloperToRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { developerId } = req.body;

    // Yazılımcı talebini bul
    const request = await db.DeveloperRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Yazılımcı talebi bulunamadı' });
    }

    // Yazılımcıyı bul
    const developer = await db.StudentProfile.findByPk(developerId);
    if (!developer) {
      return res.status(404).json({ message: 'Yazılımcı profili bulunamadı' });
    }

    // Atamayı yap
    await request.update({
      assignedDeveloperId: developerId,
      assignedAt: new Date(),
      status: 'assigned'
    });

    // Güncellenmiş talebi döndür
    const updatedRequest = await db.DeveloperRequest.findByPk(requestId, {
      include: [
        {
          model: db.EmployerProfile,
          include: [{ model: db.User, attributes: ['email'] }]
        },
        {
          model: db.StudentProfile,
          as: 'AssignedDeveloper',
          include: [{ model: db.User, attributes: ['email'] }]
        }
      ]
    });

    res.status(200).json({
      message: 'Yazılımcı başarıyla atandı',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Yazılımcı atama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İşveren detaylarını görüntüleme (Admin)
exports.getEmployerDetails = async (req, res) => {
  try {
    const employerId = req.params.id;
    
    const employerProfile = await db.EmployerProfile.findByPk(employerId, {
      include: [
        {
          model: db.User,
          attributes: ['email', 'createdAt', 'approvalStatus', 'isActive']
        }
      ]
    });
    
    if (!employerProfile) {
      return res.status(404).json({ message: 'İşveren profili bulunamadı' });
    }

    // İşverenin toplam talep sayısı
    const totalRequests = await db.DeveloperRequest.count({
      where: { employerId: employerId }
    });

    // İşverenin iş ilanları
    const jobs = await db.Job.findAll({
      where: { employerId: employerId },
      attributes: ['id', 'title', 'status', 'createdAt'],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      employer: employerProfile,
      stats: {
        totalRequests,
        totalJobs: jobs.length
      },
      recentJobs: jobs
    });

  } catch (error) {
    console.error('İşveren detayları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};