// models/StudentWorkExperience.js
module.exports = (sequelize, DataTypes) => {
  const StudentWorkExperience = sequelize.define('StudentWorkExperience', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'student_profiles',
        key: 'id'
      }
    },
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true // null = hala çalışıyor
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    workType: {
      type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'freelance'),
      defaultValue: 'internship'
    }
  }, {
    tableName: 'student_work_experiences',
    timestamps: true
  });

  StudentWorkExperience.associate = function(models) {
    StudentWorkExperience.belongsTo(models.StudentProfile, {
      foreignKey: 'studentId',
      as: 'StudentProfile'
    });
  };

  return StudentWorkExperience;
};