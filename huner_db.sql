-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 07 Eki 2025, 13:49:53
-- Sunucu sürümü: 9.1.0
-- PHP Sürümü: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `huner_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `adminmessages`
--

DROP TABLE IF EXISTS `adminmessages`;
CREATE TABLE IF NOT EXISTS `adminmessages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `recipientType` enum('students','employers') NOT NULL,
  `sendType` enum('all','selected') NOT NULL,
  `priority` enum('low','normal','high') DEFAULT 'normal',
  `isRead` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `developer_requests`
--

DROP TABLE IF EXISTS `developer_requests`;
CREATE TABLE IF NOT EXISTS `developer_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employerId` int NOT NULL COMMENT 'İşveren profili ID''si',
  `projectTitle` varchar(200) NOT NULL COMMENT 'Proje başlığı',
  `projectDescription` text NOT NULL COMMENT 'Proje açıklaması',
  `projectType` enum('website','mobile_app','api','ecommerce','crm','desktop_app','other') NOT NULL COMMENT 'Proje tipi',
  `technologies` json DEFAULT NULL COMMENT 'Gerekli teknolojiler (array)',
  `experienceLevel` enum('intern','junior','mid','senior') NOT NULL COMMENT 'Deneyim seviyesi',
  `workType` enum('freelance','part_time','full_time','intern') NOT NULL COMMENT 'Çalışma türü',
  `duration` enum('1_month','2_months','3_months','4_months','5_months','6_months','6_plus_months','indefinite') NOT NULL COMMENT 'Proje süresi',
  `startDate` enum('immediately','within_1_week','within_1_month') NOT NULL COMMENT 'Başlangıç tarihi',
  `workStyle` enum('remote','hybrid','office') NOT NULL COMMENT 'Çalışma şekli',
  `location` varchar(100) DEFAULT NULL COMMENT 'Çalışma konumu (şehir)',
  `workHours` enum('business_hours','flexible','night_shift') NOT NULL COMMENT 'Çalışma saatleri',
  `teamSize` enum('solo','2_3_people','team') NOT NULL COMMENT 'Takım büyüklüğü',
  `communicationLanguages` json DEFAULT NULL COMMENT 'İletişim dilleri (array)',
  `industryExperience` enum('ecommerce','fintech','healthcare','education','gaming','social_media','no_preference') DEFAULT NULL COMMENT 'Sektör deneyimi tercihi',
  `priority` enum('normal','high','urgent') DEFAULT 'normal' COMMENT 'Öncelik seviyesi',
  `budgetRange` varchar(50) DEFAULT NULL COMMENT 'Bütçe aralığı (sadece admin görebilir)',
  `status` enum('pending','reviewing','approved','assigned','completed','cancelled') DEFAULT 'pending' COMMENT 'Talep durumu',
  `adminNotes` text COMMENT 'Admin notları',
  `assignedDeveloperId` int DEFAULT NULL COMMENT 'Atanan yazılımcı ID''si',
  `assignedAt` datetime DEFAULT NULL COMMENT 'Atanma tarihi',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `developer_requests_employer_id` (`employerId`),
  KEY `developer_requests_status` (`status`),
  KEY `developer_requests_priority` (`priority`),
  KEY `developer_requests_created_at` (`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `developer_requests`
--

INSERT INTO `developer_requests` (`id`, `employerId`, `projectTitle`, `projectDescription`, `projectType`, `technologies`, `experienceLevel`, `workType`, `duration`, `startDate`, `workStyle`, `location`, `workHours`, `teamSize`, `communicationLanguages`, `industryExperience`, `priority`, `budgetRange`, `status`, `adminNotes`, `assignedDeveloperId`, `assignedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'E-Ticaret Uygulaması Geliştirilmesi.', 'Lorem İpsumLorem İpsumLorem İpsumLorem İpsumLorem İpsumLorem İpsumLorem İpsum', 'website', '[\"MongoDB\", \"MySQL\"]', 'mid', 'intern', '1_month', 'immediately', 'remote', NULL, 'business_hours', '2_3_people', '[\"İngilizce\"]', 'fintech', 'normal', '20000', 'pending', NULL, NULL, NULL, '2025-09-23 20:09:02', '2025-09-23 20:09:02'),
(2, 1, 'E-Ticaret Uygulaması Geliştirilmesi.', 'lorem ipsum dolor in samet lorem ipsum dolor in sametlorem ipsum dolor in samet', 'mobile_app', '[\"React Native\", \"Vue.js\"]', 'junior', 'freelance', '1_month', 'immediately', 'hybrid', NULL, 'flexible', 'team', '[\"Türkçe\"]', 'ecommerce', 'urgent', '300000', 'pending', NULL, NULL, NULL, '2025-09-26 14:38:01', '2025-09-26 14:38:01'),
(3, 1, 'erverv', 'erverveververveververveververveververveververvev', 'website', '[\"Express.js\"]', 'mid', 'intern', '2_months', 'within_1_month', 'office', '', 'flexible', 'team', '[\"İngilizce\"]', 'education', 'high', '', 'pending', NULL, NULL, NULL, '2025-09-28 22:12:13', '2025-09-28 22:12:40'),
(4, 1, 'denemedenemedenemedenemedenemedeneme', 'denemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedenemedeneme', '', '[\"Material UI\", \"Chakra UI\", \"Ionic\"]', 'intern', 'part_time', '', 'immediately', 'remote', 'balıkesir', 'night_shift', 'solo', '[\"Türkçe\"]', 'gaming', 'high', '20000', 'pending', NULL, NULL, NULL, '2025-09-28 23:00:24', '2025-09-28 23:00:24'),
(5, 1, 'başlık', 'dededededededededededededededededededededededededededededede', '', '[\"Ethereum\", \"OpenAI API\"]', 'mid', 'freelance', '', 'immediately', 'hybrid', 'şanlıurfa', 'night_shift', 'solo', '[\"İngilizce\", \"Türkçe\"]', '', 'normal', NULL, 'pending', NULL, NULL, NULL, '2025-09-28 23:22:56', '2025-09-28 23:22:56'),
(6, 1, 'başlık hüner sdfsdf', 'başlık hüner sdfsdfbaşlık hüner sdfsdfbaşlık hüner sdfsdfbaşlık hüner sdfsdfbaşlık hüner sdfsdf', '', '[\"Web3.js\", \"Solidity\", \"GraphQL\", \"Vue.js\", \"Astro\", \"Chakra UI\"]', 'mid', 'part_time', '', 'immediately', 'office', NULL, 'flexible', 'solo', '[\"Türkçe\", \"İngilizce\"]', 'education', 'high', '20.000', 'pending', NULL, NULL, NULL, '2025-09-29 19:32:56', '2025-09-29 19:32:56'),
(7, 1, 'selamlar', 'selamlarselamlarselamlarselamlarselamlar', '', '[\"Laravel\", \"NestJS\"]', 'mid', 'part_time', '', 'within_1_month', 'remote', NULL, 'night_shift', 'team', '[]', '', 'normal', '3000000', 'pending', NULL, NULL, NULL, '2025-09-29 20:00:56', '2025-09-29 20:00:56'),
(8, 1, 'selamlssssss', 'selamlssssssselamlssssssselamlssssssselamlssssssselamlssssss', '', '[\"Express.js\", \"Elixir\"]', 'junior', 'part_time', '', 'within_1_month', 'hybrid', NULL, 'flexible', '2_3_people', '[\"Türkçe\"]', '', 'normal', '15.00000', 'pending', NULL, NULL, NULL, '2025-09-29 20:02:00', '2025-09-29 20:02:00');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `employer_profiles`
--

