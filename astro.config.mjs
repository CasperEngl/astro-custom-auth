import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import simpleStackQuery from "simple-stack-query";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
		simpleStackForm(),
		simpleStackQuery(),
	],
});
