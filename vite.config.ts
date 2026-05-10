import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      // Force every package (including motion's pre-bundled chunk) to use
      // the exact same React module instance. Without this, Vite can produce
      // two copies of React's internals — breaking hook calls with the
      // "Invalid hook call / useContext null" error.
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      // Pre-bundle motion/react in the same pass as React so they share
      // ReactCurrentDispatcher. If motion is pre-bundled separately it picks
      // up its own module-instance reference and hooks stop working.
      include: ['motion', 'motion/react'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            // Spline is the heaviest dep (~1 MB+). Isolate it so users who
            // visited before don't re-download it when only app code changes.
            if (id.includes('@splinetool')) return 'vendor-spline';

            // Icons are large and perfectly stable between releases.
            if (id.includes('lucide-react')) return 'vendor-lucide';

            // Markdown renderer — only used in the chatbot.
            if (
              id.includes('react-markdown') ||
              id.includes('remark') ||
              id.includes('rehype') ||
              id.includes('micromark') ||
              id.includes('mdast')
            )
              return 'vendor-markdown';

            // Globe + dotted map — only rendered on About / Contact.
            if (id.includes('cobe') || id.includes('svg-dotted-map'))
              return 'vendor-viz';

            // IMPORTANT: Do NOT manually chunk react / react-dom / motion /
            // react-router here. Let Rollup resolve the shared dependency graph
            // automatically. Manually splitting these causes subtle module-
            // instance mismatches that break React hooks in production.
          },
        },
      },
      chunkSizeWarningLimit: 1500,
    },
  };
});
