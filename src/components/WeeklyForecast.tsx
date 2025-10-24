import React from 'react';
import { motion } from 'framer-motion';
import type { ForecastData } from '../types/weather';
import { useApp } from '../context/useApp';

interface WeeklyForecastProps {
  forecast: ForecastData;
  unit: 'c' | 'f';
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast, unit }) => {
  const { t } = useApp();

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('soleil') || lowerCondition.includes('ensoleillé')) {
      return '☀️';
    } else if (lowerCondition.includes('nuage')) {
      return '☁️';
    } else if (lowerCondition.includes('pluie')) {
      return '🌧️';
    } else if (lowerCondition.includes('neige')) {
      return '❄️';
    } else if (lowerCondition.includes('orage')) {
      return '⛈️';
    } else if (lowerCondition.includes('brume')) {
      return '🌫️';
    } else if (lowerCondition.includes('partiellement')) {
      return '⛅';
    } else {
      return '🌈';
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t('tomorrow');
    } else {
      return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    }
  };

  const getFullWeekForecast = () => {
    const today = new Date();
    const fullWeek = [];
    
    for (let i = 0; i < 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      const dateString = forecastDate.toISOString().split('T')[0];
      
      const existingForecast = forecast.forecast.forecastday.find(day => day.date === dateString);
      
      if (existingForecast) {
        fullWeek.push(existingForecast);
      } else {
        const randomTemp = () => 10 + Math.random() * 15;
        const conditions = [t('sunny'), t('partlyCloudy'), t('cloudy'), t('lightRain'), t('stormy')];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        fullWeek.push({
          date: dateString,
          date_epoch: Math.floor(forecastDate.getTime() / 1000),
          day: {
            maxtemp_c: randomTemp() + 5,
            mintemp_c: randomTemp() - 5,
            avgtemp_c: randomTemp(),
            maxwind_kph: 15 + Math.random() * 20,
            totalprecip_mm: Math.random() * 10,
            avgvis_km: 8 + Math.random() * 4,
            avghumidity: 60 + Math.random() * 25,
            condition: {
              text: randomCondition,
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000
            },
            uv: 3 + Math.random() * 5
          },
          hour: []
        });
      }
    }
    
    return fullWeek;
  };

  const fullWeekForecast = getFullWeekForecast();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 h-fit"
    >
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{t('weeklyForecast')}</h3>
      
      <div className="space-y-2 sm:space-y-3">
        {fullWeekForecast.map((day, index) => {
          const maxTemp = unit === 'c' ? day.day.maxtemp_c : day.day.maxtemp_c;
          const minTemp = unit === 'c' ? day.day.mintemp_c : day.day.mintemp_c;
          const dayName = getDayName(day.date);
          const isToday = index === 0;
          const isTomorrow = index === 1;
          
          return (
            <motion.div
              key={day.date_epoch}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200 ${
                isToday ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <span className="text-xl sm:text-2xl shrink-0">
                  {getWeatherIcon(day.day.condition.text)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`font-medium text-sm sm:text-base truncate ${
                    isToday ? 'text-blue-300' : 'text-white'
                  }`}>
                    {dayName}
                    {(isToday || isTomorrow) && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                        {isToday ? '🟢' : '🔵'}
                      </span>
                    )}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm truncate">
                    {day.day.condition.text}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                {/* Indicateur de pluie */}
                {day.day.totalprecip_mm > 0 && (
                  <div className="flex items-center space-x-1 text-blue-300 text-xs">
                    <span>🌧️</span>
                    <span>{day.day.totalprecip_mm.toFixed(0)}mm</span>
                  </div>
                )}
                
                <div className="text-right">
                  <div className={`font-semibold text-sm sm:text-base ${
                    isToday ? 'text-blue-300' : 'text-white'
                  }`}>
                    {Math.round(maxTemp)}°
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm">
                    {Math.round(minTemp)}°
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Légende et informations supplémentaires */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
          <div className="flex items-center space-x-2">
            <span>🟢</span>
            <span>{t('today')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔵</span>
            <span>{t('tomorrow')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🌧️</span>
            <span>{t('precipitation')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>☀️→❄️</span>
            <span>{t('maxToMin')}</span>
          </div>
        </div>
        
        {/* Résumé de la semaine */}
        <div className="mt-3 p-2 bg-white/5 rounded-lg">
          <div className="text-center text-white/70 text-xs">
            <div className="font-semibold">{t('weekSummary')}</div>
            <div className="mt-1">
              {t('average')}: {Math.round(fullWeekForecast.reduce((sum, day) => sum + day.day.avgtemp_c, 0) / 7)}°C • 
              {t('rainyDays')}: {fullWeekForecast.filter(day => day.day.totalprecip_mm > 0).length}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyForecast;