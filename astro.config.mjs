import image from "@astrojs/image";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    svelte(),
    image({ serviceEntryPoint: "@astrojs/image/sharp" }),
  ],
});
