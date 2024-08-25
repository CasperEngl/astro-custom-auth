import type { SQL } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fullName: text("full_name")
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`${Users.firstName} || ' ' || ${Users.lastName}`
    ),
  createdAt: text("created_at")
    .default(sql`current_timestamp`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => sql`current_timestamp`),
});

export const Sessions = sqliteTable("sessions", {
  sessionId: text("session_id", { length: 64 }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id),
  createdAt: text("created_at").default(sql`current_timestamp`),
});

export const UsersRelations = relations(Users, ({ many }) => ({
  sessions: many(Sessions),
}));

export const SessionsRelations = relations(Sessions, ({ one }) => ({
  user: one(Users, {
    fields: [Sessions.userId],
    references: [Users.id],
  }),
}));
