import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
        heading: ['"Montserrat Variable"', 'Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
