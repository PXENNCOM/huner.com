// migrations/add-email-verification-fields.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Email doğrulama alanlarını ekle
    await queryInterface.addColumn('Users', 'isEmailVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Users', 'emailVerificationCode', {
      type: Sequelize.STRING(6),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'emailVerificationExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'tempProfileData', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Geçici profil verileri - email doğrulanana kadar saklanır'
    });

    // Mevcut kullanıcıları email doğrulanmış olarak işaretle
    await queryInterface.sequelize.query(
      'UPDATE Users SET isEmailVerified = true WHERE createdAt < NOW()'
    );
  },

  async down(queryInterface, Sequelize) {
    // Alanları kaldır
    await queryInterface.removeColumn('Users', 'isEmailVerified');
    await queryInterface.removeColumn('Users', 'emailVerificationCode');
    await queryInterface.removeColumn('Users', 'emailVerificationExpires');
    await queryInterface.removeColumn('Users', 'tempProfileData');
  }
};