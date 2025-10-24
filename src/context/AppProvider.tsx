import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppSettings } from '../types/weather';
import { TRANSLATIONS } from '../types/weather';
import { AppContext, type AppContextType } from './AppContext';

type TranslationKey = keyof typeof TRANSLATIONS.fr;

const defaultSettings: AppSettings = {
  theme: 'auto',
  unit: 'c',
  notifications: true,
  locationAccess: true,
  language: 'fr',
  refreshInterval: 30
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('weather-app-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const t = (key: TranslationKey): string => {
    const language = settings.language as keyof typeof TRANSLATIONS;
    const translations = TRANSLATIONS[language];
    
    if (translations && key in translations) {
      return (translations as Record<string, string>)[key];
    }
    
    const frenchTranslations = TRANSLATIONS.fr;
    if (key in frenchTranslations) {
      return (frenchTranslations as Record<string, string>)[key];
    }
    
    return key;
  };

  useEffect(() => {
    if (settings.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    } else {
      setTheme(settings.theme);
    }

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.lang = settings.language;
  }, [settings.theme, theme, settings.language]);

  useEffect(() => {
    localStorage.setItem('weather-app-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value: AppContextType = {
    settings,
    updateSettings,
    theme,
    t,
    currentLanguage: settings.language
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};