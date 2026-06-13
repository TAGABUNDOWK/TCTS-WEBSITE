import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-lora)", "Georgia", "serif"],
        body: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
