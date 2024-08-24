import { hash } from "argon2";
import type { APIContext } from "astro";
import { db } from "~/db";
import { users } from "~/db/schema";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const hashedPassword = await hash(password);

  await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
    })
    .returning();

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/login",
    },
  });
}
