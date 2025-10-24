import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const fixLeafletIcons = (): void => {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  weather?: {
    temp: number;
    condition: string;
  };
}

const MapAnimator: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 2,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);

  return null;
};

const MapSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const [mapZoom, setMapZoom] = useState(3);
  const [isGlobeView, setIsGlobeView] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const popularCities: City[] = [
    { 
      name: 'Paris', 
      country: 'France', 
      lat: 48.8566, 
      lon: 2.3522,
      weather: { temp: 18, condition: 'Ensoleillé' }
    },
    { 
      name: 'Londres', 
      country: 'Royaume-Uni', 
      lat: 51.5074, 
      lon: -0.1278,
      weather: { temp: 15, condition: 'Nuageux' }
    },
    { 
      name: 'New York', 
      country: 'USA', 
      lat: 40.7128, 
      lon: -74.0060,
      weather: { temp: 22, condition: 'Partiellement nuageux' }
    },
    { 
      name: 'Tokyo', 
      country: 'Japon', 
      lat: 35.6762, 
      lon: 139.6503,
      weather: { temp: 25, condition: 'Pluie légère' }
    },
    { 
      name: 'Sydney', 
      country: 'Australie', 
      lat: -33.8688, 
      lon: 151.2093,
      weather: { temp: 28, condition: 'Ensoleillé' }
    },
    { 
      name: 'Dubai', 
      country: 'Émirats Arabes Unis', 
      lat: 25.2048, 
      lon: 55.2708,
      weather: { temp: 35, condition: 'Clair' }
    },
    { 
      name: 'Rio de Janeiro', 
      country: 'Brésil', 
      lat: -22.9068, 
      lon: -43.1729,
      weather: { temp: 30, condition: 'Orageux' }
    },
    { 
      name: 'Cape Town', 
      country: 'Afrique du Sud', 
      lat: -33.9249, 
      lon: 18.4241,
      weather: { temp: 20, condition: 'Venteux' }
    }
  ];

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setMapCenter([city.lat, city.lon]);
    setMapZoom(10);
    setIsGlobeView(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const foundCity = popularCities.find(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (foundCity) {
        handleCitySelect(foundCity);
      } else {
        alert(`Ville "${searchQuery}" non trouvée. Essayez une des villes populaires.`);
      }
    }
  };

  const toggleGlobeView = () => {
    if (isGlobeView) {
      setMapCenter(selectedCity ? [selectedCity.lat, selectedCity.lon] : [48.8566, 2.3522]);
      setMapZoom(selectedCity ? 10 : 3);
    } else {
      setMapCenter([20, 0]);
      setMapZoom(2);
    }
    setIsGlobeView(!isGlobeView);
  };

  const getWeatherIcon = (condition: string): string => {
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

  const mapStyle = {
    height: '400px',
    width: '100%',
    borderRadius: '12px',
    zIndex: 1
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🗺️ Carte Mondiale Interactive</h2>
            <p className="text-white/70">Explorez la météo autour du globe en temps réel</p>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleGlobeView}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isGlobeView 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>🌍</span>
              <span>{isGlobeView ? 'Vue Détaillée' : 'Vue Globe'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMapCenter([48.8566, 2.3522]);
                setMapZoom(3);
                setSelectedCity(null);
                setIsGlobeView(false);
              }}
              className="bg-white/10 hover:bg-white/20 text-white/70 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200"
            >
              Réinitialiser
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une ville (ex: Paris, New York, Tokyo...)"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
            >
              <span className="text-white">🔍</span>
            </button>
          </div>
        </form>

        <div className="relative mb-6">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={mapStyle}
            scrollWheelZoom={true}
            className="rounded-xl shadow-2xl">
            <MapAnimator center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {popularCities.map((city) => (
              <Marker
                key={`${city.lat}-${city.lon}`}
                position={[city.lat, city.lon]}
                eventHandlers={{
                  click: () => handleCitySelect(city),
                }}>
                <Popup>
                  <div className="text-center min-w-[150px]">
                    <div className="font-bold text-lg">{city.name}</div>
                    <div className="text-gray-600 mb-2">{city.country}</div>
                    {city.weather && (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">{getWeatherIcon(city.weather.condition)}</span>
                        <div>
                          <div className="font-semibold">{city.weather.temp}°C</div>
                          <div className="text-sm text-gray-500">{city.weather.condition}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white z-10">
            <div className="text-sm">
              <div>🌍 {isGlobeView ? 'Vue Globe' : 'Vue Carte'}</div>
              <div>📍 Zoom: {mapZoom}x</div>
              {selectedCity && (
                <div className="mt-1 text-xs">
                  Sélection: {selectedCity.name}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  📍 {selectedCity.name}, {selectedCity.country}
                </h3>
                <p className="text-white/70">
                  Coordonnées: {selectedCity.lat.toFixed(4)}, {selectedCity.lon.toFixed(4)}
                </p>
              </div>
              {selectedCity.weather && (
                <div className="text-right">
                  <div className="text-3xl">{getWeatherIcon(selectedCity.weather.condition)}</div>
                  <div className="text-white font-semibold">{selectedCity.weather.temp}°C</div>
                  <div className="text-white/60 text-sm">{selectedCity.weather.condition}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">🌆 Villes Populaires</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularCities.map((city) => (
              <motion.button
                key={city.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCitySelect(city)}
                className={`bg-white/10 hover:bg-white/20 rounded-lg p-3 text-white text-left transition-all duration-200 ${
                  selectedCity?.name === city.name ? 'ring-2 ring-blue-400 bg-white/20' : ''
                }`}
              >
                <div className="font-semibold flex items-center space-x-2">
                  <span>{getWeatherIcon(city.weather?.condition || '')}</span>
                  <span>{city.name}</span>
                </div>
                <div className="text-white/60 text-sm">{city.country}</div>
                {city.weather && (
                  <div className="text-white/80 text-sm mt-1">
                    {city.weather.temp}°C • {city.weather.condition}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <h4 className="text-white font-semibold mb-3">📋 Légende de la Carte</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70">
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>Ville avec météo</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>☀️</span>
              <span>Ensoleillé</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌧️</span>
              <span>Pluie</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⛅</span>
              <span>Partiellement nuageux</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MapSection;