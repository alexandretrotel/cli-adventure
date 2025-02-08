import * as schema from "./schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const client = new Database(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });
