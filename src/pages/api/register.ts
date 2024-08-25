import { hash } from "argon2";
import type { APIContext } from "astro";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/db";
import { Users } from "~/db/schema";

const formSchema = z
  .object({
    email: z
      .string()
      .email()
      .refine(async (email) => {
        const [user] = await db
          .select({ id: Users.id })
          .from(Users)
          .where(eq(Users.email, email));

        return !user;
      }, "Email already exists"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ZodObjectSchema = z.ZodObject<
  Record<string, z.ZodTypeAny>,
  z.UnknownKeysParam
>;

async function validate<T>(
  context: APIContext,
  schema: z.ZodSchema<T>,
  data: unknown
) {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    for (const error of result.error.errors) {
      const errorField = error.path[0];
      if (typeof errorField === "string") {
        context.locals.flash("error", errorField, [error.message]);

        console.log("flashed", errorField, error.message);
      }
    }
  }

  return result;
}

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const result = await validate(context, formSchema, {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
  });

  if (result.success) {
    const hashedPassword = await hash(result.data.password);

    try {
      await db
        .insert(Users)
        .values({
          email: result.data.email,
          password: hashedPassword,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
        })
        .returning();
    } catch (error) {
      return new Response("Something went wrong", {
        status: 500,
      });
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: "/login",
      },
    });
  }

  console.log("flashed errors before redirect", context.locals._flashMessages);

  return new Response(null, {
    status: 307,
    headers: {
      Location: "/register",
    },
  });
}
