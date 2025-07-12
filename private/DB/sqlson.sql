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

-- Dumping data for table fivemwebpanel.admins: ~1 rows (approximately)
INSERT INTO `admins` (`id`, `username`, `password`, `email`, `created_at`) VALUES
	(1, 'test', 'test123', 'test@example.com', '2025-06-15 13:25:38');

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

-- Dumping structure for table fivemwebpanel.product_feedback
CREATE TABLE IF NOT EXISTS `product_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `product_channel_id` varchar(255) NOT NULL,
  `product_channel_name` varchar(255) NOT NULL,
  `rating` int(1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_channel_id` (`product_channel_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table fivemwebpanel.products
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
