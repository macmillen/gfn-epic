import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte(), sitemap()],
  site: "https://gfn-epic.com",
  adapter: vercel(),
  image: {
    remotePatterns: [{ protocol: "https" }],
    service: { entrypoint: "astro/assets/services/sharp" },
  },
});
