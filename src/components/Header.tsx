import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/useApp';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { t } = useApp();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-between lg:justify-center">
        <button
          onClick={onMenuToggle}
          className="lg:hidden bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-3 transition-all duration-200 border border-white/20"
        >
          <span className="text-white text-2xl">☰</span>
        </button>

        <div className="text-center flex-1 lg:flex-none">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">🌤️ {t('weatherApp')}</h1>
          <p className="text-lg opacity-90">{t('realTimeForecasts')}</p>
        </div>

        <div className="w-12 lg:hidden"></div>
      </div>
    </motion.header>
  );
};

export default Header;