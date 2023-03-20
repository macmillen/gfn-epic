const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: "Inter",
    },
    extend: {
      colors: {
        primary: colors.green,
      },
    },
  },
  plugins: [],
};
