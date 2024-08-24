import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .default(sql`current_timestamp`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => sql`current_timestamp`),
});

export const sessions = sqliteTable("sessions", {
  sessionId: text("session_id", { length: 64 }).primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: text("created_at").default(sql`current_timestamp`),
  expiresAt: text("expires_at").default(sql`current_timestamp`),
});
