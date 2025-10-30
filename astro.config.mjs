// @ts-check
import { defineConfig } from 'astro/config';
import { astroI18nPlugin } from '@gudupao/astro-i18n';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
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
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  experimental: {
    clientPrerender: true
  },
  build: {
    inlineStylesheets: 'auto'
  }
});