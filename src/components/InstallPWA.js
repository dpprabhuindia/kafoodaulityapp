import React, { useState, useEffect } from 'react';
import { Download, X, Share2, Copy } from 'lucide-react';

// Detect iOS device
const isIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

// Detect if running in Chrome on iOS
const isChromeOnIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && /crios|chrome/.test(userAgent);
};

// Detect if running in Safari on iOS
const isSafariOnIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && !/crios|chrome|fxios|edgios/.test(userAgent);
};

// Detect if already installed (standalone mode)
const isInstalled = () => {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  // Check if navigator.standalone exists (iOS specific)
  if (window.navigator.standalone) {
    return true;
  }
  return false;
};

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isChromeIOS, setIsChromeIOS] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const ios = isIOS();
    const chromeIOS = isChromeOnIOS();
    setIsIOSDevice(ios);
    setIsChromeIOS(chromeIOS);

    // Check if app is already installed
    if (isInstalled()) {
      setShowInstallButton(false);
      return;
    }

    // Check if user dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowInstallButton(false);
        return;
      }
    }

    // For iOS, show install prompt after a delay (user has been on site for a bit)
    if (ios) {
      // Only show if not in standalone mode
      if (!window.navigator.standalone) {
        // Show iOS install prompt after 3 seconds
        const timer = setTimeout(() => {
          setShowInstallButton(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
      return;
    }

    // For Android/Chrome: Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Also listen to custom event from index.js
    const handlePWAInstallable = (e) => {
      setDeferredPrompt(e.detail);
      setShowInstallButton(true);
    };

    window.addEventListener('pwa-installable', handlePWAInstallable);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-installable', handlePWAInstallable);
    };
  }, []);

  const handleInstallClick = async () => {
    // For Chrome on iOS, show instructions with URL to copy
    if (isChromeIOS) {
      setShowIOSInstructions(true);
      return;
    }

    // For iOS Safari, show instructions instead of triggering install
    if (isIOSDevice) {
      setShowIOSInstructions(true);
      return;
    }

    // For Android/Chrome: Show the install prompt
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    setShowIOSInstructions(false);
    setUrlCopied(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 3000);
    }
  };

  if (!showInstallButton) {
    return null;
  }

  // iOS-specific install instructions
  if (isIOSDevice && showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Install Food Portal App
            </h3>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {isChromeIOS ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ You're using Chrome on iOS
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    To install this app, please open it in Safari browser first.
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-700 mb-2">
                    <strong>Step 1:</strong> Copy this page URL:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={window.location.href}
                      className="flex-1 text-xs px-2 py-1.5 bg-white border border-gray-300 rounded text-gray-700"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                        urlCopied
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {urlCopied ? (
                        <>
                          <span className="mr-1">✓</span> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="inline mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Step 2:</strong> Open Safari and paste the URL, then follow these steps:
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                To install this app on your iOS device:
              </p>
            )}
            
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 text-base">1.</span>
                <span>Tap the <strong className="text-gray-900">Share</strong> button (square with arrow pointing up) at the bottom of Safari</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 text-base">2.</span>
                <span>Scroll down in the share menu and tap <strong className="text-blue-600">"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 text-base">3.</span>
                <span>Tap <strong className="text-blue-600">"Add"</strong> in the top right corner to confirm</span>
              </li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-blue-800">
                <strong>Tip:</strong> The app will appear on your home screen and work like a native app with offline access.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Android/Chrome install prompt
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install Food Portal App
            </h3>
            <p className="text-xs text-gray-600">
              {isChromeIOS 
                ? "⚠️ To install this app, please open it in Safari browser. PWA installation is only available in Safari on iOS."
                : isIOSDevice
                ? "Install our app for a better experience with offline access and faster loading."
                : "Install our app for a better experience with offline access and faster loading."
              }
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            {isChromeIOS ? (
              <>
                <Share2 size={16} />
                Open in Safari
              </>
            ) : isIOSDevice ? (
              <>
                <Share2 size={16} />
                Show Instructions
              </>
            ) : (
              <>
                <Download size={16} />
                Install App
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-md transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;

