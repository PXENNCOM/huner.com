// app.js - Production Ready Version
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

// CORS Middleware - Production için güvenli
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:80',
  'https://hunerly.com',
  'https://www.hunerly.com',
  process.env.FRONTEND_URL
].filter(Boolean); // undefined değerleri temizle

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Statik dosyalar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profile-images', express.static(path.join(__dirname, 'uploads/profile-images')));
app.use('/uploads/project-media', express.static(path.join(__dirname, 'uploads/project-media')));
app.use('/uploads/student-documents', express.static(path.join(__dirname, 'uploads/student-documents')));
app.use('/uploads/job-media', express.static(path.join(__dirname, 'uploads/job-media')));

// Request logging (Production'da sadece error logları)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Veritabanı senkronizasyonu
db.sequelize.sync({ 
  alter: false,
  force: false
}).then(() => {
  console.log('✅ Veritabanı bağlantısı başarılı');
}).catch(err => {
  console.error('❌ Veritabanı bağlantı hatası:', err);
});

// Ana sayfa
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hüner API çalışıyor!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint (Docker için)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: db.sequelize ? 'connected' : 'disconnected'
  });
});

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

// Talent routes
const talentRoutes = require('./routes/talent.routes');
app.use('/api/talent', talentRoutes);
console.log('✅ Talent routes mounted on /api/talent');

// Route listesini detaylı göster (sadece development'ta)
if (process.env.NODE_ENV === 'development') {
  function printRoutes(app, basePath = '') {
    const routes = [];
    
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        const path = basePath + middleware.route.path;
        const methods = Object.keys(middleware.route.methods);
        routes.push({ path, methods, type: 'direct' });
      } else if (middleware.name === 'router') {
        const layerRegex = middleware.regexp.toString();
        let extractedPath = '';
        
        if (layerRegex.includes('api')) {
          if (layerRegex.includes('auth')) extractedPath = '/api/auth';
          else if (layerRegex.includes('employer')) extractedPath = '/api/employer';
          else if (layerRegex.includes('student')) extractedPath = '/api/student';
          else if (layerRegex.includes('admin')) extractedPath = '/api/admin';
          else if (layerRegex.includes('jobs')) extractedPath = '/api/jobs';
          else if (layerRegex.includes('talent')) extractedPath = '/api/talent';
        }
        
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
    
    return routes;
  }

  setTimeout(() => {
    const routes = printRoutes(app);
    console.log(`\n📍 Total routes: ${routes.length}\n`);
  }, 100);
}

// 404 handler - Tüm route'lardan sonra
app.use('*', (req, res) => {
  // Production'da detaylı bilgi verme
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({
      message: 'Route not found',
      path: req.originalUrl
    });
  }

  // Development'ta detaylı bilgi ver
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
            const layerRegex = middleware.regexp.toString();
            let basePath = '';
            if (layerRegex.includes('employer')) basePath = '/api/employer';
            else if (layerRegex.includes('student')) basePath = '/api/student';
            else if (layerRegex.includes('admin')) basePath = '/api/admin';
            else if (layerRegex.includes('auth')) basePath = '/api/auth';
            else if (layerRegex.includes('jobs')) basePath = '/api/jobs';
            else if (layerRegex.includes('talent')) basePath = '/api/talent';
            
            availableRoutes.push(basePath + handler.route.path);
          }
        }
      });
    }
  });
  
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
  
  // Production'da detaylı hata mesajı verme
  const errorResponse = {
    message: 'Sunucu hatası!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  };
  
  // CORS hatası özel kontrolü
  if (err.message && err.message.includes('CORS')) {
    errorResponse.message = 'CORS policy error: Origin not allowed';
    return res.status(403).json(errorResponse);
  }
  
  res.status(err.status || 500).json(errorResponse);
});

module.exports = app;