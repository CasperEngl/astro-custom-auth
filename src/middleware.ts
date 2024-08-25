import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import { eq } from "drizzle-orm";
import invariant from "invariant";
import { db } from "~/db";
import { Users } from "~/db/schema";
import { getSession } from "~/db/session";
import { serialize, parse } from "cookie";

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

async function flashMessages(context: APIContext, next: MiddlewareNext) {
  const cookies = parse(context.request.headers.get("cookie") || "");
  const flashCookie = cookies._flashMessages;
  context.locals._flashMessages = flashCookie
    ? JSON.parse(flashCookie)
    : { success: {}, error: {} };

  context.locals.flash = (type, key, messages) => {
    context.locals._flashMessages[type][key] = messages;
  };

  context.locals.getFlashes = (type) => {
    const flashes = context.locals._flashMessages;
    const flashesByType = structuredClone(flashes[type]);

    for (const key in flashesByType) {
      delete flashes[type][key];
    }

    return flashesByType;
  };

  context.locals.getFlash = (type, key) => {
    let messages: string[] | null = null;

    if (context.locals._flashMessages[type]?.[key]) {
      messages = context.locals._flashMessages[type][key];
      delete context.locals._flashMessages[type][key];
    }

    return messages;
  };

  const response = await next();

  const flashCookieValue = serialize(
    "_flashMessages",
    JSON.stringify(context.locals._flashMessages),
    {
      path: "/",
      httpOnly: true,
    }
  );

  response.headers.set("Set-Cookie", flashCookieValue);

  return response;
}

async function old(context: APIContext, next: MiddlewareNext) {
  if (context.request.method !== "POST") {
    return next();
  }

  const clone = structuredClone(context.request);
  console.log("clone", clone);

  const formData = await clone.formData();
  const data = Object.fromEntries(formData.entries());

  if (!context.locals.old) {
    context.locals.old = {};
  }

  for (const key in data) {
    const isSensitive = ["password", "key"].some((sensitive) =>
      key.toLowerCase().includes(sensitive)
    );

    if (data[key] && !isSensitive) {
      context.locals.old[key] = data[key];
    }
  }

  return next();
}

export const onRequest = sequence(flashMessages, old, currentUser);
