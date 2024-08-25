import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import { eq } from "drizzle-orm";
import invariant from "invariant";
import { db } from "~/db";
import { Users } from "~/db/schema";
import { getSession } from "~/db/session";

async function currentUser(context: APIContext, next: MiddlewareNext) {
	const session = await getSession(context.request);

	if (session) {
		const [user] = await db
			.select({
				id: Users.id,
				email: Users.email,
				firstName: Users.firstName,
				lastName: Users.lastName,
				fullName: Users.fullName,
			})
			.from(Users)
			.where(eq(Users.id, session?.userId));

		invariant(user, "User not found");

		context.locals.currentUser = user;
	}

	return next();
}

export const onRequest = sequence(currentUser);
