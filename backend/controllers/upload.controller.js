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
    const projectId = req.params.projectId;
    
    // req.files (çoğul) kontrol et çünkü array upload kullanıyoruz
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
    
    // Projeyi bul
    const project = await StudentProject.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    
    // Mevcut medya dizisini al veya boş array oluştur
    let media = [];
    if (project.media) {
      try {
        media = JSON.parse(project.media);
      } catch (e) {
        media = [];
      }
    }
    
    // Her yüklenen dosya için doğru URL'yi ekle
    const fileNames = req.files.map(file => file.filename);
    media = [...media, ...fileNames];
    
    // Media array'ini güncelle
    await project.update({ media: JSON.stringify(media) });
    
    res.status(200).json({
      message: 'Proje medyası başarıyla yüklendi',
      filenames: fileNames,
      media: media // Tüm media dosyalarını döndür
    });
  } catch (error) {
    console.error('Proje medyası yükleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};