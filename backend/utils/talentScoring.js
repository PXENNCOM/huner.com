// backend/utils/talentScoring.js

// 1. POZISYON AĞIRLIKLARI
const getPositionWeights = (position, seniority) => {
  const baseWeights = {
    skillMatch: 30,
    experience: 25,
    projectQuality: 20,
    profileQuality: 15,
    availability: 10
  };

  // Pozisyon türüne göre ağırlık ayarlamaları
  const positionAdjustments = {
    'frontend': { 
      skillMatch: +5,      // Frontend için skill match daha önemli
      projectQuality: +5,  // Portfolio önemli
      experience: -10      // Deneyim daha az önemli
    },
    'backend': { 
      skillMatch: +5,
      experience: +5,      // Backend için deneyim önemli
      projectQuality: -10 
    },
    'fullstack': { 
      skillMatch: +10,     // Her iki tarafı da bilmeli
      experience: -5,
      projectQuality: -5 
    },
    'mobile': { 
      projectQuality: +10, // Uygulama portfolyosu önemli
      skillMatch: +5,
      experience: -15 
    },
    'devops': {
      experience: +10,     // DevOps için deneyim kritik
      skillMatch: +5,
      projectQuality: -15
    },
    'data-science': { 
      experience: +10,
      skillMatch: +5,
      projectQuality: -15 
    },
    'ui-ux': {
      projectQuality: +15, // Portfolio çok önemli
      profileQuality: +5,
      experience: -10,
      skillMatch: -10
    }
  };

  // Seniority'ye göre ağırlık ayarlamaları
  const seniorityAdjustments = {
    'intern': { 
      experience: -15,     // Stajyerler için deneyim gerekli değil
      profileQuality: +10, // Profil kalitesi önemli
      availability: +5 
    },
    'junior': { 
      experience: -5,
      skillMatch: +5 
    },
    'mid': { 
      experience: +5,
      skillMatch: +5,
      projectQuality: -10 
    },
    'senior': { 
      experience: +15,     // Senior için deneyim çok önemli
      skillMatch: -5,
      projectQuality: -10 
    }
  };

  // Kopyala ve ayarla
  const adjusted = { ...baseWeights };
  
  if (position && positionAdjustments[position]) {
    Object.entries(positionAdjustments[position]).forEach(([key, value]) => {
      adjusted[key] = Math.max(0, adjusted[key] + value); // Negatif olmaz
    });
  }

  if (seniority && seniorityAdjustments[seniority]) {
    Object.entries(seniorityAdjustments[seniority]).forEach(([key, value]) => {
      adjusted[key] = Math.max(0, adjusted[key] + value);
    });
  }

  // Toplamın 100 olmasını sağla (normalize et)
  const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0);
  Object.keys(adjusted).forEach(key => {
    adjusted[key] = (adjusted[key] / total) * 100;
  });

  return adjusted;
};

// 2. FUZZY SKILL MATCHING
const fuzzySkillMatch = (requiredSkills, studentSkillsString) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matches: [], score: 0, averageConfidence: 0 };
  }

  if (!studentSkillsString) {
    return { matches: [], score: 0, averageConfidence: 0 };
  }

  const studentSkills = studentSkillsString
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 0);

  const matches = [];
  const threshold = 70; // %70 benzerlik yeterli

  requiredSkills.forEach(reqSkill => {
    const reqSkillLower = reqSkill.toLowerCase();
    
    // Tam eşleşme kontrolü
    const exactMatch = studentSkills.find(s => s === reqSkillLower);
    if (exactMatch) {
      matches.push({
        required: reqSkill,
        matched: exactMatch,
        score: 100,
        type: 'exact'
      });
      return;
    }

    // İçerir kontrolü (React → React.js, ReactJS)
    const containsMatch = studentSkills.find(s => 
      s.includes(reqSkillLower) || reqSkillLower.includes(s)
    );
    if (containsMatch) {
      matches.push({
        required: reqSkill,
        matched: containsMatch,
        score: 90,
        type: 'contains'
      });
      return;
    }

    // Levenshtein distance ile benzerlik kontrolü
    studentSkills.forEach(studentSkill => {
      const similarity = calculateSimilarity(reqSkillLower, studentSkill);
      if (similarity >= threshold) {
        matches.push({
          required: reqSkill,
          matched: studentSkill,
          score: similarity,
          type: 'fuzzy'
        });
      }
    });
  });

  // Duplicate'leri temizle (en yüksek score'u tut)
  const uniqueMatches = [];
  const seenRequired = new Set();
  
  matches
    .sort((a, b) => b.score - a.score)
    .forEach(match => {
      if (!seenRequired.has(match.required)) {
        uniqueMatches.push(match);
        seenRequired.add(match.required);
      }
    });

  return {
    matches: uniqueMatches,
    score: (uniqueMatches.length / requiredSkills.length) * 100,
    averageConfidence: uniqueMatches.length > 0 
      ? uniqueMatches.reduce((sum, m) => sum + m.score, 0) / uniqueMatches.length 
      : 0
  };
};

