/// <reference path="../.astro/types.d.ts" />
/// <reference types="simple-stack-form/types" />

declare namespace App {
	interface Locals {
		currentUser?: {
			id: number;
			email: string;
			firstName: string;
			lastName: string;
			fullName: string;
		};
	}
}
