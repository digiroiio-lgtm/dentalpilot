import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pipeline: {
          first: "#DBEAFE",
          waiting: "#FEF3C7",
          price: "#F3E8FF",
          positive: "#DCFCE7",
          deal: "#E0E7FF",
          lost: "#FEE2E2"
        }
      }
    }
  },
  plugins: []
};

export default config;
