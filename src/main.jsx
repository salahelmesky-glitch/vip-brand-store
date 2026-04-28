import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

/* ═══════════════════════════════════════════════════
   Register Service Worker for PWA
   ═══════════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('⚡ VIP SW registered:', reg.scope);
        // Auto-update check every 30 minutes
        setInterval(() => reg.update(), 30 * 60 * 1000);
      })
      .catch((err) => {
        console.log('SW registration failed:', err);
      });
  });
}
