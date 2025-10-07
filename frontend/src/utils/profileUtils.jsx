// utils/profileUtils.js
import { getEmployerProfile } from '../services/employerApi';

export const checkEmployerProfileComplete = async () => {
  try {
    const response = await getEmployerProfile();
    const profile = response.data;
    
    // Zorunlu alanları kontrol et
    const requiredFields = [
      'fullName', 
      'companyName', 
      'position', 
      'industry', 
      'phoneNumber', 
      'city', 
      'address'
    ];
    
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!profile[field] || profile[field].trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      const fieldNames = {
        fullName: 'Ad Soyad',
        companyName: 'Şirket Adı',
        position: 'Pozisyon',
        industry: 'Sektör',
        phoneNumber: 'Telefon Numarası',
        city: 'Şehir',
        address: 'Adres'
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
      
      return {
        isComplete: false,
        missingFields,
        message: `Profil bilgileriniz eksik. Lütfen şu alanları doldurun: ${missingFieldNames}`,
        profile
      };
    }
    
    return {
      isComplete: true,
      profile
    };
    
  } catch (error) {
    console.error('Profil kontrol hatası:', error);
    return {
      isComplete: false,
      error: true,
      message: 'Profil bilgileriniz kontrol edilirken bir hata oluştu.'
    };
  }
};