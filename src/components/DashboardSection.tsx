import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { useApp } from '../context/useApp';

const DashboardSection: React.FC = () => {
  const { weather, forecast, getWeatherByLocation } = useWeather();
  const { settings, t } = useApp();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshData = useCallback(async () => {
    if (!weather) return;
    
    setIsRefreshing(true);
    try {
      await getWeatherByLocation(weather.location.name);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur actualisation:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [weather, getWeatherByLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (weather) {
        refreshData();
      }
    }, settings.refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [weather, settings.refreshInterval, refreshData]);

  const shareWeather = () => {
    if (weather && navigator.share) {
      navigator.share({
        title: `Météo à ${weather.location.name}`,
        text: `Il fait ${weather.current.temp_c}°C à ${weather.location.name}. ${weather.current.condition.text}`,
        url: window.location.href
      });
    } else if (weather) {
      const text = `Météo à ${weather.location.name}: ${weather.current.temp_c}°C - ${weather.current.condition.text}`;
      navigator.clipboard.writeText(text);
      alert('Météo copiée dans le presse-papier !');
    }
  };

  const exportData = () => {
    if (!weather || !forecast) return;
    
    const data = {
      location: weather.location,
      current: weather.current,
      forecast: forecast.forecast.forecastday,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meteo-${weather.location.name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const createAlert = () => {
    const threshold = prompt('Température seuil pour alerte (°C):', '30');
    if (threshold && weather) {
      alert(`Alerte créée: Vous serez notifié si la température dépasse ${threshold}°C à ${weather.location.name}`);
    }
  };

  const generateReport = () => {
    if (!weather || !forecast) return;
    
    const report = `
RAPPORT MÉTÉO - ${weather.location.name}
Généré le: ${new Date().toLocaleDateString('fr-FR')}

CONDITIONS ACTUELLES:
🌡️ Température: ${weather.current.temp_c}°C
💧 Humidité: ${weather.current.humidity}%
💨 Vent: ${weather.current.wind_kph} km/h
🌫️ Pression: ${weather.current.pressure_mb} hPa
👁️ Visibilité: ${weather.current.vis_km} km

PRÉVISIONS 7 JOURS:
${forecast.forecast.forecastday.map(day => 
  `📅 ${new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}: ${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C - ${day.day.condition.text}`
).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-meteo-${weather.location.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = forecast ? {
    maxTemp: Math.max(...forecast.forecast.forecastday.map(day => day.day.maxtemp_c)),
    minTemp: Math.min(...forecast.forecast.forecastday.map(day => day.day.mintemp_c)),
    avgTemp: forecast.forecast.forecastday.reduce((sum, day) => sum + day.day.avgtemp_c, 0) / forecast.forecast.forecastday.length,
    totalRain: forecast.forecast.forecastday.reduce((sum, day) => sum + day.day.totalprecip_mm, 0),
    sunnyDays: forecast.forecast.forecastday.filter(day => 
      day.day.condition.text.toLowerCase().includes('soleil') || day.day.condition.text.toLowerCase().includes('clair')
    ).length,
    rainyDays: forecast.forecast.forecastday.filter(day => day.day.totalprecip_mm > 0).length
  } : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">📊 Tableau de bord</h2>
            <p className="text-white/70">
              Données en temps réel • 
              Dernière actualisation: {lastUpdate.toLocaleTimeString('fr-FR')}
              {isRefreshing && ' 🔄 Actualisation...'}
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>{t('refresh')}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: '🔥', label: t('maxTemp'), value: `${Math.round(stats.maxTemp)}°C`, color: 'bg-gradient-to-br from-red-500 to-orange-500' },
            { icon: '❄️', label: t('minTemp'), value: `${Math.round(stats.minTemp)}°C`, color: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
            { icon: '📈', label: t('average'), value: `${Math.round(stats.avgTemp)}°C`, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
            { icon: '🌧️', label: t('totalRain'), value: `${stats.totalRain.toFixed(1)}mm`, color: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
            { icon: '☀️', label: t('sunnyDays'), value: stats.sunnyDays, color: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
            { icon: '🌦️', label: t('rainyDays'), value: stats.rainyDays, color: 'bg-gradient-to-br from-gray-500 to-blue-500' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${stat.color} rounded-2xl p-4 text-white shadow-lg`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">🚀 {t('quickActions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportData}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-white transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">📥</div>
            <div className="text-sm">{t('export')}</div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createAlert}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-white transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">🔔</div>
            <div className="text-sm">{t('alert')}</div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateReport}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-white transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm">{t('report')}</div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareWeather}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-white transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">📤</div>
            <div className="text-sm">{t('share')}</div>
          </motion.button>
        </div>
      </motion.div>

      {forecast && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">📈 {t('temperatureTrends')}</h3>
            <div className="space-y-3">
              {forecast.forecast.forecastday.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-white text-sm w-20">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                  <div className="flex items-center space-x-4 flex-1 max-w-48">
                    <span className="text-white/60 text-sm w-8 text-right">{Math.round(day.day.mintemp_c)}°</span>
                    <div className="flex-1 bg-white/20 rounded-full h-3">
                      <div 
                        className=" from-blue-400 to-red-400 h-3 rounded-full"
                        style={{ 
                          width: `${((day.day.maxtemp_c - (stats?.minTemp || 0)) / ((stats?.maxTemp || 1) - (stats?.minTemp || 0))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-white text-sm w-8">{Math.round(day.day.maxtemp_c)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">🌧️ {t('rainProbability')}</h3>
            <div className="space-y-4">
              {forecast.forecast.forecastday.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-white text-sm w-20">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                  <div className="flex-1 bg-white/20 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(day.day.totalprecip_mm * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-white text-sm w-12 text-right">
                    {day.day.totalprecip_mm > 0 ? `${day.day.totalprecip_mm.toFixed(1)}mm` : t('dry')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardSection;