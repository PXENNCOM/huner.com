// backend/controllers/talent.controller.js
const db = require('../models');
const { 
  getPositionWeights, 
  fuzzySkillMatch, 
  calculateStudentScore 
} = require('../utils/talentScoring');

// ANA TALENT ARAMA FONKSİYONU
exports.searchTalents = async (req, res) => {
  try {
    const {
      // Temel Filtreler
      skills = [],              // ['JavaScript', 'React', 'Node.js']
      city,                     // 'Istanbul'
      educationLevel,           // 'university', 'high_school'
      department,               // 'Bilgisayar Mühendisliği'
      languages = [],           // ['Türkçe', 'İngilizce']
      
      // Pozisyon Bilgileri
      position,                 // 'frontend', 'backend', 'fullstack', 'mobile'
      seniority = 'junior',     // 'intern', 'junior', 'mid', 'senior'
      workType,                 // 'internship', 'part-time', 'full-time'
      
      // Filtreler
      minExperienceMonths,      // Minimum deneyim (ay)
      hasGithub,                // true/false
      hasLinkedin,              // true/false
      minProjectCount,          // Minimum proje sayısı
      minAge,                   // Minimum yaş
      maxAge,                   // Maximum yaş
      
      // Skorlama
      minScore = 0,             // Minimum uygunluk skoru (0-100)
      sortBy = 'relevance',     // 'relevance', 'experience', 'projects', 'education'
      
      // Sayfalama
      page = 1,
      limit = 20
    } = req.body;

    const offset = (page - 1) * limit;
    const { Op } = db.Sequelize;

    console.log('🔍 Talent Search Started:', {
      skills,
      city,
      position,
      seniority,
      page
    });

    // 1. POZISYON AĞIRLIKLARINI HESAPLA
    const weights = getPositionWeights(position, seniority);
    console.log('⚖️  Calculated Weights:', weights);

    // 2. BASE WHERE CONDITIONS (Hard Filters)
    const whereConditions = {};
    
    if (city) {
      whereConditions.city = city;
    }
    
    if (educationLevel) {
      whereConditions.educationLevel = educationLevel;
    }

    if (department) {
      whereConditions.department = {
        [Op.like]: `%${department}%`
      };
    }

    if (minAge || maxAge) {
      whereConditions.age = {};
      if (minAge) whereConditions.age[Op.gte] = minAge;
      if (maxAge) whereConditions.age[Op.lte] = maxAge;
    }

    // 3. INCLUDE CONDITIONS
   const includeConditions = [
  {
    model: db.User,
    attributes: ['email', 'approvalStatus', 'isActive', 'createdAt'],
    where: {
      approvalStatus: 'approved',
      isActive: true
    },
    required: true
  },
  {
    model: db.StudentProject,
    as: 'Projects',  // ← Artık bu çalışacak
    required: false,
    attributes: ['id', 'title', 'description', 'technologies', 'projectType', 'githubUrl', 'liveUrl', 'createdAt']
  },
  {
    model: db.StudentWorkExperience,
    as: 'WorkExperiences',  // ← Bu da çalışacak
    required: false,
    attributes: ['companyName', 'position', 'startDate', 'endDate', 'isCurrent', 'workType', 'description']
  }
];

    // 4. TÜM ÖĞRENCİLERİ ÇEK
    console.log('📊 Fetching students from database...');
    const allStudents = await db.StudentProfile.findAll({
      where: whereConditions,
      include: includeConditions,
      attributes: {
        exclude: ['studentDocument'] // Performans için büyük dosyaları hariç tut
      }
    });

    console.log(`✅ Found ${allStudents.length} students matching hard filters`);

    if (allStudents.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          talents: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          },
          stats: {
            total: 0,
            averageScore: 0,
            scoreDistribution: {
              excellent: 0,
              good: 0,
              average: 0,
              poor: 0
            }
          },
          appliedFilters: { skills, city, position, seniority }
        }
      });
    }

    // 5. SKORLAMA
    console.log('🎯 Calculating scores...');
    const scoredStudents = allStudents.map(student => {
      const studentData = student.toJSON();
      
      const { totalScore, scoreBreakdown } = calculateStudentScore(
        studentData,
        { skills, workType },
        weights
      );
      
      studentData.relevanceScore = totalScore;
      studentData.scoreBreakdown = scoreBreakdown;
      
      // Match Label
      if (totalScore >= 80) studentData.matchLabel = 'Mükemmel Eşleşme';
      else if (totalScore >= 60) studentData.matchLabel = 'İyi Eşleşme';
      else if (totalScore >= 40) studentData.matchLabel = 'Orta Eşleşme';
      else studentData.matchLabel = 'Zayıf Eşleşme';

      return studentData;
    });

    // 6. SOFT FİLTRELER (Skor sonrası)
    console.log('🔎 Applying soft filters...');
    let filteredStudents = scoredStudents.filter(student => {
      // Minimum skor
      if (student.relevanceScore < minScore) return false;
      
      // Dil kontrolü
      if (languages.length > 0 && student.languages) {
        const studentLangs = student.languages.toLowerCase();
        const hasLanguage = languages.some(lang => 
          studentLangs.includes(lang.toLowerCase())
        );
        if (!hasLanguage) return false;
      }
      
      // Minimum deneyim
      if (minExperienceMonths) {
        if (!student.totalExperienceMonths || student.totalExperienceMonths < minExperienceMonths) {
          return false;
        }
      }
      
      // GitHub kontrolü
      if (hasGithub === true && !student.githubProfile) return false;
      
      // LinkedIn kontrolü
      if (hasLinkedin === true && !student.linkedinProfile) return false;
      
      // Minimum proje sayısı
      if (minProjectCount) {
  if (!student.Projects || student.Projects.length < minProjectCount) {  // ← Projects
    return false;
  }
}
      
      return true;
    });

    console.log(`✅ ${filteredStudents.length} students after soft filters`);

    // 7. SIRALAMA
    console.log(`📑 Sorting by: ${sortBy}`);
    switch (sortBy) {
      case 'relevance':
        filteredStudents.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      
      case 'experience':
        filteredStudents.sort((a, b) => 
          (b.totalExperienceMonths || 0) - (a.totalExperienceMonths || 0)
        );
        break;
      
      case 'projects':
        filteredStudents.sort((a, b) => 
          (b.projectCount || 0) - (a.projectCount || 0)
        );
        break;
      
      case 'education':
        const eduOrder = { 
          'doctorate': 4, 
          'masters': 3, 
          'university': 2, 
          'high_school': 1 
        };
        filteredStudents.sort((a, b) => 
          (eduOrder[b.educationLevel] || 0) - (eduOrder[a.educationLevel] || 0)
        );
        break;
      
      case 'newest':
        filteredStudents.sort((a, b) => 
          new Date(b.User.createdAt) - new Date(a.User.createdAt)
        );
        break;
      
      default:
        filteredStudents.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // 8. İSTATİSTİKLER
    const totalResults = filteredStudents.length;
    const stats = {
      total: totalResults,
      averageScore: totalResults > 0 
        ? Math.round(filteredStudents.reduce((sum, s) => sum + s.relevanceScore, 0) / totalResults)
        : 0,
      scoreDistribution: {
        excellent: filteredStudents.filter(s => s.relevanceScore >= 80).length,
        good: filteredStudents.filter(s => s.relevanceScore >= 60 && s.relevanceScore < 80).length,
        average: filteredStudents.filter(s => s.relevanceScore >= 40 && s.relevanceScore < 60).length,
        poor: filteredStudents.filter(s => s.relevanceScore < 40).length
      },
      averageExperience: totalResults > 0
        ? Math.round(filteredStudents.reduce((sum, s) => sum + (s.totalExperienceMonths || 0), 0) / totalResults)
        : 0,
      topSkills: calculateTopSkills(filteredStudents)
    };

    // 9. SAYFALAMA
    const paginatedStudents = filteredStudents.slice(offset, offset + limit);

    console.log('✅ Search completed successfully');

    // 10. RESPONSE
    res.status(200).json({
      success: true,
      data: {
        talents: paginatedStudents.map(student => ({
          // Temel Bilgiler
          id: student.id,
          fullName: student.fullName,
          profileImage: student.profileImage,
          shortBio: student.shortBio,
          
          // Lokasyon ve Eğitim
          city: student.city,
          age: student.age,
          school: student.school,
          educationLevel: student.educationLevel,
          department: student.department,
          currentGrade: student.currentGrade,
          
          // Yetenekler ve Diller
          skills: student.skills,
          languages: student.languages,
          
          // Matching Bilgileri
          relevanceScore: student.relevanceScore,
          matchLabel: student.matchLabel,
          scoreBreakdown: student.scoreBreakdown,
          
          // Fuzzy Match Sonuçları
          fuzzyMatchResult: student.fuzzyMatchResult,
          
          // İstatistikler
          projectCount: student.projectCount || 0,
          totalExperienceMonths: student.totalExperienceMonths || 0,
          profileCompleteness: student.profileCompleteness,
          
          // Profil Linkleri
          githubProfile: student.githubProfile,
          linkedinProfile: student.linkedinProfile,
          
          // İletişim (opsiyonel - sadece işveren için)
          email: student.User?.email
        })),
        
        pagination: {
          page,
          limit,
          total: totalResults,
          totalPages: Math.ceil(totalResults / limit),
          hasNext: page < Math.ceil(totalResults / limit),
          hasPrev: page > 1
        },
        
        stats,
        
        appliedFilters: {
          skills,
          city,
          educationLevel,
          department,
          languages,
          position,
          seniority,
          workType,
          minScore,
          sortBy
        },
        
        algorithmInfo: {
          weightsUsed: weights,
          fuzzyMatchingEnabled: true,
          positionOptimized: !!position,
          seniorityOptimized: !!seniority
        }
      }
    });

  } catch (error) {
    console.error('❌ Talent search error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// YARDIMCI FONKSİYON: Top Skills Hesaplama
function calculateTopSkills(students) {
  const skillCount = {};
  
  students.forEach(student => {
    if (student.skills) {
      const skills = student.skills.split(',').map(s => s.trim());
      skills.forEach(skill => {
        if (skill) {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        }
      });
    }
  });
  
  return Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ 
      skill, 
      count,
      percentage: Math.round((count / students.length) * 100)
    }));
}

