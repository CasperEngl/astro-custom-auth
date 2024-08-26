import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import simpleStackQuery from "simple-stack-query";

// https://astro.build/config
export default defineConfig({
	adapter: node({
		mode: "standalone",
	}),
	output: "server",
	integrations: [
		simpleStackForm(),
		simpleStackQuery(),
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
	],
});
