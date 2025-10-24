import React from 'react';
import { motion } from 'framer-motion';
import type { WeatherData } from '../types/weather';
import { useApp } from '../context/useApp';
interface WeatherDetailsProps {
  weather: WeatherData;
  unit?: 'c' | 'f';
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather, unit = 'c' }) => {
  const { t } = useApp();
  const getFeelsLikeDisplay = () => {
    if (unit === 'c') {
      return `${Math.round(weather.current.feelslike_c)}°C`;
    } else {
      const feelsLikeF = (weather.current.feelslike_c * 9/5) + 32;
      return `${Math.round(feelsLikeF)}°F`;
    }
  };

  const details = [
    {
      label: t('wind'),
      value: `${weather.current.wind_kph} km/h`,
      icon: '💨',
      description: t('windDescription')
    },
    {
      label: t('humidity'),
      value: `${weather.current.humidity}%`,
      icon: '💧',
      description: t('humidityDescription')
    },
    {
      label: t('pressure'),
      value: `${weather.current.pressure_mb} hPa`,
      icon: '🌡️',
      description: t('pressureDescription')
    },
    {
      label: t('uv'),
      value: `${weather.current.uv}`,
      icon: '☀️',
      description: getUVDescription(weather.current.uv)
    },
    {
      label: t('visibility'),
      value: `${weather.current.vis_km} km`,
      icon: '👁️',
      description: t('visibilityDescription')
    },
    {
      label: t('feelsLike'),
      value: getFeelsLikeDisplay(),
      icon: '🤗',
      description: t('feelsLikeDescription')
    }
  ];

  function getUVDescription(uv: number): string {
    if (uv <= 2) return t('uvLow');
    if (uv <= 5) return t('uvModerate');
    if (uv <= 7) return t('uvHigh');
    if (uv <= 10) return t('uvVeryHigh');
    return t('uvExtreme');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
    >
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">{t('weatherDetails')}</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {details.map((detail, index) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center hover:bg-white/10 transition-all duration-200"
          >
            <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{detail.icon}</div>
            <div className="text-white/70 text-xs sm:text-sm mb-1">{detail.label}</div>
            <div className="text-white font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{detail.value}</div>
            <div className="text-white/50 text-xs hidden sm:block">{detail.description}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherDetails;