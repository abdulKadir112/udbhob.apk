import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/pushNotification';

// Auto-register service worker on startup so lock-screen notifications and calls work immediately
if (typeof window !== 'undefined') {
  registerServiceWorker().catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
