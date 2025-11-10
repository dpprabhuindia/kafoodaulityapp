import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Smartphone } from 'lucide-react';
import KarnatakaLogo from './KarnatakaLogo';
import { useI18n } from '../i18n/I18nProvider';
import { detectDevice, getDeviceStyles, triggerHaptic } from '../utils/deviceDetection';

const MobileLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [customLogo, setCustomLogo] = useState(null);
  const { t } = useI18n();
  const device = detectDevice();
  const styles = getDeviceStyles();

  useEffect(() => {
    const savedLogo = localStorage.getItem('portalLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerHaptic('light');
    
    const users = [
      { username: 'inspector', password: 'inspector123', name: 'Food Safety Inspector', role: 'inspector' },
      { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
      { username: 'officer', password: 'officer123', name: 'Safety Officer', role: 'officer' }
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      triggerHaptic('success');
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('authChanged'));
      onLogin(user);
    } else {
      triggerHaptic('error');
      setError(t('login.invalidCredentials'));
    }
  };

  // iOS-specific styles
  if (device.isIOS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            {customLogo ? (
              <img src={customLogo} alt="Portal Logo" className="h-16 w-auto mx-auto mb-4" />
            ) : (
              <KarnatakaLogo size="lg" className="mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('app.title')}</h1>
            <p className="text-sm text-gray-600">{t('app.subtitle')}</p>
            <div className="flex items-center justify-center mt-2 text-xs text-blue-600">
              <Smartphone className="w-3 h-3 mr-1" />
              <span>iOS Optimized</span>
            </div>
          </div>

          {/* Login Card - iOS Style */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">{t('login.title')}</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input - iOS Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.username')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base"
                    placeholder={t('login.usernamePlaceholder')}
                    required
                  />
                </div>
              </div>

              {/* Password Input - iOS Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base"
                    placeholder={t('login.passwordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setShowPassword(!showPassword);
                    }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button - iOS Style */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold text-base shadow-lg active:scale-95 transition-transform"
                onClick={() => triggerHaptic('light')}
              >
                {t('login.signIn')}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <p className="text-xs font-medium text-blue-900 mb-2">{t('login.demoCredentials')}</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>👤 inspector / inspector123</p>
                <p>🔐 admin / admin123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2024 Karnataka Government. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Android Material Design Style
  if (device.isAndroid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-6">
            {customLogo ? (
              <img src={customLogo} alt="Portal Logo" className="h-14 w-auto mx-auto mb-3" />
            ) : (
              <KarnatakaLogo size="lg" className="mx-auto mb-3" />
            )}
            <h1 className="text-xl font-bold text-gray-900 mb-1">{t('app.title')}</h1>
            <p className="text-sm text-gray-600">{t('app.subtitle')}</p>
            <div className="flex items-center justify-center mt-2 text-xs text-green-600">
              <Smartphone className="w-3 h-3 mr-1" />
              <span>Android Optimized</span>
            </div>
          </div>

          {/* Login Card - Material Design */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">{t('login.title')}</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input - Material Design */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('login.username')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-colors text-base"
                    placeholder={t('login.usernamePlaceholder')}
                    required
                  />
                </div>
              </div>

              {/* Password Input - Material Design */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-colors text-base"
                    placeholder={t('login.passwordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setShowPassword(!showPassword);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button - Material Design */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-base shadow-md active:shadow-lg transition-shadow uppercase tracking-wide"
                onClick={() => triggerHaptic('light')}
              >
                {t('login.signIn')}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-900 mb-2">{t('login.demoCredentials')}</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>👤 inspector / inspector123</p>
                <p>🔐 admin / admin123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-4">
            © 2024 Karnataka Government
          </p>
        </div>
      </div>
    );
  }

  // Fallback to default (shouldn't reach here in mobile context)
  return null;
};

export default MobileLogin;
