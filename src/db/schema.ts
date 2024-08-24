import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email", { length: 50 }).notNull().unique(),
  password: text("password", { length: 255 }).notNull(),
});
