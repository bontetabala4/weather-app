import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { useApp } from '../context/useApp';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange 
}) => {
  const { weather } = useWeather();
  const { t } = useApp();

  const menuItems = [
    { id: 'weather', label: t('weather'), icon: '🌤️' },
    { id: 'map', label: t('map'), icon: '🗺️' },
    { id: 'settings', label: t('settings'), icon: '⚙️' },
    { id: 'others', label: t('dashboard'), icon: '📊' },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 from-blue-600 to-blue-700 backdrop-blur-xl z-50 lg:hidden border-r border-white/20 shadow-2xl"
          >

            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{t('navigation')}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-white text-2xl">✕</span>
                </button>
              </div>

              <div className="text-white/80">
                <h3 className="font-semibold mb-2">{t('currentLocation')}</h3>
                {weather ? (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold text-white">{weather.location.name}</p>
                    <p className="text-sm">{weather.location.country}</p>
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">{t('loading')}</p>
                  </div>
                )}
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-lg">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20">
              <div className="text-center text-white/60 text-sm">
                <p>{t('realTimeWeather')}</p>
                <p className="mt-1">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HamburgerMenu;