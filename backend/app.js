// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./models');

const app = express();

// Upload klasörlerini oluştur
const uploadDirs = [
  'uploads',
  'uploads/profile-images',
  'uploads/student-documents',
  'uploads/project-media',
  'uploads/job-media'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors({
  origin: '*', // Geliştirme aşamasında tüm originlere izin verir
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statik dosyalar için klasörler
app.use('/uploads', express.static('uploads'));
app.use('/uploads/profile-images', express.static('uploads/profile-images'));
app.use('/uploads/project-media', express.static('uploads/project-media'));
app.use('/uploads/student-documents', express.static('uploads/student-documents'));
app.use('/uploads/job-media', express.static('uploads/job-media'));

// Veritabanı senkronizasyonu
db.sequelize.sync({ 
  alter: false, // Bu seçeneği false yapın
  force: false  // Bu da false olmalı
}).then(() => {
  console.log('Veritabanı tabloları güncellendi.');
});

// Request logger (diğer middleware'lerden önce olmalı)
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.path);
  next();
});

// Rotalar
app.get('/', (req, res) => {
  res.json({ message: 'Hüner API çalışıyor!' });
});

// API rotaları
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/employer', require('./routes/employer.routes'));
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Genel iş ilanları için public rota
app.use('/api/jobs', require('./routes/job.routes'));

// Hata yakalama middleware'i (en son olmalı)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Sunucu hatası!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Tüm rotaları konsolda göster (Hata ayıklama için)
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log("Route: ", r.route.path);
  }
});

// Router middleware rotalarını göster
app._router.stack.forEach(middleware => {
  if(middleware.route) { // Rotalar
    console.log('Route:', middleware.route.path, 'Methods:', Object.keys(middleware.route.methods));
  } else if(middleware.name === 'router') { // Router middleware
    middleware.handle.stack.forEach(handler => {
      if(handler.route) {
        const basePath = Object.keys(middleware.keys).length > 0 ? `/api${Object.keys(middleware.keys)[0]}` : '';
        const fullPath = basePath + handler.route.path;
        const methods = Object.keys(handler.route.methods);
        console.log(`Router Route: ${fullPath}, Methods: ${methods}`);
      }
    });
  }
});

module.exports = app;