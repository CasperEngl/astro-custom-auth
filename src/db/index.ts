import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";
import invariant from "invariant";

invariant(process.env.DATABASE_URL, "DATABASE_URL is not set");

const sqlite = new Database(process.env.DATABASE_URL, {
	create: true,
});
export const db = drizzle(sqlite, {
	schema,
});
