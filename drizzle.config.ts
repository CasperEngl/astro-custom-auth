import { defineConfig } from "drizzle-kit";
import invariant from "invariant";

invariant(process.env.DATABASE_URL, "DATABASE_URL is required");

export default defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
