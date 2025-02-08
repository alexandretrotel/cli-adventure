import { db } from "../db/db";
import { items, players } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export async function savePlayer(name: string, health: number) {
  await db.update(players).set({ health }).where(eq(players.name, name));
}

export async function createPlayer(name: string) {
  await db.insert(players).values({ name });
}

export async function loadPlayer() {
  return db.select().from(players).orderBy(desc(players.id)).limit(1);
}

export async function loadPlayerItems(playerId: string) {
  return db.select().from(items).where(eq(items.player_id, playerId));
}
