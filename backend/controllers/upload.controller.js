// controllers/upload.controller.js
const db = require('../models');
const StudentProfile = db.StudentProfile;
const StudentProject = db.StudentProject;
const fs = require('fs');
const path = require('path');

// upload.controller.js - uploadProfileImage metodu
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Debug için
    console.log('Upload başladı - User ID:', userId);
    console.log('File alındı:', req.file);
    
    if (!req.file) {
      console.log('File bulunamadı');
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
    
    // Dosya adını alın
    const filename = req.file.filename;
    console.log('Yüklenen dosya adı:', filename);
    
    // Kullanıcının profilini güncelle
    let profile = await StudentProfile.findOne({ where: { userId } });
    console.log('Mevcut profil:', profile ? 'Bulundu' : 'Bulunamadı');
    
    if (profile) {
      // Eski profil resmini kontrol et ve sil
      if (profile.profileImage) {
        const oldImagePath = path.join(process.cwd(), 'uploads/profile-images', profile.profileImage);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('Eski profil resmi silindi:', oldImagePath);
          } catch (err) {
            console.error('Eski resim silinirken hata:', err);
          }
        }
      }
      
      // Profil resmini güncelle
      console.log('Profil güncelleniyor...');
      await profile.update({ profileImage: filename });
    } else {
      console.log('Yeni profil oluşturuluyor...');
      profile = await StudentProfile.create({
        userId,
        profileImage: filename,
        // Diğer varsayılan değerler
        fullName: null,
        age: null,
        city: null,
        school: null,
        educationLevel: null
      });
    }
    
    console.log('Profil başarıyla güncellendi. Yeni dosya adı:', filename);
    
    res.status(200).json({
      message: 'Profil resmi başarıyla yüklendi',
      filename: filename
    });
  } catch (error) {
    console.error('Profil resmi yükleme hatası:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


exports.uploadProjectMedia = async (req, res) => {
  try {
    const projectId = req.params.id; // ✅ :id parametresini kullan
    
    console.log('=== PROJECT MEDIA UPLOAD DEBUG ===');
    console.log('Project ID:', projectId);
    console.log('User ID:', req.user?.id);
    console.log('Files received:', req.files?.length || 0);
    
    // Dosya kontrolü
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
    
    // Öğrenci profilini bul
    const studentProfile = await db.StudentProfile.findOne({ 
      where: { userId: req.user.id } 
    });
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Öğrenci profili bulunamadı' });
    }
    
    console.log('Student Profile ID:', studentProfile.id);
    
    // Projeyi bul VE öğrenciye ait olduğunu doğrula
    const project = await db.StudentProject.findOne({
      where: { 
        id: projectId,
        studentId: studentProfile.id // ✅ Güvenlik kontrolü
      }
    });
    
    if (!project) {
      console.log('Project not found or not owned by student');
      return res.status(404).json({ message: 'Proje bulunamadı veya size ait değil' });
    }
    
    console.log('Project found:', project.id);
    
    // Mevcut medya dizisini al
    let media = [];
    if (project.media) {
      try {
        media = JSON.parse(project.media);
        console.log('Existing media count:', media.length);
      } catch (e) {
        console.error('Media parse error:', e);
        media = [];
      }
    }
    
    // Yeni dosyaları ekle
    const newFileNames = req.files.map(file => file.filename);
    media = [...media, ...newFileNames];
    
    console.log('New files added:', newFileNames);
    console.log('Total media count:', media.length);
    
    // Projeyi güncelle
    await project.update({ media: JSON.stringify(media) });
    
    console.log('Project media updated successfully');
    console.log('=== DEBUG END ===');
    
    res.status(200).json({
      success: true,
      message: 'Proje medyası başarıyla yüklendi',
      filenames: newFileNames,
      totalMedia: media.length
    });
    
  } catch (error) {
    console.error('❌ Proje medyası yükleme hatası:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};