CREATE DATABASE IF NOT EXISTS fivemwebpanel;

USE fivemwebpanel;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email) 
VALUES ('test', 'test123', 'test@example.com');

CREATE TABLE user_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    action ENUM('warn', 'kick', 'ban', 'unban') NOT NULL,
    reason TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    moderator_id VARCHAR(255) NOT NULL,
    moderator_username VARCHAR(255) NOT NULL
);