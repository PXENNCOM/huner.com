// migrations/add-password-reset-fields.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'resetPasswordToken', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'resetPasswordCode', {
      type: Sequelize.STRING(6),
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'resetPasswordExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'resetPasswordToken');
    await queryInterface.removeColumn('Users', 'resetPasswordCode');
    await queryInterface.removeColumn('Users', 'resetPasswordExpires');
  }
};