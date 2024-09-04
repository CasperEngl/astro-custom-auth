import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { Users } from "~/db/schema";

export const auth = {
	register: defineAction({
		input: z
			.object({
				firstName: z
					.string()
					.min(2, "First name must be at least 2 characters")
					.regex(
						/^[A-Za-z\s]+$/,
						"First name must contain only alphabetic characters and spaces",
					),
				lastName: z
					.string()
					.min(2, "Last name must be at least 2 characters")
					.regex(
						/^[A-Za-z\s]+$/,
						"Last name must contain only alphabetic characters and spaces",
					),
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
					.min(6, "Password must be at least 6 characters"),
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "Passwords must match",
				path: ["confirmPassword"],
			}),
		accept: "form",
		handler: async (input) => {
			const hashedPassword = await bcrypt.hash(input.password, 10);

			try {
				const [user] = await db
					.insert(Users)
					.values({
						email: input.email,
						password: hashedPassword,
						firstName: input.firstName,
						lastName: input.lastName,
					})
					.returning();

				if (!user) {
					throw new ActionError({
						code: "BAD_REQUEST",
						message: "User not found",
					});
				}

				return {
					userId: user.id,
				};
			} catch (error) {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
				});
			}
		},
	}),
	login: defineAction({
		input: z.object({
			email: z.string().email(),
			password: z.string().min(6, "Password must be at least 6 characters"),
		}),
		accept: "form",
		handler: async (input) => {
			const [user] = await db
				.select()
				.from(Users)
				.where(eq(Users.email, input.email));

			if (!user) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Invalid email or password",
				});
			}

			const passwordMatch = await bcrypt.compare(input.password, user.password);

			if (!passwordMatch) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "Invalid email or password",
				});
			}

			return {
				userId: user.id,
			};
		},
	}),
};
