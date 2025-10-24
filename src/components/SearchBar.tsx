import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '../utils/api';
import { useApp } from '../context/useApp';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { t } = useApp();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCitiesAsync = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Erreur recherche villes:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchCitiesAsync, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: CitySuggestion) => {
    onSearch(`${city.name},${city.country}`);
    setQuery('');
    setShowSuggestions(false);
  };

  const getCountryFlag = (countryCode: string) => {
    return countryCode.toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 relative"
      ref={searchRef}
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg pr-20"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl px-6 py-3 font-medium text-white"
        >
          {isSearching ? '🔍' : '🌤️'}
        </button>
      </form>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden z-50"
          >
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((city, index) => (
                <motion.button
                  key={`${city.name}-${city.country}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full text-left px-6 py-3 hover:bg-white/20 transition-colors border-b border-white/10 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{city.name}</div>
                      <div className="text-white/60 text-sm">
                        {getCountryFlag(city.country)} • {city.country}
                      </div>
                    </div>
                    <div className="text-white/40 text-xs">
                      {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {suggestions.length === 0 && query.length >= 2 && !isSearching && (
              <div className="px-6 py-4 text-center text-white/60">
                {t('noCityFound')} "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;