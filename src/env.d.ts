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
    _flashMessages: Record<"success" | "error", Record<string, string[]>>;
    flash: (type: "success" | "error", key: string, messages: string[]) => void;
    getFlashes: (type: "success" | "error") => Record<string, string[]>;
    getFlash: (type: "success" | "error", key: string) => string[] | null;
    old: Record<string, FormDataEntryValue>;
  }
}
