// config/config.js
module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,  // ✅ 'port' olmalı ve sayı tipinde
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',  
  database: process.env.DB_NAME || 'huner_db',
  dialect: 'mysql', 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  jwtSecret: process.env.JWT_SECRET || 'huner-secret-key',
  jwtExpiration: '24h'
};