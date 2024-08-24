CREATE TABLE `sessions` (
	`session_id` text(64) PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` text DEFAULT current_timestamp,
	`expires_at` text DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT current_timestamp NOT NULL,
	`updated_at` text DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);