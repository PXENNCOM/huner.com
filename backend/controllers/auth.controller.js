// controllers/auth.controller.js
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const nodemailer = require('nodemailer');

// ✅ DEBUG - nodemailer kontrolü
console.log('=== NODEMAILER CHECK ===');
console.log('nodemailer:', typeof nodemailer);
console.log('nodemailer.createTransport:', typeof nodemailer.createTransport);
console.log('========================');

// controllers/auth.controller.js
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      fullName,
      linkedinProfile,
      githubProfile,
      companyName,
      position,
      industry,
      companyWebsite,
      phoneNumber
    } = req.body;

    // E-posta kontrolü
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor.'
      });
    }

    // Genel validasyonlar
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'E-posta adresi gereklidir'
      });
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi girin'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Ad Soyad gereklidir'
      });
    }

    // Öğrenci için validasyon
    if (userType === 'student') {
      if (!linkedinProfile || !linkedinProfile.includes('linkedin.com')) {
        return res.status(400).json({
          success: false,
          message: 'Geçerli bir LinkedIn profili gereklidir'
        });
      }

      if (!githubProfile || !githubProfile.includes('github.com')) {
        return res.status(400).json({
          success: false,
          message: 'Geçerli bir GitHub profili gereklidir'
        });
      }

      if (!phoneNumber || phoneNumber.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Telefon numarası gereklidir'
        });
      }

      // Telefon numarası format kontrolü
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Geçerli bir telefon numarası girin'
        });
      }
    }

    // İşveren için validasyon
    if (userType === 'employer') {
      if (!companyName || companyName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Şirket adı gereklidir'
        });
      }

      if (!position || position.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Pozisyon bilgisi gereklidir'
        });
      }

      if (!industry || industry.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Sektör bilgisi gereklidir'
        });
      }

      if (!companyWebsite || companyWebsite.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Şirket web sitesi gereklidir'
        });
      }

      if (!phoneNumber || phoneNumber.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Telefon numarası gereklidir'
        });
      }

      // Telefon numarası format kontrolü
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Geçerli bir telefon numarası girin'
        });
      }
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6 haneli email doğrulama kodu oluştur
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika geçerli

    // Kullanıcı oluşturma - email doğrulanmamış olarak
    const user = await User.create({
      email,
      password: hashedPassword,
      userType,
      approvalStatus: userType === 'student' ? 'pending' : 'approved',
      isEmailVerified: false,
      emailVerificationCode: emailVerificationCode,
      emailVerificationExpires: emailVerificationExpires
    });

    // Profil bilgilerini geçici olarak kaydet (email doğrulandıktan sonra kullanılacak)
    const tempProfileData = {
      userId: user.id,
      fullName: fullName,
      phoneNumber: phoneNumber,
      ...(userType === 'student' && {
        linkedinProfile: linkedinProfile,
        githubProfile: githubProfile
      }),
      ...(userType === 'employer' && {
        companyName: companyName,
        position: position,
        industry: industry,
        companyWebsite: companyWebsite
      })
    };

    // Geçici profil verilerini kullanıcıya kaydet
    await user.update({
      tempProfileData: JSON.stringify(tempProfileData)
    });

    // Email doğrulama kodu gönder
    try {
      console.log('📧 Email gönderme başlıyor...');
      console.log('NODE_ENV:', process.env.NODE_ENV);

      // ✅ DEVELOPMENT MODE - Email göndermeden test et
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 DEVELOPMENT MODE - Email gönderilmiyor');
        console.log('📨 Email:', email);
        console.log('🔑 Verification Code:', emailVerificationCode);
        console.log('👤 User ID:', user.id);
        console.log('⏰ Kod geçerlilik süresi: 10 dakika');
        console.log('====================================');

        return res.status(201).json({
          success: true,
          message: 'Kayıt başarılı! Doğrulama kodu console\'da görüntüleniyor (DEV MODE)',
          userId: user.id,
          emailSent: true,
          needsEmailVerification: true,
          _devMode: true,
          _devCode: emailVerificationCode
        });
      }

      // ✅ PRODUCTION MODE - Gerçek email gönder
      console.log('📧 PRODUCTION MODE - Email gönderiliyor...');
      console.log('Email:', email);
      console.log('Code:', emailVerificationCode);
      console.log('Name:', fullName);

      console.log('sendVerificationEmail fonksiyonu çağrılıyor...');
      const emailResult = await sendVerificationEmail(email, emailVerificationCode, fullName);
      console.log('Email sonucu:', emailResult);

      if (emailResult.success) {
        return res.status(201).json({
          success: true,
          message: 'Kayıt başarılı! Email adresinize gönderilen 6 haneli kodu girerek hesabınızı doğrulayın.',
          userId: user.id,
          emailSent: true,
          needsEmailVerification: true
        });
      } else {
        throw new Error('Email gönderilemedi');
      }
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError);
      console.error('Stack:', emailError.stack);

      // Email gönderilemese bile kullanıcı oluşturuldu
      return res.status(201).json({
        success: true,
        message: 'Kayıt başarılı ancak doğrulama emaili gönderilemedi. Lütfen destek ekibi ile iletişime geçin.',
        userId: user.id,
        emailSent: false,
        needsEmailVerification: true
      });
    }

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.resendVerificationCode = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı ID gereklidir'
      });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi zaten doğrulanmış'
      });
    }

    // Yeni kod oluştur
    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika geçerli

    await user.update({
      emailVerificationCode: emailVerificationCode,
      emailVerificationExpires: emailVerificationExpires
    });

    // ✅ tempProfileData kontrolü ekle
    let fullName = 'Değerli Kullanıcı';
    if (user.tempProfileData) {
      try {
        const tempProfileData = JSON.parse(user.tempProfileData);
        fullName = tempProfileData.fullName || 'Değerli Kullanıcı';
      } catch (parseError) {
        console.error('tempProfileData parse hatası:', parseError);
        // Parse edilemezse default ismi kullan
      }
    }

    // Email gönder
    try {
      // ✅ DEVELOPMENT MODE
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 RESEND - DEVELOPMENT MODE');
        console.log('🔑 New Verification Code:', emailVerificationCode);
        console.log('👤 User ID:', userId);
        console.log('====================================');

        return res.status(200).json({
          success: true,
          message: 'Doğrulama kodu yeniden gönderildi (DEV MODE - Console\'a bakın)',
          _devMode: true,
          _devCode: emailVerificationCode
        });
      }

      // ✅ PRODUCTION MODE
      const emailResult = await sendVerificationEmail(user.email, emailVerificationCode, fullName);

      if (emailResult.success) {
        res.status(200).json({
          success: true,
          message: 'Doğrulama kodu yeniden gönderildi'
        });
      } else {
        throw new Error('Email gönderilemedi');
      }
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError);
      res.status(500).json({
        success: false,
        message: 'Email gönderilemedi, lütfen tekrar deneyin'
      });
    }

  } catch (error) {
    console.error('Kod yeniden gönderme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    console.log('=== VERIFY EMAIL DEBUG ===');
    console.log('Received userId:', userId);
    console.log('Received code:', verificationCode);

    if (!userId || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı ID ve doğrulama kodu gereklidir'
      });
    }

    // ✅ ÖNCE BASIT SORGU - Tarih kontrolü olmadan
    const userSimple = await User.findByPk(userId);

    console.log('User found:', userSimple ? 'YES' : 'NO');
    if (userSimple) {
      console.log('User email:', userSimple.email);
      console.log('Stored code:', userSimple.emailVerificationCode);
      console.log('Code expires at:', userSimple.emailVerificationExpires);
      console.log('Current time:', new Date());
      console.log('Is expired?', new Date() > new Date(userSimple.emailVerificationExpires));
    }

    // Kullanıcıyı bulma - TARİH KONTROLÜ İLE
    const user = await User.findOne({
      where: {
        id: userId,
        emailVerificationExpires: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    console.log('User with valid expiry:', user ? 'YES' : 'NO');
    console.log('========================');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı bulunamadı veya doğrulama kodu süresi dolmuş'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi zaten doğrulanmış'
      });
    }

    // Kodu doğrula
    if (user.emailVerificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz doğrulama kodu'
      });
    }

    // Email doğrulandı, profilleri oluştur
    const tempProfileData = JSON.parse(user.tempProfileData);

    if (user.userType === 'student') {
      // ✅ ÖNCE KONTROL ET - SADECE YOKSA OLUŞTUR
      const existingProfile = await db.StudentProfile.findOne({
        where: { userId: user.id }
      });

      if (!existingProfile) {
        await db.StudentProfile.create({
          userId: user.id,
          fullName: tempProfileData.fullName,
          phoneNumber: tempProfileData.phoneNumber,
          linkedinProfile: tempProfileData.linkedinProfile,
          githubProfile: tempProfileData.githubProfile,
          age: null,
          city: null,
          school: null,
          educationLevel: null,
          currentGrade: null,
          department: null,
          languages: null,
          studentDocument: null,
          skills: null,
          profileImage: null,
          shortBio: null
        });
      }
    }

    if (user.userType === 'employer') {
      // ✅ ÖNCE KONTROL ET - SADECE YOKSA OLUŞTUR
      const existingProfile = await db.EmployerProfile.findOne({
        where: { userId: user.id }
      });

      if (!existingProfile) {
        await db.EmployerProfile.create({
          userId: user.id,
          fullName: tempProfileData.fullName,
          companyName: tempProfileData.companyName,
          position: tempProfileData.position,
          industry: tempProfileData.industry,
          companyWebsite: tempProfileData.companyWebsite,
          phoneNumber: tempProfileData.phoneNumber,
          city: null,
          address: null,
          age: null,
          profileImage: null
        });
      }
    }

    // Email doğrulandı olarak işaretle ve geçici verileri temizle
    await user.update({
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
      tempProfileData: null
    });

    // Token oluştur
    const token = jwt.sign(
      { id: user.id, userType: user.userType, email: user.email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: user.userType === 'student'
        ? 'Email doğrulandı! Admin onayı bekleniyor.'
        : 'Email doğrulandı! Hesabınız aktif edildi.',
      userId: user.id,
      approvalStatus: user.approvalStatus,
      token: token,
      emailVerified: true
    });

  } catch (error) {
    console.error('Email doğrulama hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bulma
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }

    // ✅ EMAIL DOĞRULAMA KONTROLÜ EKLE
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email adresinizi doğrulamanız gerekiyor',
        needsEmailVerification: true,
        userId: user.id
      });
    }

    // Onay durumu kontrolü (sadece student için)
    if (user.userType === 'student' && user.approvalStatus !== 'approved') {
      if (user.approvalStatus === 'pending') {
        return res.status(403).json({
          message: 'Hesabınız henüz onaylanmadı. Lütfen admin onayını bekleyin.'
        });
      } else if (user.approvalStatus === 'rejected') {
        return res.status(403).json({
          message: 'Hesabınız reddedildi.',
          reason: user.rejectionReason || 'Belirtilmemiş'
        });
      }
    }

    // JWT token oluşturma
    const token = jwt.sign(
      { id: user.id, userType: user.userType, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    console.log('Oluşturulan token:', token.substring(0, 15) + '...');
    console.log('Token payload:', { id: user.id, userType: user.userType, email: user.email });

    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Email validasyonu
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'E-posta adresi gereklidir'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi girin'
      });
    }

    // Kullanıcıyı bulma
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama kodu gönderildi.'
      });
    }

    // 6 haneli güvenli kod oluştur
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 dakika geçerli

    // Kullanıcıya reset bilgilerini kaydet
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordCode: resetCode,
      resetPasswordExpires: resetTokenExpiry
    });

    // Email gönderimi
    try {
      // Kullanıcı bilgilerini al
      let userProfile = null;
      if (user.userType === 'employer') {
        userProfile = await db.EmployerProfile.findOne({ where: { userId: user.id } });
      } else if (user.userType === 'student') {
        userProfile = await db.StudentProfile.findOne({ where: { userId: user.id } });
      }

      const userName = userProfile?.fullName || 'Değerli Kullanıcı';

      console.log('Email gönderiliyor:', email, 'Kod:', resetCode);

      // Email gönder
      const emailResult = await sendResetCodeEmail(email, resetCode, userName);

      if (emailResult.success) {
        res.status(200).json({
          success: true,
          message: 'Şifre sıfırlama kodu email adresinize gönderildi.',
          resetToken: resetToken
        });
      } else {
        throw new Error('Email gönderilemedi');
      }

    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError);

      res.status(200).json({
        success: true,
        message: 'Şifre sıfırlama kodu gönderildi.',
        resetToken: resetToken
      });
    }

  } catch (error) {
    console.error('Şifre sıfırlama isteği hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};

// Şifre sıfırlama kodunu doğrula
exports.verifyResetCode = async (req, res) => {
  try {
    const { resetToken, code } = req.body;

    if (!resetToken || !code) {
      return res.status(400).json({
        success: false,
        message: 'Reset token ve kod gereklidir'
      });
    }

    // Token'a göre kullanıcıyı bulma
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    // Kodu doğrula
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz doğrulama kodu'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Kod doğrulandı. Yeni şifrenizi belirleyebilirsiniz.',
      verified: true
    });

  } catch (error) {
    console.error('Kod doğrulama hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};

// Yeni şifre belirleme
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    // Validasyonlar
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar gereklidir'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    // Token'a göre kullanıcıyı bulma
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle ve reset bilgilerini temizle
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordCode: null,
      resetPasswordExpires: null
    });

    res.status(200).json({
      success: true,
      message: 'Şifre başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.'
    });

  } catch (error) {
    console.error('Şifre güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu'
    });
  }
};

