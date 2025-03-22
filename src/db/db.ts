import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";
import "dotenv/config";

const client = createClient({ url: process.env.DATABASE_URL! });
export const db = drizzle({ client, schema });
