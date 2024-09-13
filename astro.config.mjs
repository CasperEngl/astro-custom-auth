import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import simpleStackQuery from "simple-stack-query";

// https://astro.build/config
export default defineConfig({
	adapter: node({
		mode: "standalone",
	}),
	output: "server",
	integrations: [
		simpleStackQuery(),
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
	],
	server: {
		host: process.env.HOST,
		port: Number.parseInt(process.env.PORT) || 4321,
	},
});
