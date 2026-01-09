import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/SophiAI/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'inline',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'SophiAI - Offline Philosophical Companion',
          short_name: 'SophiAI',
          description: 'Minimal Text-Only Philosophical Terminal optimized for local environments.',
          theme_color: '#05060b',
          background_color: '#05060b',
          start_url: '/SophiAI/index.html',
          scope: '/SophiAI/',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
          navigateFallback: '/SophiAI/index.html',
          navigateFallbackAllowlist: [/^\/SophiAI\//, /^\/SophiAI$/],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdn\./,
              handler: 'CacheFirst',
              options: {
                cacheName: 'cdn-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
