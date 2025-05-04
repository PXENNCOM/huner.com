// models/studentProject.model.js
module.exports = (sequelize, DataTypes) => {
  const StudentProject = sequelize.define('StudentProject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200)
    },
    description: {
      type: DataTypes.TEXT
    },
    technologies: {
      type: DataTypes.TEXT
    },
    media: {
      type: DataTypes.TEXT
    },
    // Yeni alanlar ekliyoruz
    githubUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    liveUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    projectType: {
      type: DataTypes.ENUM('huner', 'personal', 'school', 'other'),
      defaultValue: 'personal'
    }
  }, {
    tableName: 'student_projects',
    timestamps: true
  });
  
  return StudentProject;
};