/// <reference path="../.astro/types.d.ts" />

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
