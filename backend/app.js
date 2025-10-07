// app.js - Debug iyileştirmeli versiyon
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
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statik dosyalar
app.use('/uploads', express.static('uploads'));
app.use('/uploads/profile-images', express.static('uploads/profile-images'));
app.use('/uploads/project-media', express.static('uploads/project-media'));
app.use('/uploads/student-documents', express.static('uploads/student-documents'));
app.use('/uploads/job-media', express.static('uploads/job-media'));

// Veritabanı senkronizasyonu
db.sequelize.sync({ 
  alter: false,
  force: false
}).then(() => {
  console.log('Veritabanı tabloları güncellendi.');
});

// Detaylı request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Ana sayfa
app.get('/', (req, res) => {
  res.json({ message: 'Hüner API çalışıyor!' });
});

// API rotaları - Bu sıralama önemli!
console.log('📍 Mounting routes...');

// Auth routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted on /api/auth');

// Employer routes
const employerRoutes = require('./routes/employer.routes');
app.use('/api/employer', employerRoutes);
console.log('✅ Employer routes mounted on /api/employer');

// Student routes
const studentRoutes = require('./routes/student.routes');
app.use('/api/student', studentRoutes);
console.log('✅ Student routes mounted on /api/student');

// Admin routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);
console.log('✅ Admin routes mounted on /api/admin');

// Job routes (public)
const jobRoutes = require('./routes/job.routes');
app.use('/api/jobs', jobRoutes);
console.log('✅ Job routes mounted on /api/jobs');

const talentRoutes = require('./routes/talent.routes');
app.use('/api/talent', talentRoutes);
console.log('✅ Talent routes mounted on /api/talent');


// Route listesini detaylı göster
console.log('\n🔍 Registered routes:');
function printRoutes(app, basePath = '') {
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Direct routes
      const path = basePath + middleware.route.path;
      const methods = Object.keys(middleware.route.methods);
      routes.push({ path, methods, type: 'direct' });
    } else if (middleware.name === 'router') {
      // Router middleware
      const layerRegex = middleware.regexp.toString();
      let extractedPath = '';
      
      // /api/employer pattern extraction
      if (layerRegex.includes('api')) {
        if (layerRegex.includes('auth')) extractedPath = '/api/auth';
        else if (layerRegex.includes('employer')) extractedPath = '/api/employer';
        else if (layerRegex.includes('student')) extractedPath = '/api/student';
        else if (layerRegex.includes('admin')) extractedPath = '/api/admin';
        else if (layerRegex.includes('jobs')) extractedPath = '/api/jobs';
      }
      
      // Router içindeki route'ları göster
      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            const fullPath = extractedPath + handler.route.path;
            const methods = Object.keys(handler.route.methods);
            routes.push({ path: fullPath, methods, type: 'router' });
          }
        });
      }
    }
  });
  
  // Route'ları kategorize et
  const employerRoutes = routes.filter(r => r.path.startsWith('/api/employer'));
  const authRoutes = routes.filter(r => r.path.startsWith('/api/auth'));
  const studentRoutes = routes.filter(r => r.path.startsWith('/api/student'));
  const adminRoutes = routes.filter(r => r.path.startsWith('/api/admin'));
  const jobRoutes = routes.filter(r => r.path.startsWith('/api/jobs'));
  
  console.log('\n🔐 Auth Routes:');
  authRoutes.forEach(route => {
    console.log(`  ${route.methods.join(', ').toUpperCase().padEnd(10)} ${route.path}`);
  });
  
  console.log('\n💼 Employer Routes:');
  employerRoutes.forEach(route => {
    console.log(`  ${route.methods.join(', ').toUpperCase().padEnd(10)} ${route.path}`);
  });
  
  console.log('\n🎓 Student Routes:');
  studentRoutes.forEach(route => {
    console.log(`  ${route.methods.join(', ').toUpperCase().padEnd(10)} ${route.path}`);
  });
  
  console.log('\n⚙️ Admin Routes:');
  adminRoutes.forEach(route => {
    console.log(`  ${route.methods.join(', ').toUpperCase().padEnd(10)} ${route.path}`);
  });
  
  console.log('\n📋 Job Routes:');
  jobRoutes.forEach(route => {
    console.log(`  ${route.methods.join(', ').toUpperCase().padEnd(10)} ${route.path}`);
  });
  
  return routes;
}

// Middleware mount sonrası route'ları göster
setTimeout(() => {
  printRoutes(app);
}, 100);

// 404 handler - Tüm route'lardan sonra
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log('Available routes for this method:');
  
  const availableRoutes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods);
      if (methods.includes(req.method.toLowerCase())) {
        availableRoutes.push(middleware.route.path);
      }
    } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods);
          if (methods.includes(req.method.toLowerCase())) {
            // Base path extraction
            const layerRegex = middleware.regexp.toString();
            let basePath = '';
            if (layerRegex.includes('employer')) basePath = '/api/employer';
            else if (layerRegex.includes('student')) basePath = '/api/student';
            else if (layerRegex.includes('admin')) basePath = '/api/admin';
            else if (layerRegex.includes('auth')) basePath = '/api/auth';
            else if (layerRegex.includes('jobs')) basePath = '/api/jobs';
            
            availableRoutes.push(basePath + handler.route.path);
          }
        }
      });
    }
  });
  
  console.log('Available routes:', availableRoutes);
  
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableRoutes: availableRoutes,
    suggestion: 'Check the endpoint URL and HTTP method'
  });
});

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error('💥 Error occurred:');
  console.error(err.stack);
  res.status(500).json({
    message: 'Sunucu hatası!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;