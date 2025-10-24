import React from 'react';
import { motion } from 'framer-motion';
import type { WeatherData, ForecastData } from '../types/weather';
import WeatherIcon from './WeatherIcon';

interface WeatherCardProps {
  weather: WeatherData;
  forecast?: ForecastData | null;
  unit: 'c' | 'f';
  onToggleUnit: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weather, 
  forecast, 
  unit, 
  onToggleUnit 
}) => {
  const temp = unit === 'c' ? weather.current.temp_c : weather.current.temp_f;
  const feelsLike = unit === 'c' ? weather.current.feelslike_c : weather.current.feelslike_c;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{weather.location.name}</h2>
          <p className="text-white/80">{weather.location.country}</p>
          <p className="text-sm text-white/60">
            {new Date(weather.location.localtime).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        
        <button
          onClick={onToggleUnit}
          className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2 text-sm font-medium text-white"
        >
          °{unit.toUpperCase()}
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <WeatherIcon condition={weather.current.condition.text} size={64} />
          <div className="ml-4">
            <div className="text-5xl font-bold text-white">{Math.round(temp)}°</div>
            <div className="text-white/80">{weather.current.condition.text}</div>
            <div className="text-sm text-white/60">
              Ressenti {Math.round(feelsLike)}°
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm text-white/70">Vent</div>
          <div className="font-semibold text-white">{weather.current.wind_kph} km/h</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm text-white/70">Humidité</div>
          <div className="font-semibold text-white">{weather.current.humidity}%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm text-white/70">Pression</div>
          <div className="font-semibold text-white">{weather.current.pressure_mb} hPa</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-sm text-white/70">UV</div>
          <div className="font-semibold text-white">{weather.current.uv}</div>
        </div>
      </div>

      {forecast && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-white">Prévisions sur 5 jours</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.forecast.forecastday.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-3 text-center"
              >
                <div className="text-sm font-medium text-white">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <WeatherIcon condition={day.day.condition.text} size={32} className="mx-auto my-2" />
                <div className="flex justify-center space-x-2">
                  <span className="font-semibold text-white">{Math.round(day.day.maxtemp_c)}°</span>
                  <span className="text-white/60">{Math.round(day.day.mintemp_c)}°</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;