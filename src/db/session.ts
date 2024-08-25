import cookie from "cookie";
import { eq } from "drizzle-orm";
import ms from "ms";
import { randomBytes } from "node:crypto";
import { db } from ".";
import { Sessions } from "./schema";
import type { APIContext } from "astro";

function createSessionId() {
	return randomBytes(16).toString("hex");
}

export async function createSession(context: APIContext, userId: number) {
	const sessionId = createSessionId();

	// Store the session in the database
	db.insert(Sessions)
		.values({
			sessionId,
			userId,
		})
		.run();

	context.cookies.set("session", sessionId, {
		httpOnly: true,
		secure: import.meta.env.NODE_ENV === "production",
		maxAge: ms("1 day") / 1000,
		path: "/",
	});
}

export async function getSession(request: Request) {
	const parsedCookie = cookie.parse(request.headers.get("cookie") ?? "");

	if (!parsedCookie.session) {
		return null;
	}

	const [session] = await db
		.select()
		.from(Sessions)
		.where(eq(Sessions.sessionId, parsedCookie.session));

	return session;
}

export async function destroySession(request: Request) {
	const session = await getSession(request);

	if (!session) {
		throw new Error("No session found");
	}

	await db.delete(Sessions).where(eq(Sessions.sessionId, session.sessionId));

	return cookie.serialize("session", "", {
		httpOnly: true,
		secure: import.meta.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/",
	});
}
