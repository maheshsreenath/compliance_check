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
    // Load env vars - Vite automatically exposes VITE_* prefixed vars
    // But we also support GEMINI_API_KEY for convenience
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
        // Note: import.meta.env.VITE_GEMINI_API_KEY is automatically handled by Vite
        // if the env var is named VITE_GEMINI_API_KEY in Vercel
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
