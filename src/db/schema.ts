import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
  id: text().primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  health: integer("health").default(100).notNull(),
  language: text("language"),
  created_at: integer("created_at").default(0).notNull(),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  player_id: text("player_id")
    .references(() => players.id, {
      onDelete: "cascade",
    })
    .notNull(),
  created_at: integer("created_at").default(0).notNull(),
});

export const chatHistory = sqliteTable("chat_history", {
  id: integer("id").primaryKey(),
  player_id: text("player_id")
    .references(() => players.id, {
      onDelete: "cascade",
    })
    .notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  created_at: integer("created_at").default(0).notNull(),
});
