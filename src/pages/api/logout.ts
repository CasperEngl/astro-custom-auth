import type { APIContext } from "astro";
import { destroySession, getSession } from "~/db/session";

export async function POST(context: APIContext) {
	const session = await getSession(context.request);

	if (!session) {
		return context.rewrite("/login");
	}

	context.request.headers.set("Cookie", await destroySession(context.request));

	return context.redirect("/");
}
