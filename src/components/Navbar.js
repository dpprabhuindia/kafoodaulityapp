import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FileText, Users, BarChart3, FileBarChart, LogOut, User, Store, ShieldCheck, TrendingUp, Settings } from 'lucide-react';
import KarnatakaLogo from './KarnatakaLogo';
import { useI18n } from '../i18n/I18nProvider';

const Navbar = ({ currentUser, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customLogo, setCustomLogo] = useState(null);
  const location = useLocation();
  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    // Load custom logo from localStorage
    const savedLogo = localStorage.getItem('portalLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }

    // Listen for logo updates
    const handleStorageChange = (e) => {
      if (e.key === 'portalLogo') {
        setCustomLogo(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const baseNavigation = [
    { key: 'Dashboard', href: '/', icon: BarChart3 },
    { key: 'NewInspection', href: '/audit', icon: FileText },
    { key: 'Schools', href: '/establishments', icon: Store },
    { key: 'Reports', href: '/reports', icon: TrendingUp },
    { key: 'Profile', href: '/profile', icon: User },
  ];

  // Add admin panel for admin users
  const navigation = currentUser?.role === 'admin' 
    ? [...baseNavigation, { key: 'AdminPanel', href: '/admin', icon: Settings }]
    : baseNavigation;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-white shadow-lg border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center h-full px-4 sm:px-6 lg:px-8">
          {/* Logo and Title */}
          <div className="flex items-center">
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Portal Logo" 
                className="h-8 w-auto mr-3 object-contain"
              />
            ) : (
              <KarnatakaLogo size="sm" className="mr-3" />
            )}
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-gray-700 font-bold text-sm">{t('app.short')}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{t('app.title')}</h1>
              <p className="text-gray-600 text-xs font-medium">{t('app.subtitle')}</p>
            </div>
          </div>

          {/* Top Right - User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              <button
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-white border border-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setLang('en')}
                aria-label="Switch to English"
              >EN</button>
              <span className="mx-1 text-gray-300">|</span>
              <button
                className={`px-2 py-1 rounded ${lang === 'kn' ? 'bg-white border border-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setLang('kn')}
                aria-label="Switch to Kannada"
              >KN</button>
            </div>
            <div className="hidden md:flex items-center px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-800">{currentUser?.name || currentUser?.username}</div>
                <div className="text-xs text-gray-600 capitalize">{currentUser?.role}</div>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="hidden md:flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('nav.Logout')}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 shadow-lg z-40">
        <div className="flex flex-col w-full">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-800 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-800'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {t(`nav.${item.key}`)}
                  </Link>
                );
              })}
              
              {/* Mobile User Info */}
              <div className="flex items-center px-4 py-3 text-gray-600 border-t border-gray-200 mt-4 pt-4">
                <User className="w-5 h-5 mr-3" />
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{currentUser?.name || currentUser?.username}</div>
                  <div className="text-xs text-gray-600 capitalize">{currentUser?.role}</div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {t('nav.Logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
