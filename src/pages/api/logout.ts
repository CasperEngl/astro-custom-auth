import type { APIContext } from "astro";
import { destroySession, getSession } from "~/db/session";

export async function POST(context: APIContext) {
	const session = await getSession(context.request);

	if (!session) {
		return context.rewrite("/login");
	}

	const cookies = await destroySession(context.request);

	const response = context.redirect("/");

	response.headers.set("Set-Cookie", cookies.join("; "));

	return response;
}