// Levenshtein Distance - basit versiyon
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 100;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return ((longer.length - editDistance) / longer.length) * 100;
};

const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

// 3. SKORLAMA FONKSİYONU
const calculateStudentScore = (student, filters, weights) => {
  const scoreBreakdown = {
    skillMatch: 0,
    experience: 0,
    projectQuality: 0,
    profileQuality: 0,
    availability: 0
  };

  // 3.1 SKILL MATCHING
  if (filters.skills && filters.skills.length > 0) {
    const fuzzyMatch = fuzzySkillMatch(filters.skills, student.skills);
    
    // Tam eşleşmelere daha yüksek puan
    const exactMatches = fuzzyMatch.matches.filter(m => m.type === 'exact').length;
    const containsMatches = fuzzyMatch.matches.filter(m => m.type === 'contains').length;
    const fuzzyMatches = fuzzyMatch.matches.filter(m => m.type === 'fuzzy').length;
    
    scoreBreakdown.skillMatch = (
      (exactMatches / filters.skills.length) * weights.skillMatch * 1.0 +
      (containsMatches / filters.skills.length) * weights.skillMatch * 0.9 +
      (fuzzyMatches / filters.skills.length) * weights.skillMatch * 0.7
    );
    
    student.fuzzyMatchResult = fuzzyMatch;
  } else {
    scoreBreakdown.skillMatch = weights.skillMatch * 0.5; // Filtre yoksa ortalama puan
  }

  // 3.2 EXPERIENCE SCORING
  if (student.WorkExperiences && student.WorkExperiences.length > 0) {
    let totalMonths = 0;
    let relevantExperience = 0;
    
    student.WorkExperiences.forEach(exp => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const months = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
      
      totalMonths += months;
      
      if (filters.workType && exp.workType === filters.workType) {
        relevantExperience += months;
      }
    });
    
    student.totalExperienceMonths = totalMonths;
    
    // Logaritmik skorlama (ilk deneyimler daha değerli)
    const baseScore = (Math.log(totalMonths + 1) / Math.log(37)) * weights.experience;
    const relevanceBonus = relevantExperience > 0 ? weights.experience * 0.2 : 0;
    
    scoreBreakdown.experience = Math.min(weights.experience, baseScore + relevanceBonus);
  }

  // 3.3 PROJECT QUALITY - ✅ DEĞİŞTİRİLDİ: studentData → student
  if (student.Projects && student.Projects.length > 0) {
    const projectCount = student.Projects.length;
    let projectScore = 0;
    
    // Proje sayısı
    projectScore += Math.min(weights.projectQuality * 0.4, projectCount * 2);
    
    // GitHub linki
    const githubProjects = student.Projects.filter(p => p.githubUrl);
    projectScore += Math.min(weights.projectQuality * 0.2, githubProjects.length * 2);
    
    // Live demo
    const liveProjects = student.Projects.filter(p => p.liveUrl);
    projectScore += Math.min(weights.projectQuality * 0.2, liveProjects.length * 2);
    
    // Teknoloji eşleşmesi
    if (filters.skills && filters.skills.length > 0) {
      const matchingProjects = student.Projects.filter(project => {
        if (!project.technologies) return false;
        const projectTechs = project.technologies.toLowerCase();
        return filters.skills.some(skill => 
          projectTechs.includes(skill.toLowerCase())
        );
      });
      projectScore += Math.min(weights.projectQuality * 0.2, matchingProjects.length * 3);
    }
    
    scoreBreakdown.projectQuality = Math.min(weights.projectQuality, projectScore);
    student.projectCount = projectCount;
  }

  // 3.4 PROFILE QUALITY
  let profileScore = 0;
  
  const profileFields = [
    student.fullName, student.age, student.city, student.school,
    student.educationLevel, student.department, student.languages,
    student.skills, student.shortBio
  ];
  
  const completedFields = profileFields.filter(f => f !== null && f !== '' && f !== undefined).length;
  profileScore += (completedFields / profileFields.length) * weights.profileQuality * 0.5;
  
  if (student.githubProfile) profileScore += weights.profileQuality * 0.15;
  if (student.linkedinProfile) profileScore += weights.profileQuality * 0.15;
  if (student.profileImage) profileScore += weights.profileQuality * 0.1;
  if (student.shortBio && student.shortBio.length > 50) profileScore += weights.profileQuality * 0.1;
  
  scoreBreakdown.profileQuality = Math.min(weights.profileQuality, profileScore);
  student.profileCompleteness = Math.round((completedFields / profileFields.length) * 100);

  // 3.5 AVAILABILITY
  scoreBreakdown.availability = weights.availability;

  // TOPLAM SKOR
  const totalScore = Object.values(scoreBreakdown).reduce((sum, val) => sum + val, 0);
  
  return {
    totalScore: Math.round(totalScore * 10) / 10, // 1 ondalık
    scoreBreakdown
  };
};

module.exports = {
  getPositionWeights,
  fuzzySkillMatch,
  calculateStudentScore
};