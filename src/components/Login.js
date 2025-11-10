import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import KarnatakaLogo from './KarnatakaLogo';
import { useI18n } from '../i18n/I18nProvider';
import { detectDevice } from '../utils/deviceDetection';
import MobileLogin from './MobileLogin';

const Login = () => {
  const device = detectDevice();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'auditor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [customLogo, setCustomLogo] = useState(null);
  const { t } = useI18n();
  
  const navigate = useNavigate();

  useEffect(() => {
    // Load custom logo from localStorage
    const savedLogo = localStorage.getItem('portalLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  // Demo users for authentication
  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
    { username: 'auditor1', password: 'audit123', role: 'auditor', name: 'Senior Auditor' },
    { username: 'officer1', password: 'officer123', role: 'officer', name: 'Welfare Officer' },
    { username: 'viewer1', password: 'view123', role: 'viewer', name: 'Report Viewer' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleLogin = (user) => {
    // Store user info in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString()
    }));
    // Notify app about authentication state change
    window.dispatchEvent(new CustomEvent('authChanged'));
    
    // Redirect to dashboard
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const user = demoUsers.find(
        u => u.username === formData.username && u.password === formData.password
      );

      if (user) {
        handleLogin(user);
      } else {
        setError(t('login.invalidCreds'));
      }
      setIsLoading(false);
    }, 1000);
  };

  const roles = [
    { value: 'admin', label: t('roles.admin.label'), description: t('roles.admin.description') },
    { value: 'auditor', label: t('roles.auditor.label'), description: t('roles.auditor.description') },
    { value: 'officer', label: t('roles.officer.label'), description: t('roles.officer.description') },
    { value: 'viewer', label: t('roles.viewer.label'), description: t('roles.viewer.description') }
  ];

  // Use mobile login for mobile devices
  if (device.isMobile) {
    return <MobileLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Portal Logo" 
                className="h-16 w-auto object-contain"
              />
            ) : (
              <KarnatakaLogo size="lg" />
            )}
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t('login.title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('login.subtitle')}</p>
          <p className="mt-1 text-xs text-gray-500">{t('login.helper')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="pl-10 input-field"
                  placeholder={t('login.placeholderUsername')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 input-field"
                  placeholder={t('login.placeholderPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.role')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                } transition-colors duration-200`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('login.signingIn')}
                  </div>
                ) : (
                  t('login.signIn')
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('login.demoCredentials')}</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Admin:</strong> admin / admin123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Auditor:</strong> auditor1 / audit123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Officer:</strong> officer1 / officer123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Viewer:</strong> viewer1 / view123
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">{t('login.footer')}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
