const natural = require('natural');
const tokenizer = new natural.WordTokenizer();


const searchInText = (text, keywords) => {
  if (!text || !keywords || keywords.length === 0) {
    return { score: 0, matches: [] };
  }

  const normalizedText = text.toLowerCase().trim();
  const matches = [];
  let totalScore = 0;

  keywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    
    // Tam eşleşme (en yüksek puan)
    if (normalizedText.includes(normalizedKeyword)) {
      matches.push({
        keyword,
        type: 'exact',
        score: 100
      });
      totalScore += 100;
      return;
    }

    // Kelime bazlı eşleşme
    const textWords = normalizedText.split(/\s+/);
    const keywordWords = normalizedKeyword.split(/\s+/);
    
    keywordWords.forEach(kw => {
      const found = textWords.some(tw => {
        // Basit benzerlik kontrolü
        if (tw === kw) return true;
        
        // Kısmi eşleşme (tw içinde kw geçiyorsa veya tersi)
        if (tw.includes(kw) || kw.includes(tw)) {
          const similarity = Math.min(kw.length, tw.length) / Math.max(kw.length, tw.length);
          return similarity >= 0.7; // %70 benzerlik
        }
        
        // Levenshtein distance (basit implementasyon)
        const distance = levenshteinDistance(tw, kw);
        const similarity = 1 - (distance / Math.max(tw.length, kw.length));
        return similarity >= 0.75; // %75 benzerlik
      });

      if (found) {
        matches.push({
          keyword: kw,
          type: 'fuzzy',
          score: 70
        });
        totalScore += 70;
      }
    });
  });

  // Normalize et (0-100 arası)
  const normalizedScore = matches.length > 0 
    ? Math.min(100, (totalScore / keywords.length))
    : 0;

  return {
    score: normalizedScore,
    matches: matches,
    matchCount: matches.length
  };
};

/**
 * Levenshtein distance hesaplama
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

/**
 * Öğrenci profilinde kapsamlı arama yap
 * @param {object} student - Öğrenci profili
 * @param {object} searchCriteria - Arama kriterleri
 * @returns {object} - Detaylı skorlama sonucu
 */
const comprehensiveStudentSearch = (student, searchCriteria) => {
  const { skills = [], position, keywords = [] } = searchCriteria;
  
  // Tüm aranacak anahtar kelimeleri birleştir
  const allKeywords = [...skills, ...keywords].filter(Boolean);
  
  if (allKeywords.length === 0) {
    return {
      bio: { score: 0, matches: [] },
      skills: { score: 0, matches: [] },
      department: { score: 0, matches: [] },
      languages: { score: 0, matches: [] },
      projects: { score: 0, matches: [], details: [] },
      workExperiences: { score: 0, matches: [], details: [] },
      positionRelevance: null
    };
  }

  const results = {
    // 1. Profil Bilgileri Araması
    bio: searchInText(student.shortBio, allKeywords),
    
    // 2. Beceriler Araması
    skills: searchInText(student.skills, allKeywords),
    
    // 3. Bölüm Araması
    department: searchInText(student.department, allKeywords),
    
    // 4. Diller
    languages: searchInText(student.languages, allKeywords),
    
    // 5. Projeler Araması
    projects: {
      score: 0,
      matches: [],
      details: []
    },
    
    // 6. İş Deneyimleri Araması
    workExperiences: {
      score: 0,
      matches: [],
      details: []
    }
  };

  // Projelerde arama
  if (student.Projects && student.Projects.length > 0) {
    let projectTotalScore = 0;
    let projectMatches = [];

    student.Projects.forEach(project => {
      // Proje başlığında ara
      const titleMatch = searchInText(project.title, allKeywords);
      
      // Proje açıklamasında ara
      const descMatch = searchInText(project.description, allKeywords);
      
      // Proje teknolojilerinde ara
      const techMatch = searchInText(project.technologies, allKeywords);

      const projectScore = (
        titleMatch.score * 0.4 + 
        descMatch.score * 0.4 + 
        techMatch.score * 0.2
      );

      if (projectScore > 0) {
        projectTotalScore += projectScore;
        projectMatches.push({
          projectId: project.id,
          projectTitle: project.title,
          score: projectScore,
          titleMatches: titleMatch.matches,
          descMatches: descMatch.matches,
          techMatches: techMatch.matches
        });
      }
    });

    results.projects.score = Math.min(100, projectTotalScore / student.Projects.length);
    results.projects.matches = projectMatches;
    results.projects.details = projectMatches;
  }

  // İş deneyimlerinde arama
  if (student.WorkExperiences && student.WorkExperiences.length > 0) {
    let expTotalScore = 0;
    let expMatches = [];

    student.WorkExperiences.forEach(exp => {
      // Pozisyon adında ara
      const positionMatch = searchInText(exp.position, allKeywords);
      
      // Şirket adında ara
      const companyMatch = searchInText(exp.companyName, allKeywords);
      
      // Açıklamada ara
      const descMatch = searchInText(exp.description, allKeywords);

      const expScore = (
        positionMatch.score * 0.4 + 
        companyMatch.score * 0.2 + 
        descMatch.score * 0.4
      );

      if (expScore > 0) {
        expTotalScore += expScore;
        expMatches.push({
          company: exp.companyName,
          position: exp.position,
          score: expScore,
          positionMatches: positionMatch.matches,
          companyMatches: companyMatch.matches,
          descMatches: descMatch.matches
        });
      }
    });

    results.workExperiences.score = Math.min(100, expTotalScore / student.WorkExperiences.length);
    results.workExperiences.matches = expMatches;
    results.workExperiences.details = expMatches;
  }

  // Pozisyon özel araması
  if (position) {
    const positionKeywords = getPositionKeywords(position);
    
    // Her alanda pozisyona özel ara
    results.positionRelevance = {
      bio: searchInText(student.shortBio, positionKeywords),
      skills: searchInText(student.skills, positionKeywords),
      department: searchInText(student.department, positionKeywords),
      projects: 0,
      workExp: 0
    };

    // Proje ve iş deneyimlerinde pozisyona özel arama
    if (student.Projects && student.Projects.length > 0) {
      const projectPosScores = student.Projects.map(p => 
        searchInText(`${p.title} ${p.description} ${p.technologies}`, positionKeywords).score
      );
      results.positionRelevance.projects = projectPosScores.length > 0
        ? projectPosScores.reduce((a, b) => a + b, 0) / projectPosScores.length
        : 0;
    }

    if (student.WorkExperiences && student.WorkExperiences.length > 0) {
      const expPosScores = student.WorkExperiences.map(e => 
        searchInText(`${e.position} ${e.description}`, positionKeywords).score
      );
      results.positionRelevance.workExp = expPosScores.length > 0
        ? expPosScores.reduce((a, b) => a + b, 0) / expPosScores.length
        : 0;
    }
  }

  return results;
};

