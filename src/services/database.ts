import { db } from "../db/db.js";
import { chatHistory, items, players } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

export async function createPlayer(name: string) {
  const player = await db.insert(players).values({ name }).returning();
  return player?.[0];
}

export async function savePlayer(name: string, health: number) {
  await db.update(players).set({ health }).where(eq(players.name, name));
}

export async function loadPlayer() {
  const player = await db
    .select()
    .from(players)
    .orderBy(desc(players.id))
    .limit(1);
  return player?.[0];
}

export async function loadPlayerItems(playerId: string) {
  const playerItems = await db
    .select()
    .from(items)
    .where(eq(items.player_id, playerId));
  return playerItems;
}

export async function saveChatHistory(
  playerId: string,
  role: string,
  content: string,
) {
  await db.insert(chatHistory).values({
    player_id: playerId,
    role,
    content,
    created_at: Date.now(),
  });
}

export async function loadChatHistory(playerId: string) {
  return db
    .select()
    .from(chatHistory)
    .where(eq(chatHistory.player_id, playerId))
    .orderBy(desc(chatHistory.created_at));
}

export async function lastPlayer() {
  const player = await db
    .select()
    .from(players)
    .orderBy(desc(players.created_at))
    .limit(1);
  return player?.[0];
}

export async function loadPlayerLanguage(playerId: string) {
  const player = await db
    .select()
    .from(players)
    .where(eq(players.id, playerId));
  return player?.[0]?.language;
}

export async function savePlayerLanguage(playerId: string, language: string) {
  await db.update(players).set({ language }).where(eq(players.id, playerId));
}