// TEK ÖĞRENCİ DETAYI
exports.getTalentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await db.StudentProfile.findOne({
      where: { id: studentId },
      include: [
        {
          model: db.User,
          attributes: ['email', 'approvalStatus', 'isActive', 'createdAt'],
          where: {
            approvalStatus: 'approved',
            isActive: true
          }
        },
        {
          model: db.StudentProject,
          as: 'Projects',
          order: [['createdAt', 'DESC']]
        },
        {
          model: db.StudentWorkExperience,
          as: 'WorkExperiences',
          order: [['startDate', 'DESC']]
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Öğrenci bulunamadı veya aktif değil'
      });
    }

    const studentData = student.toJSON();

    // Deneyim süresini hesapla
    if (studentData.WorkExperiences && studentData.WorkExperiences.length > 0) {
      let totalMonths = 0;
      studentData.WorkExperiences.forEach(exp => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
        const months = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        totalMonths += months;
        exp.durationMonths = months;
      });
      studentData.totalExperienceMonths = totalMonths;
    }

    res.status(200).json({
      success: true,
      data: studentData
    });

  } catch (error) {
    console.error('Talent details error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};

// ÖNERİLEN FİLTRELER - Filtre önerileri için
exports.getFilterOptions = async (req, res) => {
  try {
    // Tüm aktif öğrencileri çek
    const students = await db.StudentProfile.findAll({
      include: [{
        model: db.User,
        where: { approvalStatus: 'approved', isActive: true },
        attributes: []
      }],
      attributes: ['city', 'educationLevel', 'department', 'skills', 'languages']
    });

    // Unique değerleri topla
    const cities = [...new Set(students.map(s => s.city).filter(Boolean))];
    const educationLevels = [...new Set(students.map(s => s.educationLevel).filter(Boolean))];
    const departments = [...new Set(students.map(s => s.department).filter(Boolean))];
    
    // Skills'i ayır ve topla
    const allSkills = new Set();
    students.forEach(s => {
      if (s.skills) {
        s.skills.split(',').forEach(skill => {
          const trimmed = skill.trim();
          if (trimmed) allSkills.add(trimmed);
        });
      }
    });

    // Languages'i ayır ve topla
    const allLanguages = new Set();
    students.forEach(s => {
      if (s.languages) {
        s.languages.split(',').forEach(lang => {
          const trimmed = lang.trim();
          if (trimmed) allLanguages.add(trimmed);
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        cities: cities.sort(),
        educationLevels: educationLevels.sort(),
        departments: departments.sort(),
        skills: Array.from(allSkills).sort(),
        languages: Array.from(allLanguages).sort(),
        positions: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'data-science', 'ui-ux'],
        seniorities: ['intern', 'junior', 'mid', 'senior'],
        workTypes: ['internship', 'part-time', 'full-time', 'freelance']
      }
    });

  } catch (error) {
    console.error('Filter options error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};
