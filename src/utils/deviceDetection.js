// Device detection utility for mobile-optimized UI

export const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Detect Android
  const isAndroid = /android/i.test(userAgent);
  
  // Detect mobile (any)
  const isMobile = isIOS || isAndroid || /Mobile|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Detect tablet
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop'
  };
};

export const getDeviceStyles = () => {
  const device = detectDevice();
  
  if (device.isIOS) {
    return {
      // iOS-specific styles
      inputClass: 'rounded-xl border-2 focus:border-blue-500 transition-all',
      buttonClass: 'rounded-xl shadow-sm active:scale-95 transition-transform',
      cardClass: 'rounded-2xl shadow-lg backdrop-blur-sm',
      headerClass: 'sticky top-0 backdrop-blur-md bg-white/90',
      bottomNav: true,
      hapticFeedback: true
    };
  } else if (device.isAndroid) {
    return {
      // Android Material Design styles
      inputClass: 'rounded-lg border focus:border-blue-600 transition-colors',
      buttonClass: 'rounded-lg shadow-md active:shadow-lg transition-shadow',
      cardClass: 'rounded-lg shadow-md',
      headerClass: 'sticky top-0 bg-white shadow-sm',
      bottomNav: true,
      hapticFeedback: false
    };
  } else {
    return {
      // Desktop styles
      inputClass: 'rounded-lg border focus:ring-2 focus:ring-blue-500',
      buttonClass: 'rounded-lg hover:shadow-lg transition-all',
      cardClass: 'rounded-xl shadow-lg',
      headerClass: 'sticky top-0 bg-white shadow',
      bottomNav: false,
      hapticFeedback: false
    };
  }
};

export const triggerHaptic = (type = 'light') => {
  const device = detectDevice();
  
  if (device.isIOS && window.navigator.vibrate) {
    // iOS haptic patterns
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      error: [20, 100, 20]
    };
    window.navigator.vibrate(patterns[type] || patterns.light);
  } else if (device.isAndroid && window.navigator.vibrate) {
    // Android vibration patterns
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [20, 100, 20]
    };
    window.navigator.vibrate(patterns[type] || patterns.light);
  }
};