/**
 * Pozisyona özel anahtar kelimeler
 */
const getPositionKeywords = (position) => {
  const positionMap = {
    'frontend': [
      'react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 
      'ui', 'ux', 'responsive', 'web', 'frontend', 'next.js', 'tailwind',
      'sass', 'webpack', 'vite', 'redux', 'context', 'hooks'
    ],
    'backend': [
      'node', 'express', 'api', 'database', 'sql', 'mongodb', 'server', 
      'backend', 'rest', 'graphql', 'microservices', 'postgresql', 'mysql',
      'redis', 'nginx', 'jwt', 'authentication', 'authorization'
    ],
    'fullstack': [
      'full-stack', 'fullstack', 'mern', 'mean', 'react', 'node', 'api', 
      'database', 'frontend', 'backend', 'full stack', 'mongodb', 'express',
      'postgresql', 'rest api', 'spa', 'ssr'
    ],
    'mobile': [
      'react native', 'flutter', 'ios', 'android', 'mobile', 'app', 
      'swift', 'kotlin', 'xamarin', 'expo', 'native', 'hybrid',
      'mobile app', 'responsive', 'pwa'
    ],
    'devops': [
      'docker', 'kubernetes', 'ci/cd', 'jenkins', 'aws', 'azure', 'cloud', 
      'devops', 'infrastructure', 'terraform', 'ansible', 'linux',
      'monitoring', 'deployment', 'automation', 'gitlab', 'github actions'
    ],
    'data-science': [
      'python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 
      'data', 'analytics', 'pandas', 'numpy', 'scikit-learn', 'keras',
      'data analysis', 'data science', 'ai', 'artificial intelligence',
      'neural network', 'nlp', 'computer vision'
    ],
    'ui-ux': [
      'figma', 'sketch', 'adobe xd', 'design', 'ui', 'ux', 'prototype', 
      'wireframe', 'user experience', 'user interface', 'photoshop',
      'illustrator', 'user research', 'usability', 'interaction design'
    ]
  };

  return positionMap[position] || [];
};

module.exports = {
  searchInText,
  levenshteinDistance,
  comprehensiveStudentSearch,
  getPositionKeywords
};