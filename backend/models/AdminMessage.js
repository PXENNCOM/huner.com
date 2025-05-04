// models/AdminMessage.js
module.exports = (sequelize, DataTypes) => {
  const AdminMessage = sequelize.define('AdminMessage', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recipientType: {
      type: DataTypes.ENUM('students', 'employers'),
      allowNull: false
    },
    sendType: {
      type: DataTypes.ENUM('all', 'selected'),
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high'),
      defaultValue: 'normal'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  
  return AdminMessage;
};