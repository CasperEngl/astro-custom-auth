import type { APIContext } from "astro";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { verify } from "argon2";
import { createSession } from "../../db/session";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, email));

  if (user && (await verify(user.password, password))) {
    return new Response(null, {
      status: 200,
      headers: {
        "Set-Cookie": await createSession(user.id),
      },
    });
  }
}
