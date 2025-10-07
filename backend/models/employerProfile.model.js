// models/employerProfile.model.js
module.exports = (sequelize, DataTypes) => {
  const EmployerProfile = sequelize.define('EmployerProfile', {
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
    companyName: {
      type: DataTypes.STRING(100)
    },
    position: {
      type: DataTypes.STRING(100)
    },
    industry: {
      type: DataTypes.STRING(50)
    },
    companyWebsite: {
      type: DataTypes.STRING(255)
    },
    phoneNumber: {
      type: DataTypes.STRING(20)
    },
    city: {
      type: DataTypes.STRING(50)
    },
    address: {
      type: DataTypes.TEXT
    },
    age: {
      type: DataTypes.INTEGER
    },
    profileImage: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'employer_profiles',
    timestamps: true
  });
  
  return EmployerProfile;
};