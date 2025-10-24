import { createContext } from 'react';
import type { AppSettings } from '../types/weather';

type TranslationKey = keyof typeof import('../types/weather').TRANSLATIONS.fr;

export interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  theme: 'light' | 'dark';
  t: (key: TranslationKey) => string;
  currentLanguage: string;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);