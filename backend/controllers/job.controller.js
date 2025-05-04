// controllers/job.controller.js
const db = require('../models');
const Job = db.Job;
const EmployerProfile = db.EmployerProfile;

// Onaylı iş ilanlarını getir (public)
exports.getApprovedJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { status: 'approved' },
      include: [
        {
          model: EmployerProfile,
          attributes: ['fullName', 'companyName']
        }
      ]
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('İş ilanları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

// İş ilanı detayını getir (public)
exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const job = await Job.findOne({
      where: { 
        id: jobId,
        status: 'approved'
      },
      include: [
        {
          model: EmployerProfile,
          attributes: ['fullName', 'companyName', 'city']
        }
      ]
    });
    
    if (!job) {
      return res.status(404).json({ message: 'İş ilanı bulunamadı' });
    }
    
    res.status(200).json(job);
  } catch (error) {
    console.error('İş ilanı detayı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};