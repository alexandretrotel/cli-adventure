import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const players = sqliteTable("players", {
  id: text().primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull(),
  health: integer("health").default(100).notNull(),
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
});
