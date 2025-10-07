// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql'
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

// ✅ DEĞIŞEN KISIM - Projects alias'ı eklendi
db.StudentProfile.hasMany(db.StudentProject, { 
  foreignKey: 'studentId',
  as: 'Projects'  // ← EKLENDI
});
db.StudentProject.belongsTo(db.StudentProfile, { foreignKey: 'studentId' });

// ✅ DEĞIŞEN KISIM - WorkExperiences alias'ı da ekleyelim (tutarlılık için)
db.StudentProfile.hasMany(db.StudentWorkExperience, {
  foreignKey: 'studentId',
  as: 'WorkExperiences'  // ← EKLENDI
});
db.StudentWorkExperience.belongsTo(db.StudentProfile, { foreignKey: 'studentId' });

// Job ve Student ilişkisi (assignedTo için)
db.Job.belongsTo(db.StudentProfile, { foreignKey: 'assignedTo', as: 'AssignedStudent' });
db.StudentProfile.hasMany(db.Job, { foreignKey: 'assignedTo', as: 'AssignedJobs' });

// AdminMessage ilişkileri
db.AdminMessage.hasMany(db.MessageRecipient, { foreignKey: 'messageId' });
db.MessageRecipient.belongsTo(db.AdminMessage, { foreignKey: 'messageId' });

// DeveloperRequest ilişkileri
db.EmployerProfile.hasMany(db.DeveloperRequest, { foreignKey: 'employerId' });
db.DeveloperRequest.belongsTo(db.EmployerProfile, { foreignKey: 'employerId' });

module.exports = db;