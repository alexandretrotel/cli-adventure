import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import * as schema from "./schema.js";
import "dotenv/config";

const client = new SQL(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });
