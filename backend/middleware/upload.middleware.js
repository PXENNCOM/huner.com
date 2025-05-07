const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dosyaları yüklemek için klasörler
const profileImagesDir = 'uploads/profile-images';
const studentDocumentsDir = 'uploads/student-documents';
const projectMediaDir = 'uploads/project-media';
const jobMediaDir = 'uploads/job-media';

// Klasörlerin varlığını kontrol et ve oluştur
[profileImagesDir, studentDocumentsDir, projectMediaDir, jobMediaDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory created: ${dir}`);
  }
});

// Dosya tipi kontrolü
const fileFilter = (req, file, cb) => {
  // İzin verilen dosya tipleri
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Hata: Sadece .jpeg, .jpg, .png, .gif, .pdf, .doc, .docx dosyaları yüklenebilir!');
  }
};

// Profil resimleri için storage
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir);
  },
  filename: (req, file, cb) => {
    // Hataları önlemek için dosya adında user.id kontrolü yapın
    const userId = req.user?.id || 'unknown';
    const fileName = `${Date.now()}-${userId}${path.extname(file.originalname)}`;
    console.log(`Creating profile image: ${fileName}`);
    cb(null, fileName);
  }
});

// Öğrenci belgeleri için storage
const studentDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, studentDocumentsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${req.user.id}${path.extname(file.originalname)}`);
  }
});

// Proje medyaları için storage
const projectMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectMediaDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-project-${req.params.projectId || 'new'}${path.extname(file.originalname)}`);
  }
});

// İş ilanı medyaları için storage
const jobMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, jobMediaDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-job-${req.params.jobId || 'new'}${path.extname(file.originalname)}`);
  }
});

// Upload middlewares
exports.uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limiti (arttırıldı)
  fileFilter
}).single('profileImage');

exports.uploadStudentDocument = multer({
  storage: studentDocStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
}).single('studentDocument');

exports.uploadProjectMedia = multer({
  storage: projectMediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
}).array('media', 5); // En fazla 5 dosya

exports.uploadJobMedia = multer({
  storage: jobMediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
}).array('media', 5); // En fazla 5 dosya