import { Database } from "bun:sqlite";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import invariant from "invariant";
import * as schema from "./schema";

invariant(
	process.env.DATABASE_URL || import.meta.env.DATABASE_URL,
	"DATABASE_URL is not set",
);

const sqlite = new Database(
	process.env.DATABASE_URL || import.meta.env.DATABASE_URL,
	{
		create: true,
	},
);
export const db = drizzle(sqlite, {
	schema,
});
