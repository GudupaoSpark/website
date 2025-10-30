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
    plugins: [tailwindcss()],
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