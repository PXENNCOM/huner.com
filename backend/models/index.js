// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,  // ← EKLENDI
    dialect: config.dialect,  // ← config'den alındı
    pool: config.pool  // ← EKLENDI (opsiyonel ama iyi olur)
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Modelleri tanımla
db.User = require('./user.model')(sequelize, DataTypes);
db.EmployerProfile = require('./employerProfile.model')(sequelize, DataTypes);
db.StudentProfile = require('./studentProfile.model')(sequelize, DataTypes);
db.Job = require('./job.model')(sequelize, DataTypes);
db.StudentProject = require('./studentProject.model')(sequelize, DataTypes);
db.AdminMessage = require('./AdminMessage')(sequelize, DataTypes);
db.MessageRecipient = require('./MessageRecipient')(sequelize, DataTypes);
db.Event = require('./Event')(sequelize, DataTypes);
db.ProjectIdea = require('./ProjectIdea')(sequelize, DataTypes); 
db.DeveloperRequest = require('./developerRequest.model')(sequelize, DataTypes);
db.StudentWorkExperience = require('./StudentWorkExperience')(sequelize, Sequelize);

// İlişkileri tanımla
db.User.hasOne(db.EmployerProfile, { foreignKey: 'userId' });
db.EmployerProfile.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.StudentProfile, { foreignKey: 'userId' });
db.StudentProfile.belongsTo(db.User, { foreignKey: 'userId' });

db.EmployerProfile.hasMany(db.Job, { foreignKey: 'employerId' });
db.Job.belongsTo(db.EmployerProfile, { foreignKey: 'employerId' });

db.StudentProfile.hasMany(db.StudentProject, { 
  foreignKey: 'studentId',
  as: 'Projects'
});
db.StudentProject.belongsTo(db.StudentProfile, { foreignKey: 'studentId' });

db.StudentProfile.hasMany(db.StudentWorkExperience, {
  foreignKey: 'studentId',
  as: 'WorkExperiences'
});
db.StudentWorkExperience.belongsTo(db.StudentProfile, { foreignKey: 'studentId' });

db.Job.belongsTo(db.StudentProfile, { foreignKey: 'assignedTo', as: 'AssignedStudent' });
db.StudentProfile.hasMany(db.Job, { foreignKey: 'assignedTo', as: 'AssignedJobs' });

db.AdminMessage.hasMany(db.MessageRecipient, { foreignKey: 'messageId' });
db.MessageRecipient.belongsTo(db.AdminMessage, { foreignKey: 'messageId' });

db.EmployerProfile.hasMany(db.DeveloperRequest, { foreignKey: 'employerId' });
db.DeveloperRequest.belongsTo(db.EmployerProfile, { foreignKey: 'employerId' });

module.exports = db;