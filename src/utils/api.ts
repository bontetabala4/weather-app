import type { WeatherData, ForecastData, OpenWeatherCurrent, OpenWeatherForecast } from '../types/weather';

const API_KEY = 'bd05b1f241e968760cb84a10e32e228d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface GeocodingCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
  local_names?: Record<string, string>;
}

export const fetchWeather = async (location: string | { lat: number; lon: number }): Promise<WeatherData> => {
  let query: string;
  
  if (typeof location === 'string') {
    query = `q=${encodeURIComponent(location)}`;
  } else {
    query = `lat=${location.lat}&lon=${location.lon}`;
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather?${query}&appid=${API_KEY}&units=metric&lang=fr`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ville non trouvée. Vérifiez le nom de la ville.');
      } else if (response.status === 401) {
        throw new Error('Clé API invalide. Vérifiez votre configuration.');
      } else {
        throw new Error('Erreur serveur. Réessayez plus tard.');
      }
    }
    
    const data: OpenWeatherCurrent = await response.json();

    const localTime = new Date(Date.now() + data.timezone * 1000).toISOString();
    
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
        localtime: localTime,
      },
      current: {
        temp_c: Math.round(data.main.temp),
        temp_f: Math.round((data.main.temp * 9/5) + 32),
        condition: {
          text: capitalizeFirstLetter(data.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          code: data.weather[0].id,
        },
        wind_kph: Math.round(data.wind.speed * 3.6),
        humidity: data.main.humidity,
        feelslike_c: Math.round(data.main.feels_like),
        uv: 0,
        pressure_mb: data.main.pressure,
        vis_km: Math.round(data.visibility / 1000),
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur de réseau. Vérifiez votre connexion internet.');
  }
};

export const fetchForecast = async (location: string | { lat: number; lon: number }): Promise<ForecastData> => {
  let query: string;
  
  if (typeof location === 'string') {
    query = `q=${encodeURIComponent(location)}`;
  } else {
    query = `lat=${location.lat}&lon=${location.lon}`;
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=metric&lang=fr`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des prévisions');
    }
    
    const data: OpenWeatherForecast = await response.json();
 
    const dailyForecasts = groupForecastsByDay(data.list);
    
    return {
      forecast: {
        forecastday: dailyForecasts
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur de réseau lors de la récupération des prévisions');
  }
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const groupForecastsByDay = (forecasts: OpenWeatherForecast['list']) => {
  const grouped: { [key: string]: OpenWeatherForecast['list'] } = {};
  
  forecasts.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const dateString = date.toISOString().split('T')[0];
    
    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }
    grouped[dateString].push(forecast);
  });

  return Object.entries(grouped).slice(0, 7).map(([date, dayForecasts]) => {
    const temps = dayForecasts.map(f => f.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const middayForecast = dayForecasts.find(f => {
      const hour = new Date(f.dt * 1000).getHours();
      return hour >= 11 && hour <= 14;
    }) || dayForecasts[Math.floor(dayForecasts.length / 2)];
    
    return {
      date: date,
      date_epoch: Math.floor(new Date(date).getTime() / 1000),
      day: {
        maxtemp_c: Math.round(maxTemp),
        mintemp_c: Math.round(minTemp),
        avgtemp_c: Math.round(avgTemp),
        maxwind_kph: Math.round(Math.max(...dayForecasts.map(f => f.wind.speed * 3.6))),
        totalprecip_mm: Math.round(Math.max(...dayForecasts.map(f => f.pop * 10))),
        avgvis_km: Math.round(dayForecasts.reduce((sum, f) => sum + f.visibility / 1000, 0) / dayForecasts.length),
        avghumidity: Math.round(dayForecasts.reduce((sum, f) => sum + f.main.humidity, 0) / dayForecasts.length),
        condition: {
          text: capitalizeFirstLetter(middayForecast.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${middayForecast.weather[0].icon}@2x.png`,
          code: middayForecast.weather[0].id,
        },
        uv: 0,
      },
      hour: dayForecasts.map(forecast => ({
        time_epoch: forecast.dt,
        time: forecast.dt_txt,
        temp_c: Math.round(forecast.main.temp),
        temp_f: Math.round((forecast.main.temp * 9/5) + 32),
        condition: {
          text: capitalizeFirstLetter(forecast.weather[0].description),
          icon: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`,
          code: forecast.weather[0].id,
        },
        wind_kph: Math.round(forecast.wind.speed * 3.6),
        humidity: forecast.main.humidity,
        feelslike_c: Math.round(forecast.main.feels_like),
        chance_of_rain: Math.round(forecast.pop * 100),
        chance_of_snow: 0,
        uv: 0,
      }))
    };
  });
};

export const searchCities = async (query: string): Promise<Array<{name: string, country: string, lat: number, lon: number}>> => {
  if (!query.trim() || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data: GeocodingCity[] = await response.json();
    
    return data.map((city: GeocodingCity) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    }));
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    return [];
  }
};