import React from 'react';
import { motion } from 'framer-motion';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useWeather } from '../hooks/useWeather';

const Home: React.FC = () => {
  const { weather, forecast, loading, error, unit, toggleUnit, getWeatherByLocation } = useWeather();

  const handleSearch = (query: string) => {
    getWeatherByLocation(query);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <SearchBar onSearch={handleSearch} />

      {loading && <LoadingSpinner />}

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-center mb-6 text-white"
        >
          {error}
        </motion.div>
      )}

      {weather && (
        <WeatherCard 
          weather={weather} 
          forecast={forecast} 
          unit={unit} 
          onToggleUnit={toggleUnit} 
        />
      )}
    </motion.div>
  );
};

export default Home;