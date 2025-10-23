// backend/utils/talentScoring.js (Güncelle)

const { comprehensiveStudentSearch } = require('./advancedTalentScoring');

const calculateStudentScore = (student, searchCriteria, weights) => {
  const { skills = [], workType, keywords = [] } = searchCriteria;

  // Kapsamlı arama yap
  const searchResults = comprehensiveStudentSearch(student, searchCriteria);

  // ============================================
  // 1. BECERİ SKORU (Skill Match) - %30
  // ============================================
  let skillScore = 0;
  
  if (skills.length > 0) {
    // Hem doğrudan skills hem de diğer alanlardaki eşleşmeleri değerlendir
    const directSkillMatch = searchResults.skills.score;
    const bioSkillMatch = searchResults.bio.score * 0.3;
    const projectSkillMatch = searchResults.projects.score * 0.4;
    const workSkillMatch = searchResults.workExperiences.score * 0.3;

    skillScore = (
      directSkillMatch * 0.5 +
      bioSkillMatch * 0.1 +
      projectSkillMatch * 0.25 +
      workSkillMatch * 0.15
    );

    // Pozisyon uygunluğu bonusu
    if (searchResults.positionRelevance) {
      const posRelevance = (
        searchResults.positionRelevance.skills * 0.4 +
        searchResults.positionRelevance.projects * 0.3 +
        searchResults.positionRelevance.workExp * 0.2 +
        searchResults.positionRelevance.bio * 0.1
      );
      
      skillScore = skillScore * 0.7 + posRelevance * 0.3;
    }
  } else {
    skillScore = 50; // Skill belirtilmemişse varsayılan
  }

  // ============================================
  // 2. DENEYİM SKORU (Experience) - %25
  // ============================================
  let experienceScore = 0;
  const totalMonths = student.totalExperienceMonths || 0;

  // Temel deneyim skoru
  if (totalMonths === 0) {
    experienceScore = 30;
  } else if (totalMonths < 6) {
    experienceScore = 50;
  } else if (totalMonths < 12) {
    experienceScore = 70;
  } else if (totalMonths < 24) {
    experienceScore = 85;
  } else {
    experienceScore = 100;
  }

  // İş deneyimi içeriği bonusu
  if (searchResults.workExperiences.score > 0) {
    const contentBonus = searchResults.workExperiences.score * 0.2;
    experienceScore = Math.min(100, experienceScore + contentBonus);
  }

  // Çalışma türü uyumu
  if (workType && student.WorkExperiences) {
    const hasMatchingType = student.WorkExperiences.some(
      exp => exp.workType === workType
    );
    if (hasMatchingType) {
      experienceScore = Math.min(100, experienceScore * 1.1);
    }
  }

  // ============================================
  // 3. PROJE KALİTESİ SKORU - %25
  // ============================================
  let projectScore = 0;
  const projectCount = student.projectCount || 0;

  // Temel proje sayısı skoru
  if (projectCount === 0) {
    projectScore = 20;
  } else if (projectCount === 1) {
    projectScore = 50;
  } else if (projectCount === 2) {
    projectScore = 70;
  } else if (projectCount >= 3) {
    projectScore = 85;
  }

  // Proje içeriği ve eşleşme bonusu
  if (searchResults.projects.score > 0) {
    const contentBonus = searchResults.projects.score * 0.3;
    projectScore = Math.min(100, projectScore + contentBonus);
  }

  // GitHub bonusu
  if (student.githubProfile) {
    projectScore = Math.min(100, projectScore * 1.1);
  }

  // Proje çeşitliliği bonusu
  if (student.Projects && student.Projects.length > 0) {
    const projectTypes = new Set(student.Projects.map(p => p.projectType));
    const diversityBonus = (projectTypes.size - 1) * 5;
    projectScore = Math.min(100, projectScore + diversityBonus);
  }

  // ============================================
  // 4. PROFİL KALİTESİ SKORU - %20
  // ============================================
  let profileScore = student.profileCompleteness || 0;

  // Biyografi içerik kalitesi
  if (student.shortBio) {
    const bioLength = student.shortBio.length;
    if (bioLength > 100) {
      profileScore += 10;
    }
    if (searchResults.bio.score > 0) {
      profileScore += searchResults.bio.score * 0.15;
    }
  }

  // Sosyal profil bonusları
  if (student.githubProfile) profileScore += 5;
  if (student.linkedinProfile) profileScore += 5;

  // Bölüm uyumu
  if (searchResults.department.score > 0) {
    profileScore += searchResults.department.score * 0.1;
  }

  profileScore = Math.min(100, profileScore);

  // ============================================
  // 5. EĞİTİM SKORU - Bonus olarak ekle
  // ============================================
  let educationBonus = 0;
  const eduLevels = {
    'high_school': 0,
    'university': 5,
    'masters': 10,
    'doctorate': 15
  };
  educationBonus = eduLevels[student.educationLevel] || 0;

  // Bölüm-pozisyon uyumu ekstra bonus
  if (searchResults.department.score > 50) {
    educationBonus += 5;
  }

  // ============================================
  // TOPLAM SKOR HESAPLAMA
  // ============================================
  const baseScore = (
    skillScore * (weights.skills / 100) +
    experienceScore * (weights.experience / 100) +
    projectScore * (weights.projects / 100) +
    profileScore * (weights.profile / 100)
  );

  // Education bonusunu ekle (max %10 etki)
  const totalScore = Math.min(100, baseScore + (educationBonus * 0.1));

  // ============================================
  // DETAYLI BREAKDOWN
  // ============================================
  const scoreBreakdown = {
    // Ana skorlar
    skillMatch: Math.round(skillScore),
    experience: Math.round(experienceScore),
    projectQuality: Math.round(projectScore),
    profileQuality: Math.round(profileScore),
    educationBonus: Math.round(educationBonus),

    // Detaylı eşleşmeler
    matchDetails: {
      bioMatches: searchResults.bio.matches,
      skillMatches: searchResults.skills.matches,
      departmentMatches: searchResults.department.matches,
      projectMatches: searchResults.projects.details,
      workExperienceMatches: searchResults.workExperiences.details,
    },

    // Eşleşme skorları
    matchScores: {
      bio: Math.round(searchResults.bio.score),
      skills: Math.round(searchResults.skills.score),
      department: Math.round(searchResults.department.score),
      projects: Math.round(searchResults.projects.score),
      workExperiences: Math.round(searchResults.workExperiences.score)
    },

    // Pozisyon uygunluğu
    positionRelevance: searchResults.positionRelevance ? {
      overall: Math.round(
        (searchResults.positionRelevance.bio.score * 0.2 +
         searchResults.positionRelevance.skills.score * 0.3 +
         searchResults.positionRelevance.projects * 0.3 +
         searchResults.positionRelevance.workExp * 0.2)
      ),
      bio: Math.round(searchResults.positionRelevance.bio.score),
      skills: Math.round(searchResults.positionRelevance.skills.score),
      projects: Math.round(searchResults.positionRelevance.projects),
      workExp: Math.round(searchResults.positionRelevance.workExp)
    } : null
  };

  return {
    totalScore: Math.round(totalScore),
    scoreBreakdown
  };
};


