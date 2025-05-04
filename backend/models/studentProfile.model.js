// models/studentProfile.model.js
module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define('StudentProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(100)
    },
    age: {
      type: DataTypes.INTEGER
    },
    city: {
      type: DataTypes.STRING(50)
    },
    school: {
      type: DataTypes.STRING(100)
    },
    // Yeni eklenen alanlar
    educationLevel: {
      type: DataTypes.ENUM('lisans', 'yuksek_lisans', 'doktora', 'mezun'),
      allowNull: true
    },
    currentGrade: {
      type: DataTypes.STRING(20), // Örneğin "1. Sınıf", "2. Sınıf" vb.
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100), // Bölüm adı
      allowNull: true
    },
    languages: {
      type: DataTypes.TEXT, // JSON formatında saklanabilir, örn: [{"lang":"İngilizce", "level":"İleri"}, {"lang":"Almanca", "level":"Başlangıç"}]
      allowNull: true
    },
    linkedinProfile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    githubProfile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // Mevcut alanlar
    studentDocument: {
      type: DataTypes.STRING(255)
    },
    skills: {
      type: DataTypes.TEXT
    },
    profileImage: {
      type: DataTypes.STRING(255)
    },
    shortBio: {
      type: DataTypes.STRING(280),
      allowNull: true
    }
  }, {
    tableName: 'student_profiles',
    timestamps: true
  });
  
  return StudentProfile;
};