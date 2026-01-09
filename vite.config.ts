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
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            name: 'SophiAI - Offline Philosophical Companion',
            short_name: 'SophiAI',
            description: 'Minimal Text-Only Philosophical Terminal optimized for local environments.',
            theme_color: '#05060b',
            icons: [
              {
                src: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
                sizes: '512x512',
                type: 'image/png'
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
