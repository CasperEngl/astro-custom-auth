import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import invariant from "invariant";
import * as schema from "./schema";

invariant(process.env.DATABASE_URL, "DATABASE_URL is not set");

const sqlite = new Database(process.env.DATABASE_URL, {
	fileMustExist: true,
});
export const db = drizzle(sqlite, { schema });
