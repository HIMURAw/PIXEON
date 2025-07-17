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

-- Discord Message Events Log
CREATE TABLE IF NOT EXISTS `discord_message_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` varchar(32) NOT NULL,
  `channel_id` varchar(32) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `action` enum('create','edit','delete','bulk_delete') NOT NULL,
  `attachments_count` int(11) DEFAULT 0,
  `mentions_count` int(11) DEFAULT 0,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`),
  KEY `channel_id` (`channel_id`),
  KEY `user_id` (`user_id`),
  KEY `action` (`action`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Voice Events Log
CREATE TABLE IF NOT EXISTS `discord_voice_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `channel_id` varchar(32) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `action` enum('join','leave','move','mute','unmute','deafen','undeafen','stream_start','stream_stop','video_start','video_stop') NOT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `channel_id` (`channel_id`),
  KEY `action` (`action`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Role Events Log
CREATE TABLE IF NOT EXISTS `discord_role_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `role_id` varchar(32) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `role_color` varchar(7) DEFAULT NULL,
  `action` enum('add','remove','update') NOT NULL,
  `moderator_id` varchar(32) DEFAULT NULL,
  `moderator_username` varchar(64) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  KEY `action` (`action`),
  KEY `moderator_id` (`moderator_id`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Channel Events Log
CREATE TABLE IF NOT EXISTS `discord_channel_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(32) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `channel_type` enum('text','voice','category','announcement','stage','forum') NOT NULL,
  `action` enum('create','delete','update','permission_change') NOT NULL,
  `old_name` varchar(255) DEFAULT NULL,
  `new_name` varchar(255) DEFAULT NULL,
  `moderator_id` varchar(32) DEFAULT NULL,
  `moderator_username` varchar(64) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `channel_id` (`channel_id`),
  KEY `action` (`action`),
  KEY `moderator_id` (`moderator_id`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Emoji Events Log
CREATE TABLE IF NOT EXISTS `discord_emoji_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emoji_id` varchar(32) NOT NULL,
  `emoji_name` varchar(255) NOT NULL,
  `emoji_url` text DEFAULT NULL,
  `action` enum('create','delete','update') NOT NULL,
  `moderator_id` varchar(32) DEFAULT NULL,
  `moderator_username` varchar(64) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `emoji_id` (`emoji_id`),
  KEY `action` (`action`),
  KEY `moderator_id` (`moderator_id`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Invite Events Log
CREATE TABLE IF NOT EXISTS `discord_invite_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invite_code` varchar(32) NOT NULL,
  `channel_id` varchar(32) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `creator_id` varchar(32) NOT NULL,
  `creator_username` varchar(64) NOT NULL,
  `action` enum('create','delete','update') NOT NULL,
  `max_uses` int(11) DEFAULT NULL,
  `max_age` int(11) DEFAULT NULL,
  `uses_count` int(11) DEFAULT 0,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `invite_code` (`invite_code`),
  KEY `channel_id` (`channel_id`),
  KEY `creator_id` (`creator_id`),
  KEY `action` (`action`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Server Settings Log
CREATE TABLE IF NOT EXISTS `discord_server_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_name` varchar(255) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `action` enum('update','reset') NOT NULL,
  `moderator_id` varchar(32) NOT NULL,
  `moderator_username` varchar(64) NOT NULL,
  `reason` text DEFAULT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `setting_name` (`setting_name`),
  KEY `action` (`action`),
  KEY `moderator_id` (`moderator_id`),
  KEY `event_time` (`event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Activity History Log
CREATE TABLE IF NOT EXISTS `discord_activity_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_type` enum('message','voice','role','channel','emoji','invite','member') NOT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `username` varchar(64) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `target_id` varchar(32) DEFAULT NULL,
  `target_name` varchar(255) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `details` json DEFAULT NULL,
  `channel_id` varchar(32) DEFAULT NULL,
  `channel_name` varchar(255) DEFAULT NULL,
  `moderator_id` varchar(32) DEFAULT NULL,
  `moderator_username` varchar(64) DEFAULT NULL,
  `duration_seconds` int(11) DEFAULT NULL,
  `event_time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `activity_type` (`activity_type`),
  KEY `user_id` (`user_id`),
  KEY `action` (`action`),
  KEY `channel_id` (`channel_id`),
  KEY `moderator_id` (`moderator_id`),
  KEY `event_time` (`event_time`),
  KEY `idx_activity_time_type` (`event_time`, `activity_type`),
  KEY `idx_user_activity` (`user_id`, `activity_type`, `event_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord Activity Statistics (Daily Aggregated)
CREATE TABLE IF NOT EXISTS `discord_activity_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `activity_type` enum('message','voice','role','channel','emoji','invite','member') NOT NULL,
  `total_count` int(11) NOT NULL DEFAULT 0,
  `unique_users` int(11) NOT NULL DEFAULT 0,
  `channel_id` varchar(32) DEFAULT NULL,
  `channel_name` varchar(255) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_daily_activity` (`date`, `activity_type`, `channel_id`, `action`),
  KEY `date` (`date`),
  KEY `activity_type` (`activity_type`),
  KEY `channel_id` (`channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Discord User Activity Summary
CREATE TABLE IF NOT EXISTS `discord_user_activity_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `total_messages` int(11) NOT NULL DEFAULT 0,
  `total_voice_time` int(11) NOT NULL DEFAULT 0,
  `total_voice_sessions` int(11) NOT NULL DEFAULT 0,
  `last_message_time` datetime DEFAULT NULL,
  `last_voice_time` datetime DEFAULT NULL,
  `first_seen` datetime NOT NULL DEFAULT current_timestamp(),
  `last_seen` datetime NOT NULL DEFAULT current_timestamp(),
  `activity_score` decimal(5,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `activity_score` (`activity_score`),
  KEY `last_seen` (`last_seen`),
  KEY `total_messages` (`total_messages`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- License Table
CREATE TABLE IF NOT EXISTS `licenses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `server_name` VARCHAR(255) NOT NULL,
  `server_ip` VARCHAR(64) NOT NULL,
  `added_by` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `server_ip` (`server_ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- License Logs Table
CREATE TABLE IF NOT EXISTS `license_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `request_ip` varchar(45) DEFAULT NULL,
  `status` enum('VALID','INVALID','ERROR') NOT NULL,
  `server_name` varchar(255) DEFAULT NULL,
  `license_id` int(11) DEFAULT NULL,
  `added_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `response_time` int(11) DEFAULT NULL COMMENT 'Response time in milliseconds',
  `error_message` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_license_id` (`license_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- License Statistics View
CREATE OR REPLACE VIEW `license_statistics` AS
SELECT 
    COUNT(*) as total_checks,
    SUM(CASE WHEN status = 'VALID' THEN 1 ELSE 0 END) as valid_checks,
    SUM(CASE WHEN status = 'INVALID' THEN 1 ELSE 0 END) as invalid_checks,
    SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as error_checks,
    AVG(response_time) as avg_response_time,
    MAX(created_at) as last_check
FROM license_logs;

-- Recent License Logs View (Last 24 Hours)
CREATE OR REPLACE VIEW `recent_license_logs` AS
SELECT 
    ip_address,
    host,
    status,
    server_name,
    created_at,
    response_time
FROM license_logs 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY created_at DESC;

-- Satın Alma Talepleri Tablosu
CREATE TABLE IF NOT EXISTS `discord_purchase_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `payment_method` varchar(32) DEFAULT NULL,
  `payment_info` text DEFAULT NULL,
  `status` enum('pending','approved','declined') NOT NULL DEFAULT 'pending',
  `admin_id` varchar(32) DEFAULT NULL,
  `admin_username` varchar(64) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Guard Sistemi Tablosu
CREATE TABLE IF NOT EXISTS `discord_guard_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `avatar_url` text DEFAULT NULL,
  `guard_level` enum('basic','moderator','admin','full') NOT NULL DEFAULT 'basic',
  `permissions` json DEFAULT NULL,
  `added_by` varchar(32) NOT NULL,
  `added_by_username` varchar(64) NOT NULL,
  `status` enum('active','inactive','banned') NOT NULL DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `guard_level` (`guard_level`),
  KEY `status` (`status`),
  KEY `added_by` (`added_by`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Guard İşlem Geçmişi Tablosu
CREATE TABLE IF NOT EXISTS `discord_guard_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `action` enum('add','remove','update','ban','unban') NOT NULL,
  `old_level` enum('basic','moderator','admin','full') DEFAULT NULL,
  `new_level` enum('basic','moderator','admin','full') DEFAULT NULL,
  `permissions_changed` json DEFAULT NULL,
  `moderator_id` varchar(32) NOT NULL,
  `moderator_username` varchar(64) NOT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `action` (`action`),
  KEY `moderator_id` (`moderator_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Guard Botu Olay Logları Tablosu
CREATE TABLE IF NOT EXISTS `discord_guard_action_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` varchar(64) NOT NULL,
  `action` varchar(32) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `username` varchar(64) NOT NULL,
  `target_id` varchar(64) DEFAULT NULL,
  `target_name` varchar(255) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_type` (`event_type`),
  KEY `user_id` (`user_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
