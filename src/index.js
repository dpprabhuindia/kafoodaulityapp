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
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('[SW] Service worker registered:', registration);
        
        // Check for updates immediately
        registration.update();
        
        // Check for updates on page focus (when user returns to tab)
        window.addEventListener('focus', () => {
          registration.update();
        });
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            console.log('[SW] New service worker found, installing...');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed and ready
                console.log('[SW] New service worker installed and ready');
                
                // Notify user about update
                if (window.confirm('A new version of the app is available. Reload to update?')) {
                  // User wants to update - unregister old worker and reload
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              } else if (newWorker.state === 'activated') {
                // Service worker activated - reload to use new version
                console.log('[SW] Service worker activated');
                if (navigator.serviceWorker.controller) {
                  window.location.reload();
                }
              }
            });
          }
        });
        
        // Listen for controller change (when new service worker takes control)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[SW] Controller changed, reloading page...');
          window.location.reload();
        });
        
        // Periodic update check (every hour)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.error('[SW] Service worker registration failed:', registrationError);
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