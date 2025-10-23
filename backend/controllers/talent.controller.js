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
      keywords = [],            // 🆕 ['AI', 'startup', 'açık kaynak'] - Serbest arama
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

    console.log('🔍 Advanced Talent Search Started:', {
      skills,
      keywords,
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
        as: 'Projects',
        required: false,
        attributes: [
          'id', 
          'title', 
          'description', 
          'technologies', 
          'projectType', 
          'githubUrl', 
          'liveUrl', 
          'createdAt'
        ]
      },
      {
        model: db.StudentWorkExperience,
        as: 'WorkExperiences',
        required: false,
        attributes: [
          'companyName', 
          'position', 
          'startDate', 
          'endDate', 
          'isCurrent', 
          'workType', 
          'description'
        ]
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
          appliedFilters: { 
            skills, 
            keywords,
            city, 
            position, 
            seniority 
          }
        }
      });
    }

    // 5. SKORLAMA (Gelişmiş)
    console.log('🎯 Calculating comprehensive scores...');
    const scoredStudents = allStudents.map(student => {
      const studentData = student.toJSON();
      
      const { totalScore, scoreBreakdown } = calculateStudentScore(
        studentData,
        { 
          skills, 
          workType,
          keywords,
          position
        },
        weights
      );
      
      studentData.relevanceScore = totalScore;
      studentData.scoreBreakdown = scoreBreakdown;
      
      // Match Label (Detaylı)
      if (totalScore >= 85) {
        studentData.matchLabel = '⭐ Mükemmel Eşleşme';
        studentData.matchColor = 'green';
        studentData.matchPriority = 1;
      } else if (totalScore >= 70) {
        studentData.matchLabel = '✅ Çok İyi Eşleşme';
        studentData.matchColor = 'blue';
        studentData.matchPriority = 2;
      } else if (totalScore >= 55) {
        studentData.matchLabel = '👍 İyi Eşleşme';
        studentData.matchColor = 'cyan';
        studentData.matchPriority = 3;
      } else if (totalScore >= 40) {
        studentData.matchLabel = '⚠️ Orta Eşleşme';
        studentData.matchColor = 'yellow';
        studentData.matchPriority = 4;
      } else {
        studentData.matchLabel = '❌ Zayıf Eşleşme';
        studentData.matchColor = 'gray';
        studentData.matchPriority = 5;
      }

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
        if (!student.Projects || student.Projects.length < minProjectCount) {
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
        filteredStudents.sort((a, b) => {
          // Önce relevance score'a göre
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
          // Eşitse match priority'ye göre
          return a.matchPriority - b.matchPriority;
        });
        break;
      
      case 'experience':
        filteredStudents.sort((a, b) => 
          (b.totalExperienceMonths || 0) - (a.totalExperienceMonths || 0)
        );
        break;
      
      case 'projects':
        filteredStudents.sort((a, b) => {
          const aProjects = a.Projects ? a.Projects.length : 0;
          const bProjects = b.Projects ? b.Projects.length : 0;
          return bProjects - aProjects;
        });
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
        excellent: filteredStudents.filter(s => s.relevanceScore >= 85).length,
        veryGood: filteredStudents.filter(s => s.relevanceScore >= 70 && s.relevanceScore < 85).length,
        good: filteredStudents.filter(s => s.relevanceScore >= 55 && s.relevanceScore < 70).length,
        average: filteredStudents.filter(s => s.relevanceScore >= 40 && s.relevanceScore < 55).length,
        poor: filteredStudents.filter(s => s.relevanceScore < 40).length
      },
      averageExperience: totalResults > 0
        ? Math.round(filteredStudents.reduce((sum, s) => sum + (s.totalExperienceMonths || 0), 0) / totalResults)
        : 0,
      averageProjects: totalResults > 0
        ? Math.round(filteredStudents.reduce((sum, s) => sum + (s.Projects?.length || 0), 0) / totalResults)
        : 0,
      topSkills: calculateTopSkills(filteredStudents),
      matchQuality: {
        highQuality: filteredStudents.filter(s => s.relevanceScore >= 70).length,
        mediumQuality: filteredStudents.filter(s => s.relevanceScore >= 40 && s.relevanceScore < 70).length,
        lowQuality: filteredStudents.filter(s => s.relevanceScore < 40).length
      }
    };

    // 9. SAYFALAMA
    const paginatedStudents = filteredStudents.slice(offset, offset + limit);

    console.log('✅ Search completed successfully');
    console.log(`📊 Stats: ${stats.total} total, avg score: ${stats.averageScore}`);

    // 10. RESPONSE (Gelişmiş)
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
          matchColor: student.matchColor,
          matchPriority: student.matchPriority,
          scoreBreakdown: student.scoreBreakdown,
          
          // 🆕 Eşleşme Detayları
          matchHighlights: student.scoreBreakdown.matchDetails ? {
            bioMatches: student.scoreBreakdown.matchDetails.bioMatches?.slice(0, 3) || [],
            skillMatches: student.scoreBreakdown.matchDetails.skillMatches?.slice(0, 5) || [],
            departmentMatches: student.scoreBreakdown.matchDetails.departmentMatches?.slice(0, 2) || [],
            topProjects: student.scoreBreakdown.matchDetails.projectMatches?.slice(0, 2) || [],
            topExperiences: student.scoreBreakdown.matchDetails.workExperienceMatches?.slice(0, 2) || []
          } : null,
          
          // Eşleşme Skorları
          matchScores: student.scoreBreakdown.matchScores || null,
          
          // Pozisyon Uygunluğu
          positionRelevance: student.scoreBreakdown.positionRelevance || null,
          
          // İstatistikler
          projectCount: student.Projects ? student.Projects.length : 0,
          totalExperienceMonths: student.totalExperienceMonths || 0,
          profileCompleteness: student.profileCompleteness || 0,
          
          // Profil Linkleri
          githubProfile: student.githubProfile,
          linkedinProfile: student.linkedinProfile,
          
          // İletişim (opsiyonel - sadece işveren için)
          email: student.User?.email,
          
          // Ek Bilgiler
          hasGithub: !!student.githubProfile,
          hasLinkedin: !!student.linkedinProfile,
          experienceYears: student.totalExperienceMonths 
            ? Math.round((student.totalExperienceMonths / 12) * 10) / 10 
            : 0
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
          keywords,
          city,
          educationLevel,
          department,
          languages,
          position,
          seniority,
          workType,
          minExperienceMonths,
          hasGithub,
          hasLinkedin,
          minProjectCount,
          minAge,
          maxAge,
          minScore,
          sortBy
        },
        
        algorithmInfo: {
          version: '2.0',
          weightsUsed: weights,
          fuzzyMatchingEnabled: true,
          comprehensiveSearchEnabled: true,
          searchDepth: 'deep',
          positionOptimized: !!position,
          seniorityOptimized: !!seniority,
          keywordSearchEnabled: keywords.length > 0,
          areasSearched: [
            'skills',
            'shortBio',
            'department',
            'languages',
            'projects (title, description, technologies)',
            'workExperiences (position, company, description)'
          ]
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
        
        // Süreyi formatla
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years > 0 && remainingMonths > 0) {
          exp.durationText = `${years} yıl ${remainingMonths} ay`;
        } else if (years > 0) {
          exp.durationText = `${years} yıl`;
        } else {
          exp.durationText = `${months} ay`;
        }
      });
      studentData.totalExperienceMonths = totalMonths;
      studentData.totalExperienceYears = Math.round((totalMonths / 12) * 10) / 10;
    }

    // Proje teknolojilerini parse et
    if (studentData.Projects && studentData.Projects.length > 0) {
      studentData.Projects.forEach(project => {
        if (project.technologies) {
          project.technologiesArray = project.technologies.split(',').map(t => t.trim());
        } else {
          project.technologiesArray = [];
        }
      });
    }

    // Skills'i parse et
    if (studentData.skills) {
      studentData.skillsArray = studentData.skills.split(',').map(s => s.trim());
    }

    // Languages'i parse et
    if (studentData.languages) {
      studentData.languagesArray = studentData.languages.split(',').map(l => l.trim());
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
        positions: [
          'frontend', 
          'backend', 
          'fullstack', 
          'mobile', 
          'devops', 
          'data-science', 
          'ui-ux'
        ],
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