/**
 * Pozisyon ve kıdem seviyesine göre ağırlıkları hesapla
 */
const getPositionWeights = (position, seniority) => {
  // Varsayılan ağırlıklar
  let weights = {
    skills: 30,
    experience: 25,
    projects: 25,
    profile: 20
  };

  // Pozisyona göre özelleştirme
  switch (position) {
    case 'frontend':
      weights = {
        skills: 35,
        experience: 20,
        projects: 30,
        profile: 15
      };
      break;
      
    case 'backend':
      weights = {
        skills: 35,
        experience: 30,
        projects: 20,
        profile: 15
      };
      break;
      
    case 'fullstack':
      weights = {
        skills: 35,
        experience: 25,
        projects: 25,
        profile: 15
      };
      break;
      
    case 'mobile':
      weights = {
        skills: 35,
        experience: 25,
        projects: 25,
        profile: 15
      };
      break;
      
    case 'devops':
      weights = {
        skills: 30,
        experience: 40,
        projects: 15,
        profile: 15
      };
      break;
      
    case 'data-science':
      weights = {
        skills: 40,
        experience: 25,
        projects: 25,
        profile: 10
      };
      break;
      
    case 'ui-ux':
      weights = {
        skills: 25,
        experience: 20,
        projects: 40,
        profile: 15
      };
      break;
  }

  // Kıdem seviyesine göre ayarlama
  switch (seniority) {
    case 'intern':
      // Stajyerler için proje ve profil daha önemli
      weights.experience = Math.max(0, weights.experience - 10);
      weights.projects += 5;
      weights.profile += 5;
      break;
      
    case 'junior':
      // Junior'lar için deneyim biraz daha az önemli
      weights.experience = Math.max(5, weights.experience - 5);
      weights.projects += 3;
      weights.skills += 2;
      break;
      
    case 'mid':
      // Mid-level için balanced
      // Varsayılan ağırlıklar zaten uygun
      break;
      
    case 'senior':
      // Senior'lar için deneyim çok önemli
      weights.experience += 15;
      weights.projects -= 5;
      weights.profile -= 5;
      weights.skills -= 5;
      break;
  }

  // Toplam 100 olduğundan emin ol
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (total !== 100) {
    const factor = 100 / total;
    Object.keys(weights).forEach(key => {
      weights[key] = Math.round(weights[key] * factor);
    });
  }

  return weights;
};

/**
 * Fuzzy skill matching - iki beceri arasındaki benzerliği hesapla
 */
const fuzzySkillMatch = (skill1, skill2) => {
  if (!skill1 || !skill2) return 0;

  const s1 = skill1.toLowerCase().trim();
  const s2 = skill2.toLowerCase().trim();

  // Tam eşleşme
  if (s1 === s2) return 100;

  // Birisi diğerini içeriyor mu?
  if (s1.includes(s2) || s2.includes(s1)) {
    const longer = Math.max(s1.length, s2.length);
    const shorter = Math.min(s1.length, s2.length);
    return Math.round((shorter / longer) * 90);
  }

  // Levenshtein distance ile benzerlik
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  const similarity = 1 - (distance / maxLength);

  // Benzerlik yüzdesini döndür (0-100)
  return Math.round(similarity * 100);
};

/**
 * Levenshtein distance helper (eğer advancedTalentScoring'den import edilmiyorsa)
 */
const levenshteinDistance = (str1, str2) => {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator,
      );
    }
  }
  
  return track[str2.length][str1.length];
};


module.exports = {
  calculateStudentScore,
  getPositionWeights,
  fuzzySkillMatch
};