DROP TABLE IF EXISTS `employer_profiles`;
CREATE TABLE IF NOT EXISTS `employer_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `companyName` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `industry` varchar(50) DEFAULT NULL,
  `companyWebsite` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `address` text,
  `age` int DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `employer_profiles`
--

INSERT INTO `employer_profiles` (`id`, `userId`, `fullName`, `companyName`, `position`, `industry`, `companyWebsite`, `phoneNumber`, `city`, `address`, `age`, `profileImage`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'Furkan Yılmaz', 'Yılmaz Nakliyat', 'Yönetici', 'E-ticaret', 'yilmaz.com', '+905457929406', 'İstanbul', 'lorem', 20, '1758658073594-3.png', '2025-09-23 20:07:00', '2025-09-23 20:07:53');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL COMMENT 'Etkinlik görseli URL''si',
  `eventDate` datetime NOT NULL,
  `location` varchar(255) NOT NULL,
  `organizer` varchar(255) NOT NULL,
  `status` enum('active','inactive','cancelled') DEFAULT 'active' COMMENT 'Etkinlik durumu: active, inactive, cancelled',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_event_date` (`eventDate`),
  KEY `events_status` (`status`),
  KEY `events_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employerId` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `media` text,
  `status` enum('pending','approved','assigned','in_progress','completed','cancelled') DEFAULT 'pending',
  `assignedTo` int DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `completedDate` datetime DEFAULT NULL,
  `notes` text,
  `progressNotes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employerId` (`employerId`),
  KEY `assignedTo` (`assignedTo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `jobs`
--

INSERT INTO `jobs` (`id`, `employerId`, `title`, `description`, `media`, `status`, `assignedTo`, `startDate`, `dueDate`, `completedDate`, `notes`, `progressNotes`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Proje Proje', 'Lorem İpsumLorem İpsumLorem İpsumLorem İpsumLorem İpsumLorem İpsum', '[\"1758658201032-job-new.png\"]', 'completed', NULL, NULL, NULL, '2025-09-29 20:22:27', NULL, NULL, '2025-09-23 20:10:01', '2025-09-29 20:22:27'),
(2, 1, 'xyx', 'xyx', '[\"1758897539407-job-new.png\"]', 'cancelled', 1, '2025-09-26 00:00:00', '2025-09-28 00:00:00', NULL, NULL, NULL, '2025-09-26 14:38:59', '2025-09-29 20:22:30');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `messagerecipients`
--

DROP TABLE IF EXISTS `messagerecipients`;
CREATE TABLE IF NOT EXISTS `messagerecipients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `messageId` int NOT NULL,
  `recipientId` int NOT NULL,
  `recipientType` enum('student','employer') NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `readAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `project_ideas`
--

DROP TABLE IF EXISTS `project_ideas`;
CREATE TABLE IF NOT EXISTS `project_ideas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('Web Development','Mobile Development','Artificial Intelligence','Game Development','Data Science','Cybersecurity','Cloud & DevOps','System Design') NOT NULL,
  `difficulty` enum('Kolay','Orta','Zor') NOT NULL DEFAULT 'Orta',
  `estimatedDays` int NOT NULL,
  `technologies` text COMMENT 'Virgülle ayrılmış teknoloji listesi',
  `resources` text COMMENT 'Kaynak linkler ve dökümanlar',
  `requirements` text COMMENT 'Ön gereksinimler ve bilgi düzeyi',
  `image` varchar(255) DEFAULT NULL COMMENT 'Proje görseli URL''si',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Proje durumu: active, inactive',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_ideas_category` (`category`),
  KEY `project_ideas_difficulty` (`difficulty`),
  KEY `project_ideas_status` (`status`),
  KEY `project_ideas_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Tablo döküm verisi `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250924074650-add-password-reset-fields.js'),
('20250924083750-add-phone-to-student-profiles.js'),
('add-password-reset-fields.js');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `student_profiles`
--

DROP TABLE IF EXISTS `student_profiles`;
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `school` varchar(100) DEFAULT NULL,
  `educationLevel` enum('lisans','yuksek_lisans','doktora','mezun') DEFAULT NULL,
  `currentGrade` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `languages` text,
  `linkedinProfile` varchar(255) DEFAULT NULL,
  `githubProfile` varchar(255) DEFAULT NULL,
  `studentDocument` varchar(255) DEFAULT NULL,
  `skills` text,
  `profileImage` varchar(255) DEFAULT NULL,
  `shortBio` varchar(280) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `student_profiles`
--

INSERT INTO `student_profiles` (`id`, `userId`, `fullName`, `age`, `city`, `school`, `educationLevel`, `currentGrade`, `department`, `languages`, `linkedinProfile`, `githubProfile`, `studentDocument`, `skills`, `profileImage`, `shortBio`, `createdAt`, `updatedAt`, `phoneNumber`) VALUES
(1, 1, 'Berat Pekşen', 23, 'İstanbul', 'İstanbul Topkapı Üniversitesi', 'lisans', '4', 'Yönetim Bilişim Sistemleri', '[{\"lang\":\"İngilizce\",\"level\":\"Başlangıç\"}]', 'https://www.linkedin.com/in/gökay-cengiz-258406337/', 'https://github.com/PXENNCOM/tia/blob/ma', NULL, 'Javascript,React,Node.js', '1756564285220-1.png', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five cent', '2025-08-30 14:29:36', '2025-08-30 14:32:08', NULL),
(7, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-26 14:53:26', '2025-09-26 14:53:26', NULL),
(8, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07 12:57:32', '2025-10-07 12:57:32', NULL),
(9, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-07 13:13:02', '2025-10-07 13:13:02', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `student_projects`
--

DROP TABLE IF EXISTS `student_projects`;
CREATE TABLE IF NOT EXISTS `student_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text,
  `technologies` text,
  `media` text,
  `githubUrl` varchar(255) DEFAULT NULL,
  `liveUrl` varchar(255) DEFAULT NULL,
  `projectType` enum('huner','personal','school','other') DEFAULT 'personal',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `student_projects`
--

INSERT INTO `student_projects` (`id`, `studentId`, `title`, `description`, `technologies`, `media`, `githubUrl`, `liveUrl`, `projectType`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'lorem', 'lorem', 'React, Mongo DB, Node.js', '[\"1758656213353-project-1.png\"]', 'https://github.com/PXENNCOM/tia/blob/main/src/components/Header/MobileHeader.jsx', 'https://www.linkedin.com/in/gökay-cengiz-258406337/', 'school', '2025-09-23 19:36:53', '2025-09-23 19:36:53'),
(2, 8, 'Yapay Zeka Destekli Yetkinlik Eşleştirme Platformu', 'SkillSync, geliştiricilerin teknik yetkinliklerini analiz eden ve şirketlerin aradığı proje gereksinimleriyle otomatik olarak eşleştiren bir yapay zeka platformudur. Kullanıcılar, GitHub profillerini veya CV’lerini yükleyerek becerilerinin güçlü yönlerini görebilir, şirketler ise en uygun adayları hızlıca bulabilir.', 'Next.js, Tailwind, Node.js, NestJS, GraphQL, OpenAI, FastAPI', NULL, 'https://github.com/PXENNCOM/tia/blob/main/src/components/Header/MobileHeader.jsx', '', 'school', '2025-10-07 13:11:10', '2025-10-07 13:11:56'),
(3, 9, 'Gerçek Zamanlı Etkinlik ve Katılım Yönetim Sistemi', 'EventPulse, organizatörlerin etkinlikleri kolayca yönetebildiği, katılımcıların ise anlık bildirimlerle etkinlik akışını takip edebildiği bir platformdur. Katılımcılar mobil uygulama üzerinden giriş yapabilir, anketlere katılabilir ve canlı oylamalara dahil olabilir. Organizasyon sahipleri de panel üzerinden gerçek zamanlı analizlerle geri bildirimleri görebilir.', 'Node,Socket.io,MongoDB,WebSocket', NULL, 'https://github.com/PXENNCOM/tia/blob/main/src/components/Header/MobileHeader.jsx', NULL, 'other', '2025-10-07 13:14:24', '2025-10-07 13:14:24');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `student_work_experiences`
--

DROP TABLE IF EXISTS `student_work_experiences`;
CREATE TABLE IF NOT EXISTS `student_work_experiences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `companyName` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `description` text,
  `startDate` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `isCurrent` tinyint(1) DEFAULT '0',
  `workType` enum('full-time','part-time','internship','freelance') DEFAULT 'internship',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `student_work_experiences`
--

INSERT INTO `student_work_experiences` (`id`, `studentId`, `companyName`, `position`, `description`, `startDate`, `endDate`, `isCurrent`, `workType`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Tech Şirketi A.Ş.', 'Frontend Developer Stajyeri', 'React ve JavaScript ile web uygulamaları geliştirdim. Takım çalışması yaparak kullanıcı arayüzleri tasarladım.', '2024-06-01 00:00:00', '2024-08-30 00:00:00', 0, 'internship', '2025-08-30 14:30:15', '2025-08-30 14:30:15'),
(3, 8, 'Tech A.Ş', 'Frontend Developer', NULL, '2025-09-04 00:00:00', '2025-10-15 00:00:00', 0, 'part-time', '2025-10-07 13:12:46', '2025-10-07 13:12:46'),
(4, 9, 'PXENNCOM', 'Devops', NULL, '2025-05-01 00:00:00', '2025-10-06 00:00:00', 0, 'part-time', '2025-10-07 13:14:47', '2025-10-07 13:14:47');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `userType` enum('student','employer','admin') DEFAULT 'student',
  `approvalStatus` enum('pending','approved','rejected') DEFAULT 'pending',
  `rejectionReason` text,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordCode` varchar(6) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `userType`, `approvalStatus`, `rejectionReason`, `isActive`, `createdAt`, `updatedAt`, `resetPasswordToken`, `resetPasswordCode`, `resetPasswordExpires`) VALUES
(1, 'pxenn@outlook.com', '$2b$10$PKV0sLO.faxXlJdSkQ2r8eQi41uOhKOw4/vz0DXG9/OFnA5z2WTty', 'admin', 'approved', NULL, 1, '2025-08-30 14:29:36', '2025-08-30 14:29:36', NULL, NULL, NULL),
(3, 'abdullahberatihl@outlook.com', '$2b$10$4qkgUfR/FQTsgwn3QGpmeetsesSZZhc2LAL3IXSImucGwgE5WVHam', 'employer', 'approved', NULL, 1, '2025-09-23 20:07:00', '2025-09-25 13:10:30', 'b1c1b2bddc8302da2a98755dafde84c1a4f4cac2ab153c7eb8a814f14a30aa46', '146216', '2025-09-25 13:20:30'),
(8, 'furkan@deneme.com', '$2b$10$LUEw6INxjAgzDj6VA1vzBOJk/tr7bxC6WZV5oVuPDo.3VatmTY.nu', 'student', 'approved', NULL, 1, '2025-10-07 11:31:40', '2025-10-07 12:57:17', NULL, NULL, NULL),
(9, 'selim@deneme.com', '$2b$10$jQGPgP7ZB8HAS./8tEJmo.SJ79EJDQGfvRE/Y8DWA/eRU2wHV5phK', 'student', 'approved', NULL, 1, '2025-10-07 11:32:18', '2025-10-07 12:57:18', NULL, NULL, NULL),
(10, 'hasan@deneme.com', '$2b$10$y.WxzZ6d/qejXy6PQ/EbweW9EB0UAva5BUW21pCpxqAd7wcyod0a.', 'student', 'approved', NULL, 1, '2025-10-07 12:56:20', '2025-10-07 12:57:18', NULL, NULL, NULL);

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `developer_requests`
--
ALTER TABLE `developer_requests`
  ADD CONSTRAINT `developer_requests_ibfk_1` FOREIGN KEY (`employerId`) REFERENCES `employer_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `employer_profiles`
--
ALTER TABLE `employer_profiles`
  ADD CONSTRAINT `employer_profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`employerId`) REFERENCES `employer_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`assignedTo`) REFERENCES `student_profiles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `messagerecipients`
--
ALTER TABLE `messagerecipients`
  ADD CONSTRAINT `messagerecipients_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `adminmessages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `student_profiles`
--
ALTER TABLE `student_profiles`
  ADD CONSTRAINT `student_profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `student_projects`
--
ALTER TABLE `student_projects`
  ADD CONSTRAINT `student_projects_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `student_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `student_work_experiences`
--
ALTER TABLE `student_work_experiences`
  ADD CONSTRAINT `student_work_experiences_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `student_profiles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
