// models/ProjectIdea.js
module.exports = (sequelize, DataTypes) => {
  const ProjectIdea = sequelize.define('ProjectIdea', {
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
          msg: 'Proje başlığı boş olamaz'
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
          msg: 'Proje açıklaması boş olamaz'
        },
        len: {
          args: [20, 5000],
          msg: 'Açıklama 20-5000 karakter arasında olmalıdır'
        }
      }
    },
    category: {
      type: DataTypes.ENUM(
        'Machine Learning',
        'Deep Learning',
        'Natural Language Processing (NLP)',
        'Computer Vision',
        'Generative AI',
        'Autonomous Agents & Multi-Agent Systems',
        'Data Science & Analytics',
        'Data Engineering',
        'Reinforcement Learning',
        'AI Ethics & Governance'
      ),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Kategori seçimi zorunludur'
        }
      }
    },
    difficulty: {
      type: DataTypes.ENUM('Kolay', 'Orta', 'Zor'),
      allowNull: false,
      defaultValue: 'Orta',
      validate: {
        notEmpty: {
          msg: 'Zorluk seviyesi seçimi zorunludur'
        }
      }
    },
    estimatedDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Tahmini süre en az 1 gün olmalıdır'
        },
        max: {
          args: 365,
          msg: 'Tahmini süre en fazla 365 gün olabilir'
        }
      }
    },
    technologies: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Virgülle ayrılmış teknoloji listesi'
    },
    resources: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Kaynak linkler ve dökümanlar'
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ön gereksinimler ve bilgi düzeyi'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Geçerli bir URL giriniz'
        }
      },
      comment: 'Proje görseli URL\'si'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      comment: 'Proje durumu: active, inactive'
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
    tableName: 'project_ideas',
    timestamps: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['difficulty']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  return ProjectIdea;
};