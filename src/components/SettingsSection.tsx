import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/useApp';
import { LANGUAGES } from '../types/weather';

const SettingsSection: React.FC = () => {
  const { settings, updateSettings, t } = useApp();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    updateSettings({ theme: newTheme });
  };

  const handleUnitChange = (unit: 'c' | 'f') => {
    updateSettings({ unit });
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">⚙️ {t('settings')}</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">🌍 {t('language')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  settings.language === lang.code 
                    ? 'bg-white/20 border-white text-white' 
                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                }`}
              >
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm opacity-80">{lang.nativeName}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">🎨 {t('theme')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings.theme === 'light' 
                  ? 'bg-white/20 border-white text-white' 
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
              }`}
            >
              <div className="text-2xl mb-2">🌞</div>
              <div className="font-semibold">Clair</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings.theme === 'dark' 
                  ? 'bg-white/20 border-white text-white' 
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
              }`}
            >
              <div className="text-2xl mb-2">🌙</div>
              <div className="font-semibold">Sombre</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeChange('auto')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                settings.theme === 'auto' 
                  ? 'bg-white/20 border-white text-white' 
                  : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
              }`}
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-semibold">Auto</div>
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">🌡️ {t('units')}</h3>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUnitChange('c')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                settings.unit === 'c' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              °C Celsius
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUnitChange('f')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                settings.unit === 'f' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              °F Fahrenheit
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">🔔 {t('notifications')}</h3>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
            <div>
              <div className="font-semibold text-white">Alertes météo</div>
              <div className="text-white/60 text-sm">Recevoir les alertes météo importantes</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateSettings({ notifications: !settings.notifications })}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                settings.notifications ? 'bg-green-500' : 'bg-gray-500'
              }`}
            >
              <motion.div
                animate={{ x: settings.notifications ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">📍 Localisation</h3>
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
            <div>
              <div className="font-semibold text-white">Accès à la localisation</div>
              <div className="text-white/60 text-sm">Utiliser ma position actuelle</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => updateSettings({ locationAccess: !settings.locationAccess })}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                settings.locationAccess ? 'bg-green-500' : 'bg-gray-500'
              }`}
            >
              <motion.div
                animate={{ x: settings.locationAccess ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsSection;