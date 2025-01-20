import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/requirements/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      spacing: {
        '1/7': '14.2857143%',
        '1/8': '12.5%',
      },
    },
  },
  plugins: [],
} satisfies Config;
