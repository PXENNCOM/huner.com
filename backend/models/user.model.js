module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userType: {
      type: Sequelize.ENUM('student', 'employer', 'admin'),
      allowNull: false,
      defaultValue: 'student'
    },
    approvalStatus: {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    rejectionReason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    resetPasswordCode: {
      type: Sequelize.STRING(6),
      allowNull: true
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
  return User;
};