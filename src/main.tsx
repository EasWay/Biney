import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker only in production.
// In dev mode the SW intercepts Vite's HMR WebSocket + fetch requests,
// causing "Failed to fetch" errors and breaking hot-reload entirely.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <App />,
);
