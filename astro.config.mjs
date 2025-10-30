// @ts-check
import { defineConfig } from 'astro/config';
import { astroI18nPlugin } from '@gudupao/astro-i18n';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroI18nPlugin({
      localesDir: './locales',
      pathBasedRouting: true,
      fallbackLang: 'en',
      autoDetectLanguage: true,
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  prefetch: false,
  experimental: {
    clientPrerender: true
  },
  output: 'static'
});