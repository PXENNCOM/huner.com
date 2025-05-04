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
    const students = await db.StudentProfile.findAll({
      include: [
        {
          model: db.User,
          attributes: ['email', 'createdAt', 'isActive', 'approvalStatus']
        }
      ]
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


// controllers/admin.controller.js - yeni metodlar ekle
// Onay bekleyen öğrencileri getir
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
    
    const user = await db.User.findOne({
      where: {
        id: userId,
        userType: 'student',
        approvalStatus: 'pending'
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Onay bekleyen öğrenci bulunamadı' });
    }
    
    // Öğrenciyi onayla
    await user.update({ approvalStatus: 'approved', rejectionReason: null });
    
    res.status(200).json({
      message: 'Öğrenci kaydı başarıyla onaylandı',
      user: {
        id: user.id,
        email: user.email,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    console.error('Öğrenci onaylama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// Öğrenci kaydını reddet
exports.rejectStudent = async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;
    
    const user = await db.User.findOne({
      where: {
        id: userId,
        userType: 'student'
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }
    
    // Öğrenciyi reddet
    await user.update({ 
      approvalStatus: 'rejected',
      rejectionReason: reason || 'Belirtilmemiş'
    });
    
    res.status(200).json({
      message: 'Öğrenci kaydı reddedildi',
      user: {
        id: user.id,
        email: user.email,
        approvalStatus: user.approvalStatus,
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    console.error('Öğrenci reddetme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
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