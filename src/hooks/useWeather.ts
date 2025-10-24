import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, ForecastData } from '../types/weather';
import { fetchWeather, fetchForecast } from '../utils/api';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'c' | 'f'>('c');

  const getWeatherByLocation = useCallback(async (location: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(location),
        fetchForecast(location)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de récupérer les données météo');
      console.error('Erreur météo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUnit = () => {
    setUnit(unit === 'c' ? 'f' : 'c');
  };

  useEffect(() => {
    const loadInitialWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await getWeatherByLocation({ lat: latitude, lon: longitude });
          },
          async (error) => {
            console.warn('Géolocalisation failed:', error);
            await getWeatherByLocation('Kinshasa, CD');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } else { 
        await getWeatherByLocation('Kinshasa, CD');
      }
    };

    loadInitialWeather();
  }, [getWeatherByLocation]);

  return {
    weather,
    forecast,
    loading,
    error,
    unit,
    toggleUnit,
    getWeatherByLocation
  };
};