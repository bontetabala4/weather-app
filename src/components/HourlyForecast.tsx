import React from 'react';
import { motion } from 'framer-motion';
import type { ForecastData, HourlyForecast as HourlyForecastType } from '../types/weather';
import { useApp } from '../context/useApp';

interface HourlyForecastProps {
  forecast: ForecastData;
  unit: 'c' | 'f';
}

interface ExtendedHourlyForecast extends HourlyForecastType {
  date: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, unit }) => {
  const { t } = useApp();
  const getNext5Hours = (): ExtendedHourlyForecast[] => {
    const now = new Date();
    const currentTime = now.getTime();
    
    const allHours: ExtendedHourlyForecast[] = [];
    forecast.forecast.forecastday.forEach(day => {
      day.hour.forEach(hour => {
        allHours.push({
          ...hour,
          date: day.date
        });
      });
    });

    const futureHours = allHours.filter(hour => {
      const hourTime = new Date(hour.time).getTime();
      return hourTime > currentTime;
    });
    
    return futureHours.slice(0, 5);
  };

  const next5Hours = getNext5Hours();

  const getWeatherIcon = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('soleil') || lowerCondition.includes('ensoleillé') || lowerCondition.includes('clair')) {
      return '☀️';
    } else if (lowerCondition.includes('nuage') || lowerCondition.includes('couvert')) {
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
    } else {
      return '🌈';
    }
  };

  const formatHour = (timeString: string, date: string): string => {
    const hourDate = new Date(timeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const hour = hourDate.getHours();
    const displayHour = hour === 0 ? '00h' : `${hour}h`;
    if (date !== today.toISOString().split('T')[0]) {
      return `${displayHour} 🆕`;
    }
    
    return displayHour;
  };

  if (!next5Hours.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
      >
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('hourlyForecast')}</h3>
        <div className="text-center text-white/60 py-4">
          {t('noHourlyData')}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
    >
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">{t('hourlyForecast')}</h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
        {next5Hours.map((hour, index) => {
          const temp = unit === 'c' ? hour.temp_c : hour.temp_f;
          const displayTime = formatHour(hour.time, hour.date);
          
          return (
            <motion.div
              key={`${hour.time_epoch}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <div className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3 font-medium">
                {displayTime}
              </div>
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                {getWeatherIcon(hour.condition.text)}
              </div>
              <div className="text-white font-semibold text-sm sm:text-lg mb-1">
                {Math.round(temp)}°
              </div>
              <div className="text-white/60 text-xs hidden sm:block">
                {hour.chance_of_rain}% 🌧️
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 hidden sm:block">
        <div className="flex justify-center items-center space-x-6 text-white/60 text-sm">
          <div className="flex items-center space-x-2">
            <span>🌧️</span>
            <span>{t('chanceOfRain')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HourlyForecast;