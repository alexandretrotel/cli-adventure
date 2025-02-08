import { Database } from "bun:sqlite";

const db = new Database("game.db");

db.run(`
    CREATE TABLE IF NOT EXISTS player (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        health INTEGER,
        inventory TEXT
    )
`);

export function savePlayer(name: string, health: number, inventory: string[]) {
  db.run("INSERT INTO player (name, health, inventory) VALUES (?, ?, ?)", [
    name,
    health,
    JSON.stringify(inventory),
  ]);
}

export function loadPlayer() {
  return db.query("SELECT * FROM player ORDER BY id DESC LIMIT 1").get();
}
