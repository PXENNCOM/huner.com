// models/developerRequest.model.js
module.exports = (sequelize, DataTypes) => {
  const DeveloperRequest = sequelize.define('DeveloperRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'İşveren profili ID\'si'
    },
    // Proje Bilgileri
    projectTitle: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Proje başlığı'
    },
    projectDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Proje açıklaması'
    },
    projectType: {
      type: DataTypes.ENUM('website', 'mobile_app', 'api', 'ecommerce', 'crm', 'desktop_app', 'other'),
      allowNull: false,
      comment: 'Proje tipi'
    },
    // Teknik Gereksinimler
    technologies: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Gerekli teknolojiler (array)'
    },
    experienceLevel: {
      type: DataTypes.ENUM('intern', 'junior', 'mid', 'senior'),
      allowNull: false,
      comment: 'Deneyim seviyesi'
    },
    // Çalışma Türü ve Süresi
    workType: {
      type: DataTypes.ENUM('freelance', 'part_time', 'full_time', 'intern'),
      allowNull: false,
      comment: 'Çalışma türü'
    },
    duration: {
      type: DataTypes.ENUM('1_month', '2_months', '3_months', '4_months', '5_months', '6_months', '6_plus_months', 'indefinite'),
      allowNull: false,
      comment: 'Proje süresi'
    },
    startDate: {
      type: DataTypes.ENUM('immediately', 'within_1_week', 'within_1_month'),
      allowNull: false,
      comment: 'Başlangıç tarihi'
    },
    // Çalışma Koşulları
    workStyle: {
      type: DataTypes.ENUM('remote', 'hybrid', 'office'),
      allowNull: false,
      comment: 'Çalışma şekli'
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Çalışma konumu (şehir)'
    },
    workHours: {
      type: DataTypes.ENUM('business_hours', 'flexible', 'night_shift'),
      allowNull: false,
      comment: 'Çalışma saatleri'
    },
    teamSize: {
      type: DataTypes.ENUM('solo', '2_3_people', 'team'),
      allowNull: false,
      comment: 'Takım büyüklüğü'
    },
    // Tercihler
    communicationLanguages: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'İletişim dilleri (array)'
    },
    industryExperience: {
      type: DataTypes.ENUM('ecommerce', 'fintech', 'healthcare', 'education', 'gaming', 'social_media', 'no_preference'),
      allowNull: true,
      comment: 'Sektör deneyimi tercihi'
    },
    priority: {
      type: DataTypes.ENUM('normal', 'high', 'urgent'),
      defaultValue: 'normal',
      comment: 'Öncelik seviyesi'
    },
    // Admin için bütçe aralığı
    budgetRange: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Bütçe aralığı (sadece admin görebilir)'
    },
    // Status ve Admin notları
    status: {
      type: DataTypes.ENUM('pending', 'reviewing', 'approved', 'assigned', 'completed', 'cancelled'),
      defaultValue: 'pending',
      comment: 'Talep durumu'
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin notları'
    },
    assignedDeveloperId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Atanan yazılımcı ID\'si'
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Atanma tarihi'
    }
  }, {
    tableName: 'developer_requests',
    timestamps: true,
    indexes: [
      {
        fields: ['employerId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['createdAt']
      }
    ]
  });
  
  return DeveloperRequest;
};