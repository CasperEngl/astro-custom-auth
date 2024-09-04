import type { ErrorInferenceObject } from "astro/actions/runtime/utils.js";
import { isInputError, type ActionError } from "astro:actions";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getInputErrors<TInput extends ErrorInferenceObject>(
	error?: ActionError<TInput> | null,
) {
	return error && isInputError(error) ? error.fields : null;
}
