import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/pushNotification';
import { isNativeApp } from './utils/nativeCall';

// Auto-register service worker only on Web PWA, skip inside native Android APK
if (typeof window !== 'undefined' && !isNativeApp()) {
  registerServiceWorker().catch(() => {});
}

// Window unhandled error catcher to prevent blank screen crash
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.warn('Global error caught:', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Global unhandled rejection:', event.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
