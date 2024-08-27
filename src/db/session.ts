import Headers from "@mjackson/headers";
import { eq } from "drizzle-orm";
import ms from "ms";
import { randomBytes } from "node:crypto";
import { db } from ".";
import { Sessions } from "./schema";

function createSessionId() {
	return randomBytes(16).toString("hex");
}

export async function createSession(userId: number) {
	const sessionId = createSessionId();

	// Store the session in the database
	db.insert(Sessions)
		.values({
			sessionId,
			userId,
		})
		.run();

	const headers = new Headers({
		setCookie: [
			{
				name: "sessionId",
				value: sessionId,
				httpOnly: true,
				secure: import.meta.env.NODE_ENV === "production" || undefined,
				maxAge: ms("1 day") / 1000,
				path: "/",
			},
		],
	});

	return headers.getSetCookie();
}

export async function getSession(request: Request) {
	const headers = new Headers(request.headers);
	const sessionId = headers.cookie.get("sessionId");

	if (!sessionId) {
		return null;
	}

	const [session] = await db
		.select()
		.from(Sessions)
		.where(eq(Sessions.sessionId, sessionId));

	return session;
}

export async function destroySession(request: Request) {
	const session = await getSession(request);

	if (!session) {
		throw new Error("No session found");
	}

	await db.delete(Sessions).where(eq(Sessions.sessionId, session.sessionId));

	const headers = new Headers({
		setCookie: [
			{
				name: "sessionId",
				value: "deleted",
				httpOnly: true,
				secure: import.meta.env.NODE_ENV === "production" || undefined,
				expires: new Date(0),
				path: "/",
			},
		],
	});
	return headers.getSetCookie();
}
