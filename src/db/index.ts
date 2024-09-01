import Database from "better-sqlite3";
import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import invariant from "invariant";
import * as schema from "./schema";

console.log({
	import: import.meta.env.DATABASE_URL,
	process: process.env.DATABASE_URL,
});

invariant(import.meta.env.DATABASE_URL, "DATABASE_URL is not set");

const sqlite = new Database(import.meta.env.DATABASE_URL, {
	fileMustExist: true,
});
export const db = drizzle(sqlite, { schema });
