// server.js
require('dotenv').config(); // .env dosyasını yükle
const app = require('./app');


// app.js dosyasının sonuna, server başlamadan önce ekleyin
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.path);
  next();
});

// Tüm rotaları konsolda göster
app._router.stack.forEach(middleware => {
  if(middleware.route) { // Rotalar
    console.log('Route:', middleware.route.path, 'Methods:', Object.keys(middleware.route.methods));
  } else if(middleware.name === 'router') { // Router middleware
    middleware.handle.stack.forEach(handler => {
      if(handler.route) {
        const path = handler.route.path;
        const methods = Object.keys(handler.route.methods);
        console.log('Router Route:', path, 'Methods:', methods);
      }
    });
  }
});

const PORT = process.env.PORT || 3001;

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});