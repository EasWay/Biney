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
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['motion', 'motion/react'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Target modern browsers — smaller, faster output (no legacy polyfills)
      target: ['es2020', 'chrome90', 'firefox90', 'safari14'],
      // esbuild is faster than terser and produces comparable output
      minify: 'esbuild',
      // Split CSS per chunk — mobile only loads CSS for routes it visits
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            // Spline — heaviest dep (~1MB+). Isolated so desktop-only users
            // don't bust cache when app code changes.
            if (id.includes('@splinetool')) return 'vendor-spline';

            // Motion / Framer — animation engine, stable between releases
            if (id.includes('motion')) return 'vendor-motion';

            // Icons — large and perfectly stable
            if (id.includes('lucide-react')) return 'vendor-lucide';

            // Markdown renderer — only used in chatbot
            if (
              id.includes('react-markdown') ||
              id.includes('remark') ||
              id.includes('rehype') ||
              id.includes('micromark') ||
              id.includes('mdast')
            ) return 'vendor-markdown';

            // Globe + dotted map — only on About/Contact
            if (id.includes('cobe') || id.includes('svg-dotted-map')) return 'vendor-viz';

            // Lottie — only used in loading screen
            if (id.includes('lottie')) return 'vendor-lottie';

            // Do NOT manually chunk react/react-dom/react-router —
            // let Rollup resolve the shared dep graph automatically.
          },
        },
      },
      chunkSizeWarningLimit: 1500,
    },
  };
});
