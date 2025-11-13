import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, BarChart3, LogOut, User, Store, TrendingUp, Settings } from 'lucide-react';
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
      <div className="bg-white shadow-lg border-b border-gray-200 h-14 sm:h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center h-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Logo and Title */}
          <div className="flex items-center min-w-0 flex-1">
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Portal Logo" 
                className="h-7 sm:h-8 w-auto mr-2 sm:mr-3 object-contain flex-shrink-0"
              />
            ) : (
              <KarnatakaLogo size="sm" className="mr-2 sm:mr-3 flex-shrink-0" />
            )}
            <div className="hidden sm:flex w-8 h-8 bg-gray-100 rounded-xl items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <span className="text-gray-700 font-bold text-xs sm:text-sm">{t('app.short')}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">{t('app.title')}</h1>
              <p className="text-gray-600 text-xs font-medium hidden sm:block">{t('app.subtitle')}</p>
            </div>
          </div>

          {/* Top Right - User Info & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              <button
                className={`px-2 py-1 rounded min-h-[32px] touch-manipulation ${lang === 'en' ? 'bg-white border border-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setLang('en')}
                aria-label="Switch to English"
              >EN</button>
              <span className="mx-1 text-gray-300">|</span>
              <button
                className={`px-2 py-1 rounded min-h-[32px] touch-manipulation ${lang === 'kn' ? 'bg-white border border-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
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
              className="hidden md:flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-200 touch-manipulation"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('nav.Logout')}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 active:text-gray-800 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="hidden md:flex fixed left-0 top-14 sm:top-16 bottom-0 w-64 bg-white border-r border-gray-200 shadow-lg z-40">
        <div className="flex flex-col w-full">
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px] ${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-800 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{t(`nav.${item.key}`)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        
        {/* Sidebar */}
        <div className={`fixed top-0 right-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
              <div className="flex items-center min-w-0 flex-1">
                {customLogo ? (
                  <img 
                    src={customLogo} 
                    alt="Portal Logo" 
                    className="h-8 w-auto mr-2 object-contain flex-shrink-0"
                  />
                ) : (
                  <KarnatakaLogo size="sm" className="mr-2 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-gray-800 truncate">{t('app.title')}</h2>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 active:text-gray-800 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation & Actions */}
            <div className="flex-1 px-3 py-4 space-y-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors duration-200 touch-manipulation min-h-[48px] ${
                        isActive(item.href)
                          ? 'bg-gray-100 text-gray-800'
                          : 'text-gray-600 active:bg-gray-50 active:text-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="flex-1">{t(`nav.${item.key}`)}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Language</span>
                <div className="flex items-center px-2 py-1 bg-white rounded-lg border border-gray-200 text-sm">
                  <button
                    className={`px-3 py-1.5 rounded min-h-[36px] touch-manipulation transition-colors ${
                      lang === 'en' 
                        ? 'bg-gray-100 border border-gray-200 text-gray-800 shadow-sm' 
                        : 'text-gray-600 active:text-gray-800'
                    }`}
                    onClick={() => setLang('en')}
                    aria-label="Switch to English"
                  >EN</button>
                  <span className="mx-1.5 text-gray-300">|</span>
                  <button
                    className={`px-3 py-1.5 rounded min-h-[36px] touch-manipulation transition-colors ${
                      lang === 'kn' 
                        ? 'bg-gray-100 border border-gray-200 text-gray-800 shadow-sm' 
                        : 'text-gray-600 active:text-gray-800'
                    }`}
                    onClick={() => setLang('kn')}
                    aria-label="Switch to Kannada"
                  >KN</button>
                </div>
              </div>
              
              {/* Mobile User Info */}
              <div className="flex items-center px-4 py-3 text-gray-600 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-sm min-w-0 flex-1">
                  <div className="font-medium text-gray-800 truncate">{currentUser?.name || currentUser?.username}</div>
                  <div className="text-xs text-gray-600 capitalize">{currentUser?.role}</div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-3.5 rounded-xl text-base font-medium text-gray-600 active:bg-red-50 active:text-red-600 transition-colors duration-200 touch-manipulation min-h-[48px] bg-gray-50"
              >
                <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="flex-1 text-left">{t('nav.Logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
