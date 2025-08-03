-- Create users table with all required columns
CREATE TABLE IF NOT EXISTS `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `discord_id` varchar(255) NOT NULL,
    `username` varchar(255),
    `email` varchar(255),
    `avatar` varchar(255),
    `roles` text,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_discord_id_unique` (`discord_id`)
); 