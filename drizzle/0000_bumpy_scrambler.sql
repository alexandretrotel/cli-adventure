CREATE TABLE `items` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`player_id` text NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	`name` text NOT NULL,
	`health` integer DEFAULT 100 NOT NULL
);
