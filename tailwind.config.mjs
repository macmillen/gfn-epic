const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: "Inter Variable",
    },
    extend: {
      colors: {
        primary: colors.green,
      },
    },
  },
  plugins: [],
};
