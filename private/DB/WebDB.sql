-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.9.0.6999
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for fivemwebpanel
CREATE DATABASE IF NOT EXISTS `fivemwebpanel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `fivemwebpanel`;

-- Dumping structure for table fivemwebpanel.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table fivemwebpanel.admins: ~0 rows (approximately)

-- Dumping structure for table fivemwebpanel.discord_member_log
CREATE TABLE IF NOT EXISTS `discord_member_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `action` enum('join','leave') NOT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table fivemwebpanel.discord_member_log: ~2 rows (approximately)
INSERT INTO `discord_member_log` (`id`, `user_id`, `username`, `avatar_url`, `action`, `event_time`) VALUES
	(1, '1287138822450315277', 'qbcore_1_42186', 'https://cdn.discordapp.com/embed/avatars/5.png', 'join', '2025-07-13 21:50:40'),
	(2, '1287138822450315277', 'qbcore_1_42186', 'https://cdn.discordapp.com/embed/avatars/5.png', 'leave', '2025-07-13 21:50:54'),
	(3, '1287138822450315277', 'qbcore_1_42186', 'https://cdn.discordapp.com/embed/avatars/5.png', 'join', '2025-07-13 22:04:13');

-- Dumping structure for table fivemwebpanel.discord_products
CREATE TABLE IF NOT EXISTS `discord_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(255) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `price_tl` decimal(10,2) NOT NULL,
  `price_usd` decimal(10,2) NOT NULL,
  `price_eur` decimal(10,2) NOT NULL,
  `photo_url` text NOT NULL,
  `details` text DEFAULT NULL,
  `added_by` varchar(255) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `channel_id` (`channel_id`),
  KEY `added_by` (`added_by`),
  KEY `added_at` (`added_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table fivemwebpanel.discord_products: ~1 rows (approximately)
INSERT INTO `discord_products` (`id`, `channel_id`, `channel_name`, `product_title`, `price_tl`, `price_usd`, `price_eur`, `photo_url`, `details`, `added_by`, `added_at`) VALUES
	(3, '1391502323167002784', '🔵・fivem-bot', 'BU BOT FIVEM SUNUCULARINA ÖZEL TASARLANMIŞTIR', 300.00, 7.47, 6.39, 'https://cdn.discordapp.com/attachments/1392478452636192838/1394020122456490225/image.png?ex=687549e8&is=6873f868&hm=933167c78c7f874b0c4aaf647054cc121b47dcf98d436d99001af81e6c54f0fe&', 'Bu botun içinde ticket bot, yönetim botu ve guard botu bulunmaktadır.', '768372430631731210', '2025-07-13 18:20:42');

-- Dumping structure for table fivemwebpanel.discord_users
CREATE TABLE IF NOT EXISTS `discord_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`roles`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `discord_id` (`discord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table fivemwebpanel.discord_users: ~1 rows (approximately)
INSERT INTO `discord_users` (`id`, `discord_id`, `username`, `avatar`, `email`, `roles`, `created_at`, `updated_at`) VALUES
	(49, '768372430631731210', 'himura_1#0', '596ed6c513a68d7d30dfbb1d452e2462', 'zamtos79@gmail.com', '["1292164764868411392","1392601717555855490","1283479982345158659","1269431123965116456","1292241645085130793","1270200641842577422","1283221241720864851","1269431118667710516","1269431114456633527","1270511842543927479","1273294014321266780","1269431116499128414"]', '2025-07-12 16:47:46', '2025-07-13 13:17:38');

-- Dumping structure for table fivemwebpanel.product_feedback
CREATE TABLE IF NOT EXISTS `product_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `product_channel_id` varchar(255) NOT NULL,
  `product_channel_name` varchar(255) NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_channel_id` (`product_channel_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table fivemwebpanel.product_feedback: ~5 rows (approximately)
INSERT INTO `product_feedback` (`id`, `user_id`, `username`, `product_channel_id`, `product_channel_name`, `rating`, `message`, `created_at`) VALUES
	(1, '768372430631731210', 'himura_1', '1391502379912007777', '⚫・ticket-bot', 5, 'test', '2025-07-12 10:19:29'),
	(2, '768372430631731210', 'himura_1', '1392454600828649543', '🔵・development-bot', 1, 'test', '2025-07-12 19:40:31'),
	(3, '768372430631731210', 'himura_1', '1391502405753114729', '🔵・public-bot', 5, 'test', '2025-07-12 21:35:40'),
	(4, '768372430631731210', 'himura_1', '1391502405753114729', '🔵・public-bot', 4, 'Deneme', '2025-07-12 23:39:14'),
	(5, '508537867597905923', 'salih0723_', '1391502405753114729', '🔵・public-bot', 4, 'lezzet', '2025-07-12 23:46:19');

-- Dumping structure for table fivemwebpanel.user_history
CREATE TABLE IF NOT EXISTS `user_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `action` enum('warn','kick','ban','unban') NOT NULL,
  `reason` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `moderator_id` varchar(255) NOT NULL,
  `moderator_username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table fivemwebpanel.user_history: ~11 rows (approximately)
INSERT INTO `user_history` (`id`, `user_id`, `username`, `action`, `reason`, `timestamp`, `moderator_id`, `moderator_username`) VALUES
	(1, '1274420802615382086', 'regular2x', 'kick', 'dwad', '2025-06-17 23:05:30', '768372430631731210', 'himura_1'),
	(2, '1309627108875698219', 'roro0131310seif', 'kick', 'dwadw', '2025-06-17 23:05:42', '768372430631731210', 'himura_1'),
	(3, '1269730389250019399', 'iremw_1', 'ban', 'xa<x', '2025-06-17 23:06:50', '768372430631731210', 'himura_1'),
	(4, '1269729386702180501', 'c8c9e403d4b', 'ban', 'dwad', '2025-06-17 23:08:24', '768372430631731210', 'himura_1'),
	(5, '1269727982902181940', '5111c45a2002', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:41:11', '768372430631731210', 'himura_1'),
	(6, '1061301619054096556', 'perrocuk', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:58:57', '768372430631731210', 'himura_1'),
	(7, '1269730389250019399', 'iremw_1', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:58:59', '768372430631731210', 'himura_1'),
	(8, '1292788339786907648', 'sigende48518', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:59:00', '768372430631731210', 'himura_1'),
	(9, '1329518754941370464', 'zortdsapodkoa', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:59:02', '768372430631731210', 'himura_1'),
	(10, '1309627108875698219', 'roro0131310seif', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:59:03', '768372430631731210', 'himura_1'),
	(11, '1274422892402053313', 'regular5x', 'unban', 'Sebep belirtilmedi', '2025-06-17 23:59:05', '768372430631731210', 'himura_1');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
