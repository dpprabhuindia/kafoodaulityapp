import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle app installation prompt
// Note: We don't preventDefault here - let InstallPWA component handle it
// This allows the browser's default banner to show if our custom prompt isn't used
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show install button or notification
  console.log('App can be installed');
  
  // Dispatch a custom event that InstallPWA component can listen to
  // The component will handle preventDefault() when it's ready to show custom UI
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: deferredPrompt }));
});

// Track successful installation
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed');
  deferredPrompt = null;
});