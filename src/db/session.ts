import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import cookie from "cookie";
import { db } from ".";
import { sessions } from "./schema";
import ms from "ms";

function createSessionId() {
  return randomBytes(16).toString("hex");
}

export async function createSession(userId: number) {
  const sessionId = createSessionId();

  // Store the session in the database
  const [row] = await db
    .insert(sessions)
    .values({
      sessionId,
      userId,
    })
    .returning({ expiresAt: sessions.expiresAt });

  // Return the session cookie
  return cookie.serialize("session", sessionId, {
    httpOnly: true,
    secure: import.meta.env.NODE_ENV === "production",
    maxAge: row.expiresAt ? Number.parseInt(row.expiresAt) : ms("1 day"),
    path: "/",
  });
}

export async function getSession(sessionId: string) {
  const rows = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(eq(sessions.sessionId, sessionId));

  return rows.at(0)?.userId;
}

export async function destroySession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.sessionId, sessionId));
}
