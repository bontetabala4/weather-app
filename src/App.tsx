import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from './hooks/useWeather';
import { AppProvider } from './context/AppProvider';
import { useApp } from './context/useApp';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HamburgerMenu from './components/HamburgerMenu';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import WeatherDetails from './components/WeatherDetails';
import WeeklyForecast from './components/WeeklyForecast';
import MapSection from './components/MapSection';
import SettingsSection from './components/SettingsSection';
import DashboardSection from './components/DashboardSection';
import LoadingSpinner from './components/LoadingSpinner';
import WeatherAnimation from './components/WeatherAnimation';

const AppContent: React.FC = () => {
  const { weather, forecast, loading, error, unit, toggleUnit, getWeatherByLocation } = useWeather();
  const { theme } = useApp();
  const [activeSection, setActiveSection] = useState('weather');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    getWeatherByLocation(query);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isDay = weather ? new Date().getHours() >= 6 && new Date().getHours() < 20 : true;

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-300 text-center p-4 bg-red-500/20 rounded-xl">{error}</div>;

    switch (activeSection) {
      case 'map':
        return <MapSection />;
      
      case 'settings':
        return <SettingsSection />;
      
      case 'others':
        return <DashboardSection />;
      
      case 'weather':
      default:
        if (!weather || !forecast) return <div className="text-white/70 text-center">Chargement des données météo...</div>;
        
        return (
          <div className="space-y-6 relative z-10">
            <SearchBar onSearch={handleSearch} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <CurrentWeather weatherData={weather} unit={unit} />
                <HourlyForecast forecast={forecast} unit={unit} />
                <WeatherDetails weather={weather} />
              </div>

              <div className="xl:col-span-1">
                <WeeklyForecast forecast={forecast} unit={unit} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 relative overflow-hidden ${
      theme === 'dark' 
        ? ' from-gray-900 via-gray-800 to-gray-900' 
        : ' from-blue-400 via-blue-500 to-blue-600'
    } text-white p-4 sm:p-6`}>

      {weather && activeSection === 'weather' && (
        <WeatherAnimation 
          condition={weather.current.condition.text}
          conditionCode={weather.current.condition.code}
          isDay={isDay}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <Header onMenuToggle={toggleMenu} />

        <HamburgerMenu 
          isOpen={isMenuOpen}
          onClose={closeMenu}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {weather && activeSection === 'weather' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={toggleUnit}
            className="fixed bottom-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-4 shadow-lg transition-all duration-200 border border-white/20 z-30"
          >
            <span className="text-white font-semibold">°{unit.toUpperCase()}</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;