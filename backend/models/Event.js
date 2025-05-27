// models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Etkinlik başlığı boş olamaz'
        },
        len: {
          args: [3, 200],
          msg: 'Başlık 3-200 karakter arasında olmalıdır'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Etkinlik açıklaması boş olamaz'
        },
        len: {
          args: [10, 2000],
          msg: 'Açıklama 10-2000 karakter arasında olmalıdır'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Etkinlik görseli URL\'si'
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Geçerli bir tarih giriniz'
        },
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: 'Etkinlik tarihi bugünden sonra olmalıdır'
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Etkinlik konumu boş olamaz'
        },
        len: {
          args: [3, 200],
          msg: 'Konum 3-200 karakter arasında olmalıdır'
        }
      }
    },
    organizer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Organizatör bilgisi boş olamaz'
        },
        len: {
          args: [2, 100],
          msg: 'Organizatör adı 2-100 karakter arasında olmalıdır'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
      defaultValue: 'active',
      comment: 'Etkinlik durumu: active, inactive, cancelled'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'events',
    timestamps: true,
    indexes: [
      {
        fields: ['eventDate']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Model ilişkileri burada tanımlanabilir
  Event.associate = function(models) {
    // Gelecekte etkinlik katılımcıları için ilişki eklenebilir
    // Event.belongsToMany(models.StudentProfile, {
    //   through: 'EventParticipants',
    //   foreignKey: 'eventId',
    //   otherKey: 'studentId'
    // });
  };

  return Event;
};