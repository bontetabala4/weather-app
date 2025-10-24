import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { useApp } from '../context/useApp';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { weather } = useWeather();
  const { t } = useApp();

  const menuItems = [
    { id: 'weather', label: t('weather'), icon: '🌤️' },
    { id: 'map', label: t('map'), icon: '🗺️' },
    { id: 'settings', label: t('settings'), icon: '⚙️' },
    { id: 'others', label: t('dashboard'), icon: '📊' },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:block w-64 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">{t('location')}</h2>
        {weather ? (
          <div className="text-white/80">
            <p className="font-semibold">{weather.location.name}</p>
            <p className="text-sm">{weather.location.country}</p>
          </div>
        ) : (
          <p className="text-white/60 text-sm">{t('loading')}</p>
        )}
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="text-center text-white/60 text-sm">
          <p>{t('realTimeWeather')}</p>
          <p className="mt-1">{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;