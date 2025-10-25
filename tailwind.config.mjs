/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        surface: {
          light: '#f8fafc',
          dark: '#1e293b',
        },
        text: {
          primary: {
            light: '#111827',
            dark: '#f1f5f9',
          },
          secondary: {
            light: '#4b5563',
            dark: '#cbd5e1',
          },
        },
      },
    },
  },
  plugins: [],
}