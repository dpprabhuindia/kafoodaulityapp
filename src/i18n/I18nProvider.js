import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

function get(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    // Update document lang attribute for accessibility
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = (next) => {
    setLangState(next);
  };

  const t = useMemo(() => {
    return (key, params = {}) => {
      const locale = translations[lang] || translations.en;
      let val = get(locale, key);
      if (val === undefined) {
        // fallback to English
        val = get(translations.en, key);
      }
      if (val === undefined) return key;
      
      // Support interpolation: replace {key} with params[key]
      if (typeof val === 'string' && Object.keys(params).length > 0) {
        return val.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? params[paramKey] : match;
        });
      }
      
      return val;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
