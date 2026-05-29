import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        deep: '#0A0A0F',
        surface: '#111118',
        card: '#16161F',
        'card-hover': '#1C1C28',
        gold: '#C9A84C',
        'gold-muted': 'rgba(201,168,76,0.15)',
        crimson: '#E94560',
        'text-pri': '#F5F3EE',
        'text-sec': '#8A8899',
        'text-muted': '#4A4860',
      },
    },
  },
  plugins: [],
};
export default config;
