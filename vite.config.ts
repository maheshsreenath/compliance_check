import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Plugin to map GEMINI_API_KEY to VITE_GEMINI_API_KEY for compatibility
function mapGeminiApiKey(): Plugin {
  return {
    name: 'map-gemini-api-key',
    config(config, { mode }) {
      const env = loadEnv(mode, '.', '');
      // If GEMINI_API_KEY is set but VITE_GEMINI_API_KEY is not, map it
      if (env.GEMINI_API_KEY && !env.VITE_GEMINI_API_KEY) {
        process.env.VITE_GEMINI_API_KEY = env.GEMINI_API_KEY;
      }
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Support both GEMINI_API_KEY and VITE_GEMINI_API_KEY for flexibility
    const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        mapGeminiApiKey(),
        react()
      ],
      define: {
        // Map process.env to work in browser (for backward compatibility)
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
