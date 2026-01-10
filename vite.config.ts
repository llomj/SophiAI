import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env files - Vite automatically loads .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd(), '');
  // Only use environment variable for local development - production requires user to set their own key
  const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || null;
  
  if (!apiKey && mode === 'development') {
    console.warn('\n⚠️  WARNING: GEMINI_API_KEY not found for local development! ⚠️');
    console.warn('For local development, create a .env.local file with:');
    console.warn('GEMINI_API_KEY=your_api_key_here\n');
    console.warn('For production: Users must set their own API key via the app interface.');
    console.warn('Get your API key from: https://aistudio.google.com/app/apikey\n');
  } else if (apiKey && mode === 'development') {
    console.log('✅ API Key loaded for local development');
  }
  
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
      // Use null for production - users must set their own API key
      // Only use env key for local development
      'process.env.API_KEY': apiKey ? JSON.stringify(apiKey) : 'null',
      'process.env.GEMINI_API_KEY': apiKey ? JSON.stringify(apiKey) : 'null'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
