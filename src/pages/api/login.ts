import { verify } from "argon2";
import type { APIContext } from "astro";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { Users } from "~/db/schema";
import { createSession } from "~/db/session";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const [user] = await db.select().from(Users).where(eq(Users.email, email));

  if (!user) {
    return new Response("Invalid email or password", { status: 400 });
  }

  const passwordMatch = await verify(user.password, password);

  if (!passwordMatch) {
    return new Response("Invalid email or password", { status: 400 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": await createSession(user.id),
      "Location": "/",
    },
  });
}
