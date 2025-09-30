import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import type { WeatherData, ForecastData } from './types/weather'

const API_BASE_URL = 'http://localhost:3333'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (cityName: string) => {
    setLoading(true)
    setError('')
    
    try {
      const weatherResponse = await axios.get(`${API_BASE_URL}/weather?city=${encodeURIComponent(cityName)}`)
      const weatherData: WeatherData = weatherResponse.data
      setWeather(weatherData)
      
      // Récupérer les prévisions avec les coordonnées de la ville
      const forecastResponse = await axios.get(
        `${API_BASE_URL}/forecast?lat=${weatherData.lat}&lon=${weatherData.lon}`
      )
      setForecast(forecastResponse.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Erreur lors de la récupération des données météo')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeather(city.trim())
    }
  }

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Utiliser l'API de géolocalisation inverse pour obtenir la ville
            const { latitude, longitude } = position.coords
            const response = await axios.get(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=YOUR_API_KEY`
            )
            const cityName = response.data[0].name
            setCity(cityName)
            fetchWeather(cityName)
          } catch {
            setError('Impossible de déterminer votre ville')
            setLoading(false)
          }
        },
        () => {
          setError('Impossible d\'accéder à votre position')
          setLoading(false)
        }
      )
    } else {
      setError('La géolocalisation n\'est pas supportée par votre navigateur')
    }
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white text-center mb-8"
        >
          🌤️ Météo App
        </motion.h1>

        {/* Search Form */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Entrez une ville..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? '⏳' : '🔍'}
            </button>
            <button
              type="button"
              onClick={getLocationWeather}
              disabled={loading}
              className="px-4 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              📍
            </button>
          </div>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Current Weather */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 text-white mb-6 shadow-xl"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {weather.city}, {weather.country}
              </h2>
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={getWeatherIcon(weather.icon)} 
                  alt={weather.description}
                  className="w-24 h-24"
                />
                <span className="text-6xl font-light">{weather.temperature}°</span>
              </div>
              <p className="text-xl capitalize mb-2">{weather.description}</p>
              <p className="text-sm opacity-80">Ressenti {weather.feels_like}°</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-sm opacity-80">💨 Vent</p>
                <p className="font-semibold text-lg">{weather.wind_speed} m/s</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-sm opacity-80">💧 Humidité</p>
                <p className="font-semibold text-lg">{weather.humidity}%</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3">
                <p className="text-sm opacity-80">📊 Pression</p>
                <p className="font-semibold text-lg">{weather.pressure} hPa</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-white text-lg font-semibold mb-4">Prévisions 5 jours</h3>
            <div className="space-y-3">
              {forecast.map((day, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between text-white bg-white/10 rounded-2xl p-3"
                >
                  <span className="flex-1 font-medium">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })}
                  </span>
                  <img 
                    src={getWeatherIcon(day.icon)} 
                    alt={day.description}
                    className="w-10 h-10"
                  />
                  <span className="flex-1 text-center capitalize text-sm px-2">
                    {day.description}
                  </span>
                  <span className="flex-1 text-right font-semibold text-lg">
                    {day.temperature}°
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App