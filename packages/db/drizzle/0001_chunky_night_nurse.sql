ALTER TABLE `users` ADD CONSTRAINT `users_discord_id_unique` UNIQUE(`discord_id`);--> statement-breakpoint
ALTER TABLE `users` ADD `discord_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `roles` text;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;