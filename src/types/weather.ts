export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    uv: number;
    pressure_mb: number;
    vis_km: number;
  };
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    avgvis_km: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  hour: HourlyForecast[];
}

export interface HourlyForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  humidity: number;
  feelslike_c: number;
  chance_of_rain: number;
  chance_of_snow: number;
  uv: number;
}

export interface ForecastData {
  forecast: {
    forecastday: ForecastDay[];
  };
  location?: {
    name: string;
    country: string;
  };
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  unit: 'c' | 'f';
  notifications: boolean;
  locationAccess: boolean;
  language: string;
  refreshInterval: number;
}

export interface WeatherStats {
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  totalRain: number;
  sunnyDays: number;
  rainyDays: number;
}

export interface OpenWeatherCurrent {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherForecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    pop: number;
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
  };
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála' },
  { code: 'kg', name: 'Kikongo', nativeName: 'Kikongo' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

export const TRANSLATIONS = {
  fr: {
    noWeatherData: "Aucune donnée météo disponible",
    weather: 'Météo',
    map: 'Carte',
    settings: 'Paramètres',
    dashboard: 'Tableau de bord',
    navigation: 'Navigation',
    currentLocation: 'Localisation actuelle',
    location: 'Localisation',
    currentWeather: 'Météo Actuelle',
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    wind: 'Vent',
    pressure: 'Pression',
    visibility: 'Visibilité',
    uv: 'UV',
    sunrise: 'Lever',
    sunset: 'Coucher',
    hourlyForecast: 'Prévisions Horaires',
    weeklyForecast: 'Prévisions 7 Jours',
    weatherDetails: 'Détails Météo',
    today: 'Aujourd\'hui',
    tomorrow: 'Demain',
    searchPlaceholder: 'Rechercher une ville...',
    noCityFound: 'Aucune ville trouvée pour',
    chanceOfRain: 'Chance de pluie',
    noHourlyData: 'Aucune donnée disponible pour les prochaines heures',
    language: 'Langue',
    theme: 'Thème',
    units: 'Unités',
    notifications: 'Notifications',
    realTimeWeather: 'Météo en temps réel',
    realTimeForecasts: 'Prévisions en temps réel',
    weatherApp: 'Application Météo',
    weekSummary: 'Résumé de la semaine',
    average: 'Moyenne',
    rainyDays: 'Jours de pluie',
    precipitation: 'Précipitations',
    maxToMin: 'Max → Min',
    maxTemp: 'Température Max',
    minTemp: 'Température Min',
    totalRain: 'Pluie Totale',
    sunnyDays: 'Jours Ensoleillés',
    quickActions: 'Actions Rapides',
    temperatureTrends: 'Tendances de Température',
    rainProbability: 'Probabilité de Pluie',
    dry: 'Sec',
    sunny: 'Ensoleillé',
    partlyCloudy: 'Partiellement nuageux',
    cloudy: 'Nuageux',
    lightRain: 'Pluie légère',
    stormy: 'Orageux',
    windDescription: 'Vent modéré',
    humidityDescription: 'Confortable',
    pressureDescription: 'Normale',
    visibilityDescription: 'Bonne visibilité',
    feelsLikeDescription: 'Ressenti similaire',
    uvLow: 'Faible',
    uvModerate: 'Modéré',
    uvHigh: 'Élevé',
    uvVeryHigh: 'Très élevé',
    uvExtreme: 'Extrême',
    loading: 'Chargement...',
    refresh: 'Actualiser',
    export: 'Exporter',
    share: 'Partager',
    alert: 'Alerte',
    report: 'Rapport'
  },
  en: {
    noWeatherData: "No weather data available",
    weather: 'Weather',
    map: 'Map',
    settings: 'Settings',
    dashboard: 'Dashboard',
    navigation: 'Navigation',
    currentLocation: 'Current Location',
    location: 'Location',
    currentWeather: 'Current Weather',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    visibility: 'Visibility',
    uv: 'UV',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    hourlyForecast: 'Hourly Forecast',
    weeklyForecast: '7-Day Forecast',
    weatherDetails: 'Weather Details',
    today: 'Today',
    tomorrow: 'Tomorrow',
    searchPlaceholder: 'Search for a city...',
    noCityFound: 'No city found for',
    chanceOfRain: 'Chance of rain',
    noHourlyData: 'No data available for the next hours',
    language: 'Language',
    theme: 'Theme',
    units: 'Units',
    notifications: 'Notifications',
    realTimeWeather: 'Real-time weather',
    realTimeForecasts: 'Real-time forecasts',
    weatherApp: 'Weather App',
    weekSummary: 'Week summary',
    average: 'Average',
    rainyDays: 'Rainy days',
    precipitation: 'Precipitation',
    maxToMin: 'Max → Min',
    maxTemp: 'Max Temperature',
    minTemp: 'Min Temperature',
    totalRain: 'Total Rain',
    sunnyDays: 'Sunny Days',
    quickActions: 'Quick Actions',
    temperatureTrends: 'Temperature Trends',
    rainProbability: 'Rain Probability',
    dry: 'Dry',
    sunny: 'Sunny',
    partlyCloudy: 'Partly cloudy',
    cloudy: 'Cloudy',
    lightRain: 'Light rain',
    stormy: 'Stormy',
    windDescription: 'Moderate wind',
    humidityDescription: 'Comfortable',
    pressureDescription: 'Normal',
    visibilityDescription: 'Good visibility',
    feelsLikeDescription: 'Feels similar',
    uvLow: 'Low',
    uvModerate: 'Moderate',
    uvHigh: 'High',
    uvVeryHigh: 'Very high',
    uvExtreme: 'Extreme',
    loading: 'Loading...',
    refresh: 'Refresh',
    export: 'Export',
    share: 'Share',
    alert: 'Alert',
    report: 'Report'
  },
  ln: {
    noWeatherData: "Météo ezali te",
    currentWeather: 'Météo ya Sika',
    feelsLike: 'Emotungaka',
    humidity: 'Mai',
    wind: 'Mopepe',
    pressure: 'Pression',
    visibility: 'Komonana',
    uv: 'UV',
    sunrise: 'Lelo',
    sunset: 'Lole',
    hourlyForecast: 'Météo na ngonga',
    weeklyForecast: 'Météo na mikolo 7',
    searchPlaceholder: 'Sosa mboka...',
    settings: 'Paramètres',
    dashboard: 'Tableau de bord',
    map: 'Carte',
    weather: 'Météo',
    language: 'Lokota',
    theme: 'Thème',
    units: 'Ba unités',
    notifications: 'Ba notifications',
    loading: 'Kozongisa...',
    refresh: 'Kozongisa',
    today: 'Lelo',
    tomorrow: 'Lobi'
  },
  kg: {
    noWeatherData: "Météo kele ve",
    currentWeather: 'Météo ya Bubu',
    feelsLike: 'Yelaka',
    humidity: 'Maza',
    wind: 'Mpepo',
    pressure: 'Pression',
    visibility: 'Kumonana',
    uv: 'UV',
    sunrise: 'Ntangu yantika',
    sunset: 'Ntangu manaka',
    hourlyForecast: 'Météo na ngonga',
    weeklyForecast: 'Météo na bilumbu 7',
    searchPlaceholder: 'Sosa mbanza...',
    settings: 'Paramètres',
    dashboard: 'Tableau de bord',
    map: 'Carte',
    weather: 'Météo',
    language: 'Ndinga',
    theme: 'Thème',
    units: 'Ba unités',
    notifications: 'Ba notifications',
    loading: 'Kulanda...',
    refresh: 'Kuzonga',
    today: 'Bubu',
    tomorrow: 'Nkulu'
  },
  sw: {
    noWeatherData: "Hakuna data ya hali ya hewa",
    currentWeather: 'Hali ya Hewa ya Sasa',
    feelsLike: 'Inahisi Kama',
    humidity: 'Unyevu',
    wind: 'Upepo',
    pressure: 'Shinikizo',
    visibility: 'Uonekano',
    uv: 'UV',
    sunrise: 'Machweo',
    sunset: 'Macho',
    hourlyForecast: 'Utabiri wa Saa',
    weeklyForecast: 'Utabiri wa Siku 7',
    searchPlaceholder: 'Tafuta mji...',
    settings: 'Mipangilio',
    dashboard: 'Dashibodi',
    map: 'Ramani',
    weather: 'Hali ya Hewa',
    language: 'Lugha',
    theme: 'Mandhari',
    units: 'Vipimo',
    notifications: 'Arifa',
    loading: 'Inapakia...',
    refresh: 'Osha upya',
    today: 'Leo',
    tomorrow: 'Kesho'
  },
  ar: {
    noWeatherData: "لا توجد بيانات الطقس",
    currentWeather: 'الطقس الحالي',
    feelsLike: 'يشعر مثل',
    humidity: 'الرطوبة',
    wind: 'الرياح',
    pressure: 'الضغط',
    visibility: 'الرؤية',
    uv: 'الأشعة فوق البنفسجية',
    sunrise: 'الشروق',
    sunset: 'الغروب',
    hourlyForecast: 'توقعات كل ساعة',
    weeklyForecast: 'توقعات 7 أيام',
    searchPlaceholder: 'ابحث عن مدينة...',
    settings: 'الإعدادات',
    dashboard: 'لوحة التحكم',
    map: 'الخريطة',
    weather: 'الطقس',
    language: 'اللغة',
    theme: 'السمة',
    units: 'الوحدات',
    notifications: 'الإشعارات',
    loading: 'جاري التحميل...',
    refresh: 'تحديث',
    today: 'اليوم',
    tomorrow: 'غداً'
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.fr;

export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const convertFahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};