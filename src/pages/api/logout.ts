import type { APIContext } from "astro";
import cookie from "cookie";
import { destroySession } from "~/db/session";

export async function POST(context: APIContext) {
  const { session } = cookie.parse(context.request.headers.get("Cookie") ?? "");

  if (!session) {
    return new Response("No sessionId found", { status: 400 });
  }

  return new Response(null, {
    status: 303,
    headers: {
      "Set-Cookie": await destroySession(context.request),
      "Location": "/",
    },
  });
}
