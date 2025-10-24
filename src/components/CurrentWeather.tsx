import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/useApp';
import type { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  weatherData: WeatherData | null;
  unit: 'c' | 'f';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, unit }) => {
  const { t } = useApp();

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('soleil') || lowerCondition.includes('ensoleillé') || lowerCondition.includes('clair')) {
      return '☀️';
    } else if (lowerCondition.includes('nuage')) {
      return '☁️';
    } else if (lowerCondition.includes('pluie')) {
      return '🌧️';
    } else if (lowerCondition.includes('neige')) {
      return '❄️';
    } else if (lowerCondition.includes('orage')) {
      return '⛈️';
    } else if (lowerCondition.includes('brume') || lowerCondition.includes('brouillard')) {
      return '🌫️';
    } else if (lowerCondition.includes('partiellement')) {
      return '⛅';
    } else if (lowerCondition.includes('vent')) {
      return '💨';
    } else {
      return '🌈';
    }
  };

  if (!weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="text-center text-white/70">
          <p>{t('noWeatherData')}</p>
        </div>
      </motion.div>
    );
  }

  const { current, location } = weatherData;
  const temperature = unit === 'c' ? current.temp_c : current.temp_f;
  const feelsLike = unit === 'c' ? current.feelslike_c : current.feelslike_c;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          📍 {location.name}, {location.country}
        </h2>
        <p className="text-white/70">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-2">
            {Math.round(temperature)}°{unit.toUpperCase()}
          </div>
          <div className="text-white/70">
            {t('feelsLike')} {Math.round(feelsLike)}°{unit.toUpperCase()}
          </div>
          <div className="text-white/80 text-lg mt-2">
            {current.condition.text}
          </div>
        </div>
        
        <div className="text-8xl">
          {getWeatherIcon(current.condition.text)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <div className="text-white/70 text-sm">{t('humidity')}</div>
          <div className="text-white font-semibold">{current.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-white/70 text-sm">{t('wind')}</div>
          <div className="text-white font-semibold">{current.wind_kph} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-white/70 text-sm">{t('pressure')}</div>
          <div className="text-white font-semibold">{current.pressure_mb} hPa</div>
        </div>
        <div className="text-center">
          <div className="text-white/70 text-sm">{t('visibility')}</div>
          <div className="text-white font-semibold">{current.vis_km} km</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;