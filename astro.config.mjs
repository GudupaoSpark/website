// @ts-check
import { defineConfig } from 'astro/config';
import { astroI18nPlugin } from '@gudupao/astro-i18n';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gudupao.top',
  integrations: [astroI18nPlugin({
    localesDir: './locales',
    pathBasedRouting: true,
    fallbackLang: 'en',
    autoDetectLanguage: true,
  }), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor chunks for better caching
            if (id.includes('node_modules')) {
              if (id.includes('@gudupao/astro-i18n')) {
                return 'vendor-i18n';
              }
              return 'vendor';
            }
          },
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'entry/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        }
      }
    }
  },
  prefetch: {
    prefetchAll: false, // Disable automatic prefetch for better control
    defaultStrategy: 'tap'
  },
  experimental: {
    clientPrerender: true
  },
  build: {
    inlineStylesheets: 'auto'
  }
});