// ✅ CLOUDFLARE + HOSTINGER İÇİN OPTİMİZE EDİLMİŞ EMAIL FONKSİYONU
const sendVerificationEmail = async (email, verificationCode, userName) => {
  try {
    const nodemailer = require('nodemailer');

    // ✅ Cloudflare + Hostinger için optimize edilmiş transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true, // SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    const mailOptions = {
      from: '"hunerly" <info@hunerly.com>', // ✅ İsim eklendi
      to: email,
      replyTo: 'info@hunerly.com',
      subject: 'HÜNER - Email Doğrulama Kodu',
      // ✅ Düz metin versiyonu (spam skorunu iyileştirir)
      text: `
Merhaba ${userName},

Hoş geldiniz! Hesabınızı aktifleştirmek için doğrulama kodunuz:

${verificationCode}

Bu kod 10 dakika geçerlidir.
Kodu kimseyle paylaşmayın.

hunerly.com
İletişim: info@hunerly.com
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Doğrulama</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #004493, #0158C1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; }
            .code-box { background: #004493; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 10px; }
            .warning { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; color: #155724; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 11px; margin-top: 30px; padding: 20px; }
            .footer a { color: #004493; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">HÜNER</h1>
              <h2 style="margin: 10px 0 0 0;">Email Doğrulama</h2>
            </div>
            <div class="content">
              <p>Merhaba ${userName},</p>
              <p>Hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki 6 haneli kodu girin:</p>
              
              <div class="code-box">${verificationCode}</div>
              
              <div class="warning">
                <strong>Önemli Bilgiler:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Bu kod <strong>10 dakika</strong> geçerlidir</li>
                  <li>Kodu kimseyle paylaşmayın</li>
                  <li>Bu emaili siz almadıysanız, güvenliğiniz için bizimle iletişime geçin</li>
                </ul>
              </div>
              
              <p>Email doğrulamanızı tamamladıktan sonra hesabınızı kullanmaya başlayabilirsiniz.</p>
              
              <div class="footer">
                <p>Bu otomatik bir mesajdır, lütfen yanıt vermeyiniz.</p>
                <p><a href="https://hunerly.com">hunerly.com</a> | İletişim: info@hunerly.com</p>
                <p style="margin-top: 15px; font-size: 10px;">
                  Bu emaili almak istemiyorsanız, <a href="https://hunerly.com/unsubscribe?email=${email}">buradan çıkabilirsiniz</a>
                </p>
                <p>&copy; 2025 hunerly. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Doğrulama emaili gönderildi:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ✅ CLOUDFLARE + HOSTINGER İÇİN OPTİMİZE EDİLMİŞ ŞİFRE SIFIRLAMA FONKSİYONU
const sendResetCodeEmail = async (email, resetCode, userName) => {
  try {
    const nodemailer = require('nodemailer');

    // ✅ Cloudflare + Hostinger için optimize edilmiş transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    const mailOptions = {
      from: '"hunerly" <info@hunerly.com>',
      to: email,
      replyTo: 'info@hunerly.com',
      subject: 'HÜNER - Şifre Sıfırlama Kodu',
      // ✅ Düz metin versiyonu
      text: `
Merhaba ${userName || 'Değerli Kullanıcı'},

Hesabınız için şifre sıfırlama isteği aldık. Doğrulama kodunuz:

${resetCode}

Bu kod 10 dakika geçerlidir.
Bu isteği siz yapmadıysanız, bu emaili dikkate almayın.

hunerly.com
İletişim: info@hunerly.com
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Şifre Sıfırlama</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #004493, #0158C1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; }
            .code-box { background: #004493; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 10px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; color: #856404; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 11px; margin-top: 30px; padding: 20px; }
            .footer a { color: #004493; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">HÜNER</h1>
              <h2 style="margin: 10px 0 0 0;">Şifre Sıfırlama İsteği</h2>
            </div>
            <div class="content">
              <p>Merhaba ${userName || 'Değerli Kullanıcı'},</p>
              <p>Hesabınız için şifre sıfırlama isteği aldık. Aşağıdaki 6 haneli kodu kullanarak yeni şifrenizi belirleyebilirsiniz:</p>
              
              <div class="code-box">${resetCode}</div>
              
              <div class="warning">
                <strong>Önemli Uyarılar:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Bu kod <strong>10 dakika</strong> geçerlidir</li>
                  <li>Kodu kimseyle paylaşmayın</li>
                  <li>Bu isteği siz yapmadıysanız, bu emaili dikkate almayın</li>
                </ul>
              </div>
              
              <p>Şifre sıfırlama işlemini tamamlamak için kodu girin ve yeni şifrenizi belirleyin.</p>
              
              <div class="footer">
                <p>Bu otomatik bir mesajdır, lütfen yanıt vermeyiniz.</p>
                <p><a href="https://hunerly.com">hunerly.com</a> | İletişim: info@hunerly.com</p>
                <p style="margin-top: 15px; font-size: 10px;">
                  Bu emaili almak istemiyorsanız, <a href="https://hunerly.com/unsubscribe?email=${email}">buradan çıkabilirsiniz</a>
                </p>
                <p>&copy; 2025 hunerly. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Şifre sıfırlama emaili gönderildi:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ✅ EMAIL TEST FONKSİYONU (Geçici - test için)
exports.testEmail = async (req, res) => {
  try {
    console.log('=== EMAIL TEST BAŞLADI ===');
    console.log('nodemailer type:', typeof nodemailer);
    console.log('nodemailer.createTransport type:', typeof nodemailer.createTransport);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    console.log('✅ Transporter oluşturuldu');

    const info = await transporter.sendMail({
      from: '"hunerly" <info@hunerly.com>',
      to: req.body.email || 'test@test.com',
      subject: 'Test Email',
      text: 'Bu bir test emailidir.',
      html: '<p>Bu bir <strong>test emailidir</strong>.</p>'
    });

    console.log('✅ Email gönderildi:', info.messageId);

    res.json({
      success: true,
      message: 'Email başarıyla gönderildi',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ Test email hatası